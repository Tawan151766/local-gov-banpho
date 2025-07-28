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

// GET /api/laws-regs-types - ดึงรายการ laws regs types
export async function GET(request) {
  let connection;
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const withSections = searchParams.get('withSections') === 'true';

    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    // Build WHERE clause
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND type_name LIKE ?';
      params.push(`%${search}%`);
    }

    // Get laws regs types
    const [types] = await connection.execute(
      `SELECT * FROM laws_regs_types ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Get total count
    const [countResult] = await connection.execute(
      `SELECT COUNT(*) as total FROM laws_regs_types ${whereClause}`,
      params
    );

    const total = countResult[0]?.total || 0;

    // If withSections is true, get sections for each type
    let typesWithSections = types;
    if (withSections && types.length > 0) {
      const typeIds = types.map(type => type.id);
      const placeholders = typeIds.map(() => '?').join(',');
      
      const [sections] = await connection.execute(
        `SELECT * FROM laws_regs_sections WHERE type_id IN (${placeholders}) ORDER BY created_at ASC`,
        typeIds
      );

      // Group sections by type_id
      const sectionsByType = sections.reduce((acc, section) => {
        if (!acc[section.type_id]) {
          acc[section.type_id] = [];
        }
        acc[section.type_id].push(section);
        return acc;
      }, {});

      // Add sections to each type
      typesWithSections = types.map(type => ({
        ...type,
        sections: sectionsByType[type.id] || []
      }));
    }

    return NextResponse.json({
      success: true,
      data: typesWithSections,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching laws regs types:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch laws regs types', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// POST /api/laws-regs-types - สร้าง laws regs type ใหม่
export async function POST(request) {
  let connection;
  
  try {
    const body = await request.json();
    const { type_name, sections = [] } = body;

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
        'SELECT id FROM laws_regs_types WHERE type_name = ?',
        [type_name]
      );

      if (existingType.length > 0) {
        await connection.rollback();
        return NextResponse.json(
          { success: false, error: 'Type name already exists' },
          { status: 409 }
        );
      }

      // Insert laws regs type
      const [result] = await connection.execute(
        'INSERT INTO laws_regs_types (type_name, created_at, updated_at) VALUES (?, NOW(), NOW())',
        [type_name]
      );

      const typeId = result.insertId;

      // Insert sections if provided
      if (sections && sections.length > 0) {
        for (const section of sections) {
          if (section.section_name) {
            await connection.execute(
              'INSERT INTO laws_regs_sections (type_id, section_name, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
              [typeId, section.section_name]
            );
          }
        }
      }

      // Commit transaction
      await connection.commit();

      // Get the created type with sections
      const [createdType] = await connection.execute(
        'SELECT * FROM laws_regs_types WHERE id = ?',
        [typeId]
      );

      const [createdSections] = await connection.execute(
        'SELECT * FROM laws_regs_sections WHERE type_id = ?',
        [typeId]
      );

      const typeWithSections = {
        ...createdType[0],
        sections: createdSections
      };

      return NextResponse.json({
        success: true,
        data: typeWithSections,
        message: 'Laws regs type created successfully'
      }, { status: 201 });

    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Error creating laws regs type:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create laws regs type', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}