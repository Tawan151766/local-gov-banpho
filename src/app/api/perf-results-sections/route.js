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

// GET /api/perf-results-sections - ดึงรายการ sections
export async function GET(request) {
  let connection;
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const typeId = searchParams.get('typeId');
    const withSubTopics = searchParams.get('withSubTopics') === 'true';

    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    // Build WHERE clause
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND section_name LIKE ?';
      params.push(`%${search}%`);
    }

    if (typeId) {
      whereClause += ' AND type_id = ?';
      params.push(parseInt(typeId));
    }

    // Get sections
    const [sections] = await connection.execute(
      `SELECT s.*, t.type_name FROM perf_results_sections s 
       LEFT JOIN perf_results_types t ON s.type_id = t.id 
       ${whereClause} ORDER BY s.created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Get total count
    const [countResult] = await connection.execute(
      `SELECT COUNT(*) as total FROM perf_results_sections ${whereClause}`,
      params
    );

    const total = countResult[0]?.total || 0;

    // If withSubTopics is true, get sub topics for each section
    let sectionsWithSubTopics = sections;
    if (withSubTopics && sections.length > 0) {
      const sectionIds = sections.map(section => section.id);
      const placeholders = sectionIds.map(() => '?').join(',');
      
      const [subTopics] = await connection.execute(
        `SELECT * FROM perf_results_sub_topics WHERE section_id IN (${placeholders}) ORDER BY created_at ASC`,
        sectionIds
      );

      // Group sub topics by section_id
      const subTopicsBySection = subTopics.reduce((acc, subTopic) => {
        if (!acc[subTopic.section_id]) {
          acc[subTopic.section_id] = [];
        }
        acc[subTopic.section_id].push(subTopic);
        return acc;
      }, {});

      // Add sub topics to each section
      sectionsWithSubTopics = sections.map(section => ({
        ...section,
        subTopics: subTopicsBySection[section.id] || []
      }));
    }

    return NextResponse.json({
      success: true,
      data: sectionsWithSubTopics,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching sections:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sections', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// POST /api/perf-results-sections - สร้าง section ใหม่
export async function POST(request) {
  let connection;
  
  try {
    const body = await request.json();
    const { type_id, section_name, date, subTopics = [] } = body;

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
      // Insert section
      const [result] = await connection.execute(
        'INSERT INTO perf_results_sections (type_id, section_name, date, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
        [type_id, section_name, date || null]
      );

      const sectionId = result.insertId;

      // Insert sub topics if provided
      if (subTopics && subTopics.length > 0) {
        for (const subTopic of subTopics) {
          if (subTopic.topic_name) {
            await connection.execute(
              'INSERT INTO perf_results_sub_topics (section_id, topic_name, date, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
              [sectionId, subTopic.topic_name, subTopic.date || null]
            );
          }
        }
      }

      // Commit transaction
      await connection.commit();

      // Get the created section with sub topics
      const [createdSection] = await connection.execute(
        'SELECT s.*, t.type_name FROM perf_results_sections s LEFT JOIN perf_results_types t ON s.type_id = t.id WHERE s.id = ?',
        [sectionId]
      );

      const [createdSubTopics] = await connection.execute(
        'SELECT * FROM perf_results_sub_topics WHERE section_id = ?',
        [sectionId]
      );

      const sectionWithSubTopics = {
        ...createdSection[0],
        subTopics: createdSubTopics
      };

      return NextResponse.json({
        success: true,
        data: sectionWithSubTopics,
        message: 'Section created successfully'
      }, { status: 201 });

    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Error creating section:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create section', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}