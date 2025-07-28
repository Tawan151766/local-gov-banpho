import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Database connection
const dbConfig = {
  host: '103.80.48.25',
  port: 3306,
  user: 'gmsky_banphokorat',
  password: 'banphokorat56789',
  database: 'gmsky_banphokorat'
};

// GET /api/laws-regs-sections - ดึงรายการ laws regs sections
export async function GET(request) {
  let connection;
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const typeId = searchParams.get('typeId');
    const withFiles = searchParams.get('withFiles') === 'true';

    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    // Build WHERE clause
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (lrs.section_name LIKE ? OR lrt.type_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (typeId) {
      whereClause += ' AND lrs.type_id = ?';
      params.push(parseInt(typeId));
    }

    // Get laws regs sections with type info
    const [sections] = await connection.execute(
      `SELECT lrs.*, lrt.type_name 
       FROM laws_regs_sections lrs 
       LEFT JOIN laws_regs_types lrt ON lrs.type_id = lrt.id 
       ${whereClause} ORDER BY lrs.created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Get total count
    const [countResult] = await connection.execute(
      `SELECT COUNT(*) as total FROM laws_regs_sections lrs 
       LEFT JOIN laws_regs_types lrt ON lrs.type_id = lrt.id 
       ${whereClause}`,
      params
    );

    const total = countResult[0]?.total || 0;

    // If withFiles is true, get files for each section
    let sectionsWithFiles = sections;
    if (withFiles && sections.length > 0) {
      const sectionIds = sections.map(section => section.id);
      const placeholders = sectionIds.map(() => '?').join(',');
      
      const [files] = await connection.execute(
        `SELECT * FROM laws_regs_files WHERE section_id IN (${placeholders}) ORDER BY created_at ASC`,
        sectionIds
      );

      // Group files by section_id
      const filesBySection = files.reduce((acc, file) => {
        if (!acc[file.section_id]) {
          acc[file.section_id] = [];
        }
        acc[file.section_id].push(file);
        return acc;
      }, {});

      // Add files to each section
      sectionsWithFiles = sections.map(section => ({
        ...section,
        files: filesBySection[section.id] || []
      }));
    }

    return NextResponse.json({
      success: true,
      data: sectionsWithFiles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching laws regs sections:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch laws regs sections', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// POST /api/laws-regs-sections - สร้าง laws regs section ใหม่
export async function POST(request) {
  let connection;
  
  try {
    const body = await request.json();
    const { type_id, section_name, files = [] } = body;

    // Validation
    if (!type_id || !section_name) {
      return NextResponse.json(
        { success: false, error: 'Type ID and section name are required' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Start transaction
    await connection.beginTransaction();

    try {
      // Check if type exists
      const [typeCheck] = await connection.execute(
        'SELECT id FROM laws_regs_types WHERE id = ?',
        [type_id]
      );

      if (typeCheck.length === 0) {
        await connection.rollback();
        return NextResponse.json(
          { success: false, error: 'Laws regs type not found' },
          { status: 404 }
        );
      }

      // Insert laws regs section
      const [result] = await connection.execute(
        'INSERT INTO laws_regs_sections (type_id, section_name, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
        [type_id, section_name]
      );

      const sectionId = result.insertId;

      // Insert files if provided
      if (files && files.length > 0) {
        for (const file of files) {
          if (file.files_path && file.files_type) {
            await connection.execute(
              'INSERT INTO laws_regs_files (section_id, files_path, files_type, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
              [sectionId, file.files_path, file.files_type]
            );
          }
        }
      }

      // Commit transaction
      await connection.commit();

      // Get the created section with type info and files
      const [createdSection] = await connection.execute(
        `SELECT lrs.*, lrt.type_name 
         FROM laws_regs_sections lrs 
         LEFT JOIN laws_regs_types lrt ON lrs.type_id = lrt.id 
         WHERE lrs.id = ?`,
        [sectionId]
      );

      const [createdFiles] = await connection.execute(
        'SELECT * FROM laws_regs_files WHERE section_id = ?',
        [sectionId]
      );

      const sectionWithFiles = {
        ...createdSection[0],
        files: createdFiles
      };

      return NextResponse.json({
        success: true,
        data: sectionWithFiles,
        message: 'Laws regs section created successfully'
      }, { status: 201 });

    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Error creating laws regs section:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create laws regs section', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}