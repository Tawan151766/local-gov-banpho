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

// GET /api/procurement-plan-types - ดึงรายการ procurement plan types
export async function GET(request) {
  let connection;
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const withFiles = searchParams.get('withFiles') === 'true';

    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    // Build WHERE clause
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND type_name LIKE ?';
      params.push(`%${search}%`);
    }

    // Get procurement plan types
    const [types] = await connection.execute(
      `SELECT * FROM procurement_plan_types ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Get total count
    const [countResult] = await connection.execute(
      `SELECT COUNT(*) as total FROM procurement_plan_types ${whereClause}`,
      params
    );

    const total = countResult[0]?.total || 0;

    // If withFiles is true, get files for each type
    let typesWithFiles = types;
    if (withFiles && types.length > 0) {
      const typeIds = types.map(type => type.id);
      const placeholders = typeIds.map(() => '?').join(',');
      
      const [files] = await connection.execute(
        `SELECT * FROM procurement_plan_files WHERE type_id IN (${placeholders}) ORDER BY created_at ASC`,
        typeIds
      );

      // Group files by type_id
      const filesByType = files.reduce((acc, file) => {
        if (!acc[file.type_id]) {
          acc[file.type_id] = [];
        }
        acc[file.type_id].push(file);
        return acc;
      }, {});

      // Add files to each type
      typesWithFiles = types.map(type => ({
        ...type,
        files: filesByType[type.id] || []
      }));
    }

    return NextResponse.json({
      success: true,
      data: typesWithFiles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching procurement plan types:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch procurement plan types', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// POST /api/procurement-plan-types - สร้าง procurement plan type ใหม่
export async function POST(request) {
  let connection;
  
  try {
    const body = await request.json();
    const { type_name, files = [] } = body;

    // Validation
    if (!type_name) {
      return NextResponse.json(
        { success: false, error: 'Type name is required' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Start transaction
    await connection.beginTransaction();

    try {
      // Check if type name already exists
      const [existingType] = await connection.execute(
        'SELECT id FROM procurement_plan_types WHERE type_name = ?',
        [type_name]
      );

      if (existingType.length > 0) {
        await connection.rollback();
        return NextResponse.json(
          { success: false, error: 'Type name already exists' },
          { status: 409 }
        );
      }

      // Insert procurement plan type
      const [result] = await connection.execute(
        'INSERT INTO procurement_plan_types (type_name, created_at, updated_at) VALUES (?, NOW(), NOW())',
        [type_name]
      );

      const typeId = result.insertId;

      // Insert files if provided
      if (files && files.length > 0) {
        for (const file of files) {
          if (file.files_path && file.files_type) {
            await connection.execute(
              'INSERT INTO procurement_plan_files (type_id, files_path, files_type, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
              [typeId, file.files_path, file.files_type]
            );
          }
        }
      }

      // Commit transaction
      await connection.commit();

      // Get the created type with files
      const [createdType] = await connection.execute(
        'SELECT * FROM procurement_plan_types WHERE id = ?',
        [typeId]
      );

      const [createdFiles] = await connection.execute(
        'SELECT * FROM procurement_plan_files WHERE type_id = ?',
        [typeId]
      );

      const typeWithFiles = {
        ...createdType[0],
        files: createdFiles
      };

      return NextResponse.json({
        success: true,
        data: typeWithFiles,
        message: 'Procurement plan type created successfully'
      }, { status: 201 });

    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Error creating procurement plan type:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create procurement plan type', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}