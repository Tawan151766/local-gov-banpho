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

// GET /api/ita-contents - ดึงรายการ contents
export async function GET(request) {
  let connection;
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const evaluationId = searchParams.get('evaluationId');

    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    // Build WHERE clause
    let whereClause = 'WHERE c.deleted_at IS NULL';
    const params = [];

    if (search) {
      whereClause += ' AND (c.url LIKE ? OR c.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (evaluationId) {
      whereClause += ' AND c.evaluation_id = ?';
      params.push(parseInt(evaluationId));
    }

    // Get contents with evaluation info
    const [contents] = await connection.execute(
      `SELECT c.*, e.name as evaluation_name, e.ita_date 
       FROM ita_contents c 
       LEFT JOIN ita_evaluations e ON c.evaluation_id = e.id 
       ${whereClause} ORDER BY c.created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Get total count
    const [countResult] = await connection.execute(
      `SELECT COUNT(*) as total FROM ita_contents c 
       LEFT JOIN ita_evaluations e ON c.evaluation_id = e.id 
       ${whereClause}`,
      params
    );

    const total = countResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: contents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching contents:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contents', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// POST /api/ita-contents - สร้าง content ใหม่
export async function POST(request) {
  let connection;
  
  try {
    const body = await request.json();
    const { url, description, evaluation_id } = body;

    // Validation
    if (!url || !evaluation_id) {
      return NextResponse.json(
        { success: false, error: 'URL and evaluation ID are required' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Check if evaluation exists
    const [evaluationCheck] = await connection.execute(
      'SELECT id FROM ita_evaluations WHERE id = ? AND deleted_at IS NULL',
      [evaluation_id]
    );

    if (evaluationCheck.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Evaluation not found' },
        { status: 404 }
      );
    }

    // Insert content
    const [result] = await connection.execute(
      'INSERT INTO ita_contents (url, description, evaluation_id, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [url, description || null, evaluation_id]
    );

    // Get the created content with evaluation info
    const [createdContent] = await connection.execute(
      `SELECT c.*, e.name as evaluation_name, e.ita_date 
       FROM ita_contents c 
       LEFT JOIN ita_evaluations e ON c.evaluation_id = e.id 
       WHERE c.id = ?`,
      [result.insertId]
    );

    return NextResponse.json({
      success: true,
      data: createdContent[0],
      message: 'Content created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create content', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}