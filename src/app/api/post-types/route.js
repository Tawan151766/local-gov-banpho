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

// GET /api/post-types - ดึงรายการ post types
export async function GET(request) {
  let connection;
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const withDetails = searchParams.get('withDetails') === 'true';

    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    // Build WHERE clause
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND type_name LIKE ?';
      params.push(`%${search}%`);
    }

    // Get post types
    const [postTypes] = await connection.execute(
      `SELECT * FROM post_types ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Get total count
    const [countResult] = await connection.execute(
      `SELECT COUNT(*) as total FROM post_types ${whereClause}`,
      params
    );

    const total = countResult[0]?.total || 0;

    // If withDetails is true, get post details for each type
    let postTypesWithDetails = postTypes;
    if (withDetails && postTypes.length > 0) {
      const typeIds = postTypes.map(type => type.id);
      const placeholders = typeIds.map(() => '?').join(',');
      
      const [postDetails] = await connection.execute(
        `SELECT * FROM post_details WHERE post_type_id IN (${placeholders}) ORDER BY created_at DESC`,
        typeIds
      );

      // Group post details by post_type_id
      const detailsByType = postDetails.reduce((acc, detail) => {
        if (!acc[detail.post_type_id]) {
          acc[detail.post_type_id] = [];
        }
        acc[detail.post_type_id].push(detail);
        return acc;
      }, {});

      // Add post details to each type
      postTypesWithDetails = postTypes.map(type => ({
        ...type,
        postDetails: detailsByType[type.id] || []
      }));
    }

    return NextResponse.json({
      success: true,
      data: postTypesWithDetails,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching post types:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post types', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// POST /api/post-types - สร้าง post type ใหม่
export async function POST(request) {
  let connection;
  
  try {
    const body = await request.json();
    const { type_name } = body;

    // Validation
    if (!type_name) {
      return NextResponse.json(
        { success: false, error: 'Type name is required' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Check if type name already exists
    const [existingType] = await connection.execute(
      'SELECT id FROM post_types WHERE type_name = ?',
      [type_name]
    );

    if (existingType.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Type name already exists' },
        { status: 409 }
      );
    }

    // Insert post type
    const [result] = await connection.execute(
      'INSERT INTO post_types (type_name, created_at, updated_at) VALUES (?, NOW(), NOW())',
      [type_name]
    );

    // Get the created post type
    const [createdType] = await connection.execute(
      'SELECT * FROM post_types WHERE id = ?',
      [result.insertId]
    );

    return NextResponse.json({
      success: true,
      data: createdType[0],
      message: 'Post type created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating post type:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create post type', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}