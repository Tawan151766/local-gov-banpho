import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: '103.80.48.25',
  port: 3306,
  user: 'gmsky_banphokorat',
  password: 'banphokorat56789',
  database: 'gmsky_banphokorat'
};

export async function GET(request) {
  let connection;
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const typeId = searchParams.get('type_id') || '';
    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    // Build WHERE clause for filtering by type
    let whereClause = '';
    const params = [];
    if (typeId) {
      whereClause = 'WHERE s.type_id = ?';
      params.push(typeId);
    }

    // Get sections with type info and counts
    const [rows] = await connection.execute(
      `SELECT 
        s.id, s.section_name, s.date, s.created_at, s.updated_at,
        t.type_name,
        COUNT(DISTINCT st.id) as sub_topics_count,
        COUNT(DISTINCT f.id) as files_count
      FROM perf_results_sections s
      LEFT JOIN perf_results_types t ON t.id = s.type_id
      LEFT JOIN perf_results_sub_topics st ON st.section_id = s.id
      LEFT JOIN perf_results_files f ON f.sub_topic_id = st.id
      ${whereClause}
      GROUP BY s.id, s.section_name, s.date, s.created_at, s.updated_at, t.type_name
      ORDER BY s.id DESC
      LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Get total count for pagination
    const [countResult] = await connection.execute(
      `SELECT COUNT(DISTINCT s.id) as total 
       FROM perf_results_sections s 
       ${whereClause}`,
      params
    );
    const total = countResult[0]?.total || 0;

    // Get recent sub topics for each section (for preview)
    const sectionsWithPreview = await Promise.all(
      rows.map(async (section) => {
        const [recentSubTopics] = await connection.execute(
          `SELECT topic_name 
           FROM perf_results_sub_topics 
           WHERE section_id = ? 
           ORDER BY id DESC 
           LIMIT 3`,
          [section.id]
        );

        return {
          ...section,
          recent_sub_topics: recentSubTopics
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: sectionsWithPreview,
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
