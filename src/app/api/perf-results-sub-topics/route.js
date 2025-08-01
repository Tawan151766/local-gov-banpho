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

// GET /api/perf-results-sub-topics - ดึงรายการ sub topics
export async function GET(request) {
  let connection;
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const sectionId = searchParams.get('sectionId');
    const withFiles = searchParams.get('withFiles') === 'true';

    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    // Build WHERE clause
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND st.topic_name LIKE ?';
      params.push(`%${search}%`);
    }

    if (sectionId) {
      whereClause += ' AND st.section_id = ?';
      params.push(parseInt(sectionId));
    }

    // Get sub topics with section and type info
    const [subTopics] = await connection.execute(
      `SELECT st.*, s.section_name, t.type_name 
       FROM perf_results_sub_topics st 
       LEFT JOIN perf_results_sections s ON st.section_id = s.id 
       LEFT JOIN perf_results_types t ON s.type_id = t.id 
       ${whereClause} ORDER BY st.created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Get total count
    const [countResult] = await connection.execute(
      `SELECT COUNT(*) as total FROM perf_results_sub_topics st 
       LEFT JOIN perf_results_sections s ON st.section_id = s.id 
       ${whereClause}`,
      params
    );

    const total = countResult[0]?.total || 0;

    // If withFiles is true, get files for each sub topic
    let subTopicsWithFiles = subTopics;
    if (withFiles && subTopics.length > 0) {
      const subTopicIds = subTopics.map(subTopic => subTopic.id);
      const placeholders = subTopicIds.map(() => '?').join(',');
      
      const [files] = await connection.execute(
        `SELECT * FROM perf_results_files WHERE sub_topic_id IN (${placeholders}) ORDER BY created_at ASC`,
        subTopicIds
      );

      // Group files by sub_topic_id
      const filesBySubTopic = files.reduce((acc, file) => {
        if (!acc[file.sub_topic_id]) {
          acc[file.sub_topic_id] = [];
        }
        acc[file.sub_topic_id].push(file);
        return acc;
      }, {});

      // Add files to each sub topic
      subTopicsWithFiles = subTopics.map(subTopic => ({
        ...subTopic,
        files: filesBySubTopic[subTopic.id] || []
      }));
    }

    return NextResponse.json({
      success: true,
      data: subTopicsWithFiles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching sub topics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sub topics', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// POST /api/perf-results-sub-topics - สร้าง sub topic ใหม่
export async function POST(request) {
  let connection;
  
  try {
    const body = await request.json();
    const { section_id, topic_name, date, files = [] } = body;

    // Validation
    if (!section_id || !topic_name) {
      return NextResponse.json(
        { success: false, error: 'Section ID and topic name are required' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Start transaction
    await connection.beginTransaction();

    try {
      // Insert sub topic
      const [result] = await connection.execute(
        'INSERT INTO perf_results_sub_topics (section_id, topic_name, date, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
        [section_id, topic_name, date || null]
      );

      const subTopicId = result.insertId;

      // Insert files if provided
      if (files && files.length > 0) {
        for (const file of files) {
          if (file.files_path && file.files_type) {
            await connection.execute(
              'INSERT INTO perf_results_files (sub_topic_id, files_path, files_type, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
              [subTopicId, file.files_path, file.files_type]
            );
          }
        }
      }

      // Commit transaction
      await connection.commit();

      // Get the created sub topic with files
      const [createdSubTopic] = await connection.execute(
        `SELECT st.*, s.section_name, t.type_name 
         FROM perf_results_sub_topics st 
         LEFT JOIN perf_results_sections s ON st.section_id = s.id 
         LEFT JOIN perf_results_types t ON s.type_id = t.id 
         WHERE st.id = ?`,
        [subTopicId]
      );

      const [createdFiles] = await connection.execute(
        'SELECT * FROM perf_results_files WHERE sub_topic_id = ?',
        [subTopicId]
      );

      const subTopicWithFiles = {
        ...createdSubTopic[0],
        files: createdFiles
      };

      return NextResponse.json({
        success: true,
        data: subTopicWithFiles,
        message: 'Sub topic created successfully'
      }, { status: 201 });

    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Error creating sub topic:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create sub topic', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}