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

// GET /api/perf-results-files - ดึงรายการไฟล์
export async function GET(request) {
  let connection;
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const subTopicId = searchParams.get('subTopicId');
    const filesType = searchParams.get('filesType');

    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    // Build WHERE clause
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND f.files_path LIKE ?';
      params.push(`%${search}%`);
    }

    if (subTopicId) {
      whereClause += ' AND f.sub_topic_id = ?';
      params.push(parseInt(subTopicId));
    }

    if (filesType) {
      whereClause += ' AND f.files_type = ?';
      params.push(filesType);
    }

    // Get files with full hierarchy info
    const [files] = await connection.execute(
      `SELECT f.*, st.topic_name, s.section_name, t.type_name 
       FROM perf_results_files f 
       LEFT JOIN perf_results_sub_topics st ON f.sub_topic_id = st.id 
       LEFT JOIN perf_results_sections s ON st.section_id = s.id 
       LEFT JOIN perf_results_types t ON s.type_id = t.id 
       ${whereClause} ORDER BY f.created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Get total count
    const [countResult] = await connection.execute(
      `SELECT COUNT(*) as total FROM perf_results_files f 
       LEFT JOIN perf_results_sub_topics st ON f.sub_topic_id = st.id 
       LEFT JOIN perf_results_sections s ON st.section_id = s.id 
       ${whereClause}`,
      params
    );

    const total = countResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: files,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch files', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// POST /api/perf-results-files - สร้างไฟล์ใหม่
export async function POST(request) {
  let connection;
  
  try {
    const body = await request.json();
    const { 
      sub_topic_id, 
      files_path, 
      files_type, 
      original_name, 
      file_size, 
      description 
    } = body;

    // Validation
    if (!sub_topic_id || !files_path || !files_type) {
      return NextResponse.json(
        { success: false, error: 'Sub topic ID, file path, and file type are required' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Check if new columns exist in the table
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'perf_results_files'
    `, [process.env.DB_NAME || 'gmsky_banphokorat']);

    const existingColumns = columns.map(col => col.COLUMN_NAME);
    const hasNewColumns = existingColumns.includes('original_name') && 
                         existingColumns.includes('file_size') && 
                         existingColumns.includes('description');

    let result;
    if (hasNewColumns) {
      // Use new schema with all columns
      [result] = await connection.execute(
        `INSERT INTO perf_results_files 
         (sub_topic_id, files_path, files_type, original_name, file_size, description, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [sub_topic_id, files_path, files_type, original_name || null, file_size || null, description || null]
      );
    } else {
      // Use old schema without new columns
      [result] = await connection.execute(
        `INSERT INTO perf_results_files 
         (sub_topic_id, files_path, files_type, created_at, updated_at) 
         VALUES (?, ?, ?, NOW(), NOW())`,
        [sub_topic_id, files_path, files_type]
      );
    }

    // Get the created file with hierarchy info
    const selectClause = hasNewColumns ? 
      'SELECT f.*, st.topic_name, s.section_name, t.type_name' :
      'SELECT f.id, f.sub_topic_id, f.files_path, f.files_type, f.created_at, f.updated_at, st.topic_name, s.section_name, t.type_name';
    
    const [createdFile] = await connection.execute(
      `${selectClause}
       FROM perf_results_files f 
       LEFT JOIN perf_results_sub_topics st ON f.sub_topic_id = st.id 
       LEFT JOIN perf_results_sections s ON st.section_id = s.id 
       LEFT JOIN perf_results_types t ON s.type_id = t.id 
       WHERE f.id = ?`,
      [result.insertId]
    );

    return NextResponse.json({
      success: true,
      data: createdFile[0],
      message: 'File created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create file', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// PUT /api/perf-results-files - อัปเดตไฟล์
export async function PUT(request) {
  let connection;
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    const { 
      files_path, 
      files_type, 
      original_name, 
      file_size, 
      description 
    } = body;

    // Validation
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'File ID is required' },
        { status: 400 }
      );
    }

    if (!files_path || !files_type) {
      return NextResponse.json(
        { success: false, error: 'File path and file type are required' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Check if file exists
    const [existingFile] = await connection.execute(
      'SELECT id FROM perf_results_files WHERE id = ?',
      [id]
    );

    if (existingFile.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Performance results file not found' },
        { status: 404 }
      );
    }

    // Check if new columns exist in the table
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'perf_results_files'
    `, [process.env.DB_NAME || 'gmsky_banphokorat']);

    const existingColumns = columns.map(col => col.COLUMN_NAME);
    const hasNewColumns = existingColumns.includes('original_name') && 
                         existingColumns.includes('file_size') && 
                         existingColumns.includes('description');

    if (hasNewColumns) {
      // Use new schema with all columns
      await connection.execute(
        `UPDATE perf_results_files 
         SET files_path = ?, files_type = ?, original_name = ?, file_size = ?, description = ?, updated_at = NOW()
         WHERE id = ?`,
        [files_path, files_type, original_name || null, file_size || null, description || null, id]
      );
    } else {
      // Use old schema without new columns
      await connection.execute(
        `UPDATE perf_results_files 
         SET files_path = ?, files_type = ?, updated_at = NOW()
         WHERE id = ?`,
        [files_path, files_type, id]
      );
    }

    // Get the updated file with hierarchy info
    const selectClause = hasNewColumns ? 
      'SELECT f.*, st.topic_name, s.section_name, t.type_name' :
      'SELECT f.id, f.sub_topic_id, f.files_path, f.files_type, f.created_at, f.updated_at, st.topic_name, s.section_name, t.type_name';
    
    const [updatedFile] = await connection.execute(
      `${selectClause}
       FROM perf_results_files f 
       LEFT JOIN perf_results_sub_topics st ON f.sub_topic_id = st.id 
       LEFT JOIN perf_results_sections s ON st.section_id = s.id 
       LEFT JOIN perf_results_types t ON s.type_id = t.id 
       WHERE f.id = ?`,
      [id]
    );

    return NextResponse.json({
      success: true,
      data: updatedFile[0],
      message: 'Performance results file updated successfully'
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

// DELETE /api/perf-results-files - ลบไฟล์
export async function DELETE(request) {
  let connection;
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validation
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'File ID is required' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Check if new columns exist in the table
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'perf_results_files'
    `, [process.env.DB_NAME || 'gmsky_banphokorat']);

    const existingColumns = columns.map(col => col.COLUMN_NAME);
    const hasNewColumns = existingColumns.includes('original_name') && 
                         existingColumns.includes('file_size') && 
                         existingColumns.includes('description');

    // Get file information before deletion
    const selectClause = hasNewColumns ? 
      'SELECT f.*, st.topic_name, s.section_name, t.type_name' :
      'SELECT f.id, f.sub_topic_id, f.files_path, f.files_type, f.created_at, f.updated_at, st.topic_name, s.section_name, t.type_name';
    
    const [existingFile] = await connection.execute(
      `${selectClause}
       FROM perf_results_files f 
       LEFT JOIN perf_results_sub_topics st ON f.sub_topic_id = st.id 
       LEFT JOIN perf_results_sections s ON st.section_id = s.id 
       LEFT JOIN perf_results_types t ON s.type_id = t.id 
       WHERE f.id = ?`,
      [id]
    );

    if (existingFile.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Performance results file not found' },
        { status: 404 }
      );
    }

    // Delete the file
    await connection.execute(
      'DELETE FROM perf_results_files WHERE id = ?',
      [id]
    );

    return NextResponse.json({
      success: true,
      message: `ลบไฟล์ "${existingFile[0].original_name || existingFile[0].files_path}" สำเร็จ`,
      deletedRecord: existingFile[0]
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