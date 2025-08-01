import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Database connection
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// GET /api/laws-regs-files - ดึงรายการ laws regs files
export async function GET(request) {
  let connection;
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const sectionId = searchParams.get('sectionId');
    const filesType = searchParams.get('filesType');

    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    // Build WHERE clause
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (lrf.files_path LIKE ? OR lrs.section_name LIKE ? OR lrt.type_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (sectionId) {
      whereClause += ' AND lrf.section_id = ?';
      params.push(parseInt(sectionId));
    }

    if (filesType) {
      whereClause += ' AND lrf.files_type = ?';
      params.push(filesType);
    }

    // Get laws regs files with section and type info
    const [files] = await connection.execute(
      `SELECT lrf.*, lrs.section_name, lrt.type_name 
       FROM laws_regs_files lrf 
       LEFT JOIN laws_regs_sections lrs ON lrf.section_id = lrs.id 
       LEFT JOIN laws_regs_types lrt ON lrs.type_id = lrt.id 
       ${whereClause} ORDER BY lrf.created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Get total count
    const [countResult] = await connection.execute(
      `SELECT COUNT(*) as total FROM laws_regs_files lrf 
       LEFT JOIN laws_regs_sections lrs ON lrf.section_id = lrs.id 
       LEFT JOIN laws_regs_types lrt ON lrs.type_id = lrt.id 
       ${whereClause}`,
      params
    );

    const total = countResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: files,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching laws regs files:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch laws regs files', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// POST /api/laws-regs-files - สร้าง laws regs file ใหม่
export async function POST(request) {
  let connection;
  
  try {
    const body = await request.json();
    const { section_id, files_path, files_type } = body;

    // Validation
    if (!section_id || !files_path || !files_type) {
      return NextResponse.json(
        { success: false, error: 'Section ID, file path, and file type are required' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Check if section exists
    const [sectionCheck] = await connection.execute(
      'SELECT id FROM laws_regs_sections WHERE id = ?',
      [section_id]
    );

    if (sectionCheck.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Laws regs section not found' },
        { status: 404 }
      );
    }

    // Insert laws regs file
    const [result] = await connection.execute(
      'INSERT INTO laws_regs_files (section_id, files_path, files_type, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [section_id, files_path, files_type]
    );

    // Get the created file with section and type info
    const [createdFile] = await connection.execute(
      `SELECT lrf.*, lrs.section_name, lrt.type_name 
       FROM laws_regs_files lrf 
       LEFT JOIN laws_regs_sections lrs ON lrf.section_id = lrs.id 
       LEFT JOIN laws_regs_types lrt ON lrs.type_id = lrt.id 
       WHERE lrf.id = ?`,
      [result.insertId]
    );

    return NextResponse.json({
      success: true,
      data: createdFile[0],
      message: 'Laws regs file created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating laws regs file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create laws regs file', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}