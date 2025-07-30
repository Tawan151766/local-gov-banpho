import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: '103.80.48.25',
  port: 3306,
  user: 'gmsky_banphokorat',
  password: 'banphokorat56789',
  database: 'gmsky_banphokorat'
};

export async function GET(request, { params }) {
  let connection;
  try {
    const { id } = params;

    console.log('Fetching section detail for ID:', id);

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Section ID is required' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // First, check if the section exists and get basic info
    const [sectionCheck] = await connection.execute(
      `SELECT s.id, s.section_name, s.date, s.created_at, s.updated_at, t.type_name
       FROM perf_results_sections s
       LEFT JOIN perf_results_types t ON t.id = s.type_id
       WHERE s.id = ?`,
      [parseInt(id)]
    );

    console.log('Section check result:', sectionCheck);

    if (sectionCheck.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Section not found', sectionId: id },
        { status: 404 }
      );
    }

    // Get section with all related sub topics and files
    const [rows] = await connection.execute(
      `SELECT 
        s.id as section_id, s.section_name, s.date as section_date, s.created_at as section_created_at, s.updated_at as section_updated_at,
        t.type_name,
        st.id as sub_topic_id, st.topic_name, st.date as sub_topic_date, st.created_at as sub_topic_created_at, st.updated_at as sub_topic_updated_at,
        f.id as file_id, f.files_path, f.files_type, f.created_at as file_created_at, f.updated_at as file_updated_at
      FROM perf_results_sections s
      LEFT JOIN perf_results_types t ON t.id = s.type_id
      LEFT JOIN perf_results_sub_topics st ON st.section_id = s.id
      LEFT JOIN perf_results_files f ON f.sub_topic_id = st.id
      WHERE s.id = ?
      ORDER BY st.id ASC, f.id ASC`,
      [parseInt(id)]
    );

    console.log('Query result rows:', rows.length);

    // Build the hierarchical structure for section
    const sectionData = {
      id: sectionCheck[0].id,
      section_name: sectionCheck[0].section_name,
      date: sectionCheck[0].date,
      created_at: sectionCheck[0].created_at,
      updated_at: sectionCheck[0].updated_at,
      type_name: sectionCheck[0].type_name,
      sub_topics: []
    };

    if (rows.length > 0) {
      // Group data by sub_topic -> files
      const subTopicsMap = new Map();

      for (const row of rows) {
        // Sub Topic
        let subTopicObj = null;
        if (row.sub_topic_id) {
          if (!subTopicsMap.has(row.sub_topic_id)) {
            subTopicObj = {
              id: row.sub_topic_id,
              topic_name: row.topic_name,
              date: row.sub_topic_date,
              created_at: row.sub_topic_created_at,
              updated_at: row.sub_topic_updated_at,
              files: []
            };
            subTopicsMap.set(row.sub_topic_id, subTopicObj);
            sectionData.sub_topics.push(subTopicObj);
          } else {
            subTopicObj = subTopicsMap.get(row.sub_topic_id);
          }

          // File
          if (row.file_id) {
            if (!subTopicObj.files.find(f => f.id === row.file_id)) {
              subTopicObj.files.push({
                id: row.file_id,
                files_path: row.files_path,
                files_type: row.files_type,
                created_at: row.file_created_at,
                updated_at: row.file_updated_at
              });
            }
          }
        }
      }

      // Sort sub_topics and files by ID for consistent ordering
      sectionData.sub_topics.sort((a, b) => a.id - b.id);
      sectionData.sub_topics.forEach(subTopic => {
        subTopic.files.sort((a, b) => a.id - b.id);
      });
    }

    console.log('Final sectionData:', JSON.stringify(sectionData, null, 2));

    return NextResponse.json({
      success: true,
      data: sectionData
    });

  } catch (error) {
    console.error('Error fetching section detail:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch section detail',
        details: error.message,
        sectionId: params?.id
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}