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

// GET /api/ita-evaluations - ดึงรายการ evaluations
export async function GET(request) {
  let connection;
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const withContents = searchParams.get('withContents') === 'true';

    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    // Build WHERE clause
    let whereClause = 'WHERE deleted_at IS NULL';
    const params = [];

    if (search) {
      whereClause += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Get evaluations
    const [evaluations] = await connection.execute(
      `SELECT * FROM ita_evaluations ${whereClause} ORDER BY ita_date DESC, created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Get total count
    const [countResult] = await connection.execute(
      `SELECT COUNT(*) as total FROM ita_evaluations ${whereClause}`,
      params
    );

    const total = countResult[0]?.total || 0;

    // If withContents is true, get contents for each evaluation
    let evaluationsWithContents = evaluations;
    if (withContents && evaluations.length > 0) {
      const evaluationIds = evaluations.map(evaluation => evaluation.id);
      const placeholders = evaluationIds.map(() => '?').join(',');
      
      const [contents] = await connection.execute(
        `SELECT * FROM ita_contents WHERE evaluation_id IN (${placeholders}) AND deleted_at IS NULL ORDER BY created_at ASC`,
        evaluationIds
      );

      // Group contents by evaluation_id
      const contentsByEvaluation = contents.reduce((acc, content) => {
        if (!acc[content.evaluation_id]) {
          acc[content.evaluation_id] = [];
        }
        acc[content.evaluation_id].push(content);
        return acc;
      }, {});

      // Add contents to each evaluation
      evaluationsWithContents = evaluations.map(evaluation => ({
        ...evaluation,
        contents: contentsByEvaluation[evaluation.id] || []
      }));
    }

    return NextResponse.json({
      success: true,
      data: evaluationsWithContents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching evaluations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch evaluations', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// POST /api/ita-evaluations - สร้าง evaluation ใหม่
export async function POST(request) {
  let connection;
  
  try {
    const body = await request.json();
    const { name, description, ita_date, contents = [] } = body;

    // Validation
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Start transaction
    await connection.beginTransaction();

    try {
      // Insert evaluation
      const [result] = await connection.execute(
        'INSERT INTO ita_evaluations (name, description, ita_date, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
        [name, description || null, ita_date || null]
      );

      const evaluationId = result.insertId;

      // Insert contents if provided
      if (contents && contents.length > 0) {
        for (const content of contents) {
          if (content.url) {
            await connection.execute(
              'INSERT INTO ita_contents (url, description, evaluation_id, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
              [content.url, content.description || null, evaluationId]
            );
          }
        }
      }

      // Commit transaction
      await connection.commit();

      // Get the created evaluation with contents
      const [createdEvaluation] = await connection.execute(
        'SELECT * FROM ita_evaluations WHERE id = ?',
        [evaluationId]
      );

      const [createdContents] = await connection.execute(
        'SELECT * FROM ita_contents WHERE evaluation_id = ? AND deleted_at IS NULL',
        [evaluationId]
      );

      const evaluationWithContents = {
        ...createdEvaluation[0],
        contents: createdContents
      };

      return NextResponse.json({
        success: true,
        data: evaluationWithContents,
        message: 'Evaluation created successfully'
      }, { status: 201 });

    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Error creating evaluation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create evaluation', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}