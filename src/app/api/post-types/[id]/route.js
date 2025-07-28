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

// GET /api/post-types/[id] - ดึงข้อมูล post type เดียว
export async function GET(request, { params }) {
  let connection;
  
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const withDetails = searchParams.get('withDetails') === 'true';

    connection = await mysql.createConnection(dbConfig);

    // Get post type
    const [postTypes] = await connection.execute(
      'SELECT * FROM post_types WHERE id = ?',
      [parseInt(id)]
    );

    if (postTypes.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Post type not found' },
        { status: 404 }
      );
    }

    let postType = postTypes[0];

    // If withDetails is true, get post details
    if (withDetails) {
      const [postDetails] = await connection.execute(
        'SELECT * FROM post_details WHERE post_type_id = ? ORDER BY created_at DESC',
        [parseInt(id)]
      );
      postType.postDetails = postDetails;
    }

    return NextResponse.json({
      success: true,
      data: postType
    });

  } catch (error) {
    console.error('Error fetching post type:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post type', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// PUT /api/post-types/[id] - อัปเดต post type
export async function PUT(request, { params }) {
  let connection;
  
  try {
    const { id } = params;
    const body = await request.json();
    const { type_name } = body;

    // Validation
    if (!type_name) {
      return NextResponse.json(
        { success: false, error: 'Type name is required' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Check if type name already exists (excluding current record)
    const [existingType] = await connection.execute(
      'SELECT id FROM post_types WHERE type_name = ? AND id != ?',
      [type_name, parseInt(id)]
    );

    if (existingType.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Type name already exists' },
        { status: 409 }
      );
    }

    // Update post type
    const [result] = await connection.execute(
      'UPDATE post_types SET type_name = ?, updated_at = NOW() WHERE id = ?',
      [type_name, parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Post type not found' },
        { status: 404 }
      );
    }

    // Get updated post type
    const [updatedType] = await connection.execute(
      'SELECT * FROM post_types WHERE id = ?',
      [parseInt(id)]
    );

    return NextResponse.json({
      success: true,
      data: updatedType[0],
      message: 'Post type updated successfully'
    });

  } catch (error) {
    console.error('Error updating post type:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update post type', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// DELETE /api/post-types/[id] - ลบ post type
export async function DELETE(request, { params }) {
  let connection;
  
  try {
    const { id } = params;

    connection = await mysql.createConnection(dbConfig);

    // Start transaction
    await connection.beginTransaction();

    try {
      // Check if there are any post details using this type
      const [postDetailsCheck] = await connection.execute(
        'SELECT COUNT(*) as count FROM post_details WHERE post_type_id = ?',
        [parseInt(id)]
      );

      if (postDetailsCheck[0].count > 0) {
        await connection.rollback();
        return NextResponse.json(
          { success: false, error: 'Cannot delete post type that has associated post details' },
          { status: 409 }
        );
      }

      // Delete post type
      const [result] = await connection.execute(
        'DELETE FROM post_types WHERE id = ?',
        [parseInt(id)]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        return NextResponse.json(
          { success: false, error: 'Post type not found' },
          { status: 404 }
        );
      }

      // Commit transaction
      await connection.commit();

      return NextResponse.json({
        success: true,
        message: 'Post type deleted successfully'
      });

    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Error deleting post type:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete post type', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}