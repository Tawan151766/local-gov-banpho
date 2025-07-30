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

// GET /api/ita-contents/[id] - ดึงข้อมูล content เดียว
export async function GET(request, { params }) {
  let connection;
  
  try {
    const { id } = params;

    connection = await mysql.createConnection(dbConfig);

    // Get content with evaluation info
    const [contents] = await connection.execute(
      `SELECT c.*, e.name as evaluation_name, e.ita_date 
       FROM ita_contents c 
       LEFT JOIN ita_evaluations e ON c.evaluation_id = e.id 
       WHERE c.id = ? AND c.deleted_at IS NULL`,
      [parseInt(id)]
    );

    if (contents.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: contents[0]
    });

  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch content', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// PUT /api/ita-contents/[id] - อัปเดต content
export async function PUT(request, { params }) {
  let connection;
  
  try {
    const { id } = params;
    const body = await request.json();
    const { url, description } = body;

    // Validation
    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Update content
    const [result] = await connection.execute(
      'UPDATE ita_contents SET url = ?, description = ?, updated_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [url, description || null, parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      );
    }

    // Get updated content
    const [updatedContent] = await connection.execute(
      `SELECT c.*, e.name as evaluation_name, e.ita_date 
       FROM ita_contents c 
       LEFT JOIN ita_evaluations e ON c.evaluation_id = e.id 
       WHERE c.id = ? AND c.deleted_at IS NULL`,
      [parseInt(id)]
    );

    return NextResponse.json({
      success: true,
      data: updatedContent[0],
      message: 'Content updated successfully'
    });

  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update content', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// DELETE /api/ita-contents/[id] - ลบ content (soft delete)
export async function DELETE(request, { params }) {
  let connection;
  
  try {
    const { id } = params;

    connection = await mysql.createConnection(dbConfig);

    // Soft delete content
    const [result] = await connection.execute(
      'UPDATE ita_contents SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete content', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}