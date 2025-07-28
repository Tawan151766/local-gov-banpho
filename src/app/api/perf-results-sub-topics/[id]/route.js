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

// GET /api/perf-results-sub-topics/[id] - ดึงข้อมูล sub topic เดียว
export async function GET(request, { params }) {
  let connection;
  
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const withFiles = searchParams.get('withFiles') === 'true';

    connection = await mysql.createConnection(dbConfig);

    // Get sub topic with section and type info
    const [subTopics] = await connection.execute(
      `SELECT st.*, s.section_name, t.type_name 
       FROM perf_results_sub_topics st 
       LEFT JOIN perf_results_sections s ON st.section_id = s.id 
       LEFT JOIN perf_results_types t ON s.type_id = t.id 
       WHERE st.id = ?`,
      [parseInt(id)]
    );

    if (subTopics.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Sub topic not found' },
        { status: 404 }
      );
    }

    let subTopic = subTopics[0];

    // If withFiles is true, get files
    if (withFiles) {
      const [files] = await connection.execute(
        'SELECT * FROM perf_results_files WHERE sub_topic_id = ? ORDER BY created_at ASC',
        [parseInt(id)]
      );
      subTopic.files = files;
    }

    return NextResponse.json({
      success: true,
      data: subTopic
    });

  } catch (error) {
    console.error('Error fetching sub topic:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sub topic', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// PUT /api/perf-results-sub-topics/[id] - อัปเดต sub topic
export async function PUT(request, { params }) {
  let connection;
  
  try {
    const { id } = params;
    const body = await request.json();
    const { topic_name, date } = body;

    // Validation
    if (!topic_name) {
      return NextResponse.json(
        { success: false, error: 'Topic name is required' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Update sub topic
    const [result] = await connection.execute(
      'UPDATE perf_results_sub_topics SET topic_name = ?, date = ?, updated_at = NOW() WHERE id = ?',
      [topic_name, date || null, parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Sub topic not found' },
        { status: 404 }
      );
    }

    // Get updated sub topic
    const [updatedSubTopic] = await connection.execute(
      `SELECT st.*, s.section_name, t.type_name 
       FROM perf_results_sub_topics st 
       LEFT JOIN perf_results_sections s ON st.section_id = s.id 
       LEFT JOIN perf_results_types t ON s.type_id = t.id 
       WHERE st.id = ?`,
      [parseInt(id)]
    );

    return NextResponse.json({
      success: true,
      data: updatedSubTopic[0],
      message: 'Sub topic updated successfully'
    });

  } catch (error) {
    console.error('Error updating sub topic:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update sub topic', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// DELETE /api/perf-results-sub-topics/[id] - ลบ sub topic
export async function DELETE(request, { params }) {
  let connection;
  
  try {
    const { id } = params;

    connection = await mysql.createConnection(dbConfig);

    // Start transaction
    await connection.beginTransaction();

    try {
      // Delete files first
      await connection.execute(
        'DELETE FROM perf_results_files WHERE sub_topic_id = ?',
        [parseInt(id)]
      );

      // Delete sub topic
      const [result] = await connection.execute(
        'DELETE FROM perf_results_sub_topics WHERE id = ?',
        [parseInt(id)]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        return NextResponse.json(
          { success: false, error: 'Sub topic not found' },
          { status: 404 }
        );
      }

      // Commit transaction
      await connection.commit();

      return NextResponse.json({
        success: true,
        message: 'Sub topic deleted successfully'
      });

    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Error deleting sub topic:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete sub topic', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}