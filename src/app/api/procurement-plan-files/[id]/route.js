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

// GET /api/procurement-plan-files/[id] - ดึงข้อมูล procurement plan file เดียว
export async function GET(request, { params }) {
  let connection;
  
  try {
    const { id } = params;

    connection = await mysql.createConnection(dbConfig);

    // Get procurement plan file with type info
    const [files] = await connection.execute(
      `SELECT f.*, ppt.type_name 
       FROM procurement_plan_files f 
       LEFT JOIN procurement_plan_types ppt ON f.type_id = ppt.id 
       WHERE f.id = ?`,
      [parseInt(id)]
    );

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Procurement plan file not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: files[0]
    });

  } catch (error) {
    console.error('Error fetching procurement plan file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch procurement plan file', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// PUT /api/procurement-plan-files/[id] - อัปเดต procurement plan file
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

    // Update procurement plan file
    const [result] = await connection.execute(
      'UPDATE procurement_plan_files SET files_path = ?, files_type = ?, updated_at = NOW() WHERE id = ?',
      [files_path, files_type, parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Procurement plan file not found' },
        { status: 404 }
      );
    }

    // Get updated file
    const [updatedFile] = await connection.execute(
      `SELECT f.*, ppt.type_name 
       FROM procurement_plan_files f 
       LEFT JOIN procurement_plan_types ppt ON f.type_id = ppt.id 
       WHERE f.id = ?`,
      [parseInt(id)]
    );

    return NextResponse.json({
      success: true,
      data: updatedFile[0],
      message: 'Procurement plan file updated successfully'
    });

  } catch (error) {
    console.error('Error updating procurement plan file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update procurement plan file', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// DELETE /api/procurement-plan-files/[id] - ลบ procurement plan file
export async function DELETE(request, { params }) {
  let connection;
  
  try {
    const { id } = params;

    connection = await mysql.createConnection(dbConfig);

    // Delete procurement plan file
    const [result] = await connection.execute(
      'DELETE FROM procurement_plan_files WHERE id = ?',
      [parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Procurement plan file not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Procurement plan file deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting procurement plan file:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete procurement plan file', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}