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

// GET /api/perf-results-files/[id] - ดึงข้อมูลไฟล์เดียว
export async function GET(request, { params }) {
  let connection;
  
  try {
    const { id } = params;

    connection = await mysql.createConnection(dbConfig);

    // Get file with full hierarchy info
    const [files] = await connection.execute(
      `SELECT f.*, st.topic_name, s.section_name, t.type_name 
       FROM perf_results_files f 
       LEFT JOIN perf_results_sub_topics st ON f.sub_topic_id = st.id 
       LEFT JOIN perf_results_sections s ON st.section_id = s.id 
       LEFT JOIN perf_results_types t ON s.type_id = t.id 
       WHERE f.id = ?`,
      [parseInt(id)]
    );

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'File not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: files[0]
    });

  } catch (error) {
    console.error('Error fetching file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch file', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// PUT /api/perf-results-files/[id] - อัปเดตไฟล์
export async function PUT(request, { params }) {
  let connection;
  
  try {
    const { id } = params;
    const body = await request.json();
    const { files_path, files_type } = body;

    // Validation
    if (!files_path || !files_type) {
      return NextResponse.json(
        { success: false, error: 'File path and file type are required' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Update file
    const [result] = await connection.execute(
      'UPDATE perf_results_files SET files_path = ?, files_type = ?, updated_at = NOW() WHERE id = ?',
      [files_path, files_type, parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'File not found' },
        { status: 404 }
      );
    }

    // Get updated file
    const [updatedFile] = await connection.execute(
      `SELECT f.*, st.topic_name, s.section_name, t.type_name 
       FROM perf_results_files f 
       LEFT JOIN perf_results_sub_topics st ON f.sub_topic_id = st.id 
       LEFT JOIN perf_results_sections s ON st.section_id = s.id 
       LEFT JOIN perf_results_types t ON s.type_id = t.id 
       WHERE f.id = ?`,
      [parseInt(id)]
    );

    return NextResponse.json({
      success: true,
      data: updatedFile[0],
      message: 'File updated successfully'
    });

  } catch (error) {
    console.error('Error updating file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update file', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// DELETE /api/perf-results-files/[id] - ลบไฟล์
export async function DELETE(request, { params }) {
  let connection;
  
  try {
    const { id } = params;

    connection = await mysql.createConnection(dbConfig);

    // Delete file
    const [result] = await connection.execute(
      'DELETE FROM perf_results_files WHERE id = ?',
      [parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'File not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete file', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}