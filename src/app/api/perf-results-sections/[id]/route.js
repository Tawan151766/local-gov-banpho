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

// GET /api/perf-results-sections/[id] - ดึงข้อมูล section เดียว
export async function GET(request, { params }) {
  let connection;
  
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const withSubTopics = searchParams.get('withSubTopics') === 'true';

    connection = await mysql.createConnection(dbConfig);

    // Get section with type info
    const [sections] = await connection.execute(
      `SELECT s.*, t.type_name FROM perf_results_sections s 
       LEFT JOIN perf_results_types t ON s.type_id = t.id 
       WHERE s.id = ?`,
      [parseInt(id)]
    );

    if (sections.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Section not found' },
        { status: 404 }
      );
    }

    let section = sections[0];

    // If withSubTopics is true, get sub topics
    if (withSubTopics) {
      const [subTopics] = await connection.execute(
        'SELECT * FROM perf_results_sub_topics WHERE section_id = ? ORDER BY created_at ASC',
        [parseInt(id)]
      );
      section.subTopics = subTopics;
    }

    return NextResponse.json({
      success: true,
      data: section
    });

  } catch (error) {
    console.error('Error fetching section:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch section', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// PUT /api/perf-results-sections/[id] - อัปเดต section
export async function PUT(request, { params }) {
  let connection;
  
  try {
    const { id } = params;
    const body = await request.json();
    const { section_name, date } = body;

    // Validation
    if (!section_name) {
      return NextResponse.json(
        { success: false, error: 'Section name is required' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Update section
    const [result] = await connection.execute(
      'UPDATE perf_results_sections SET section_name = ?, date = ?, updated_at = NOW() WHERE id = ?',
      [section_name, date || null, parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Section not found' },
        { status: 404 }
      );
    }

    // Get updated section
    const [updatedSection] = await connection.execute(
      `SELECT s.*, t.type_name FROM perf_results_sections s 
       LEFT JOIN perf_results_types t ON s.type_id = t.id 
       WHERE s.id = ?`,
      [parseInt(id)]
    );

    return NextResponse.json({
      success: true,
      data: updatedSection[0],
      message: 'Section updated successfully'
    });

  } catch (error) {
    console.error('Error updating section:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update section', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// DELETE /api/perf-results-sections/[id] - ลบ section
export async function DELETE(request, { params }) {
  let connection;
  
  try {
    const { id } = params;

    connection = await mysql.createConnection(dbConfig);

    // Start transaction
    await connection.beginTransaction();

    try {
      // Delete files first (cascade from sub topics)
      await connection.execute(
        `DELETE f FROM perf_results_files f 
         INNER JOIN perf_results_sub_topics st ON f.sub_topic_id = st.id 
         WHERE st.section_id = ?`,
        [parseInt(id)]
      );

      // Delete sub topics
      await connection.execute(
        'DELETE FROM perf_results_sub_topics WHERE section_id = ?',
        [parseInt(id)]
      );

      // Delete section
      const [result] = await connection.execute(
        'DELETE FROM perf_results_sections WHERE id = ?',
        [parseInt(id)]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        return NextResponse.json(
          { success: false, error: 'Section not found' },
          { status: 404 }
        );
      }

      // Commit transaction
      await connection.commit();

      return NextResponse.json({
        success: true,
        message: 'Section deleted successfully'
      });

    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Error deleting section:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete section', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}