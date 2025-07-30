import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "103.80.48.25",
  port: 3306,
  user: "gmsky_banphokorat",
  password: "banphokorat56789",
  database: "gmsky_banphokorat",
};

export async function GET(request) {
  let connection;
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    // Build WHERE clause
    let whereClause = '';
    const params = [];
    if (search) {
      whereClause = 'WHERE t.type_name LIKE ?';
      params.push(`%${search}%`);
    }

    // Get types with counts of sections, sub_topics, and files
    const [rows] = await connection.execute(
      `SELECT 
        t.id, t.type_name, t.created_at, t.updated_at,
        COUNT(DISTINCT s.id) as sections_count,
        COUNT(DISTINCT st.id) as sub_topics_count,
        COUNT(DISTINCT f.id) as files_count
      FROM perf_results_types t
      LEFT JOIN perf_results_sections s ON s.type_id = t.id
      LEFT JOIN perf_results_sub_topics st ON st.section_id = s.id
      LEFT JOIN perf_results_files f ON f.sub_topic_id = st.id
      ${whereClause}
      GROUP BY t.id, t.type_name, t.created_at, t.updated_at
      ORDER BY t.id ASC
      LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Get total count for pagination
    const [countResult] = await connection.execute(
      `SELECT COUNT(DISTINCT t.id) as total FROM perf_results_types t ${whereClause}`,
      params
    );
    const total = countResult[0]?.total || 0;

    // Add recent sections to each type for preview
    const typesWithSections = await Promise.all(
      rows.map(async (type) => {
        const [recentSections] = await connection.execute(
          `SELECT id, section_name, date 
           FROM perf_results_sections 
           WHERE type_id = ? 
           ORDER BY id DESC 
           LIMIT 3`,
          [type.id]
        );

        return {
          ...type,
          sections: recentSections
        };
      })
    );

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
    console.error('Error fetching perf results:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch perf results', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
