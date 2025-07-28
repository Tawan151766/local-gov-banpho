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

// GET /api/post-details/[id] - ดึงข้อมูล post detail เดียว
export async function GET(request, { params }) {
  let connection;
  
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const withMedia = searchParams.get('withMedia') === 'true';

    connection = await mysql.createConnection(dbConfig);

    // Get post detail with post type info
    const [postDetails] = await connection.execute(
      `SELECT pd.*, pt.type_name 
       FROM post_details pd 
       LEFT JOIN post_types pt ON pd.post_type_id = pt.id 
       WHERE pd.id = ?`,
      [parseInt(id)]
    );

    if (postDetails.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Post detail not found' },
        { status: 404 }
      );
    }

    let postDetail = postDetails[0];

    // If withMedia is true, get media files
    if (withMedia) {
      const [photos] = await connection.execute(
        'SELECT * FROM post_photos WHERE post_detail_id = ? ORDER BY created_at ASC',
        [parseInt(id)]
      );

      const [videos] = await connection.execute(
        'SELECT * FROM post_videos WHERE post_detail_id = ? ORDER BY created_at ASC',
        [parseInt(id)]
      );

      const [pdfs] = await connection.execute(
        'SELECT * FROM post_pdfs WHERE post_detail_id = ? ORDER BY created_at ASC',
        [parseInt(id)]
      );

      postDetail.photos = photos;
      postDetail.videos = videos;
      postDetail.pdfs = pdfs;
    }

    return NextResponse.json({
      success: true,
      data: postDetail
    });

  } catch (error) {
    console.error('Error fetching post detail:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post detail', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// PUT /api/post-details/[id] - อัปเดต post detail
export async function PUT(request, { params }) {
  let connection;
  
  try {
    const { id } = params;
    const body = await request.json();
    const { date, title_name, topic_name, details } = body;

    // Validation
    if (!title_name) {
      return NextResponse.json(
        { success: false, error: 'Title name is required' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Update post detail
    const [result] = await connection.execute(
      'UPDATE post_details SET date = ?, title_name = ?, topic_name = ?, details = ?, updated_at = NOW() WHERE id = ?',
      [date || null, title_name, topic_name || null, details || null, parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Post detail not found' },
        { status: 404 }
      );
    }

    // Get updated post detail
    const [updatedDetail] = await connection.execute(
      `SELECT pd.*, pt.type_name 
       FROM post_details pd 
       LEFT JOIN post_types pt ON pd.post_type_id = pt.id 
       WHERE pd.id = ?`,
      [parseInt(id)]
    );

    return NextResponse.json({
      success: true,
      data: updatedDetail[0],
      message: 'Post detail updated successfully'
    });

  } catch (error) {
    console.error('Error updating post detail:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update post detail', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// DELETE /api/post-details/[id] - ลบ post detail
export async function DELETE(request, { params }) {
  let connection;
  
  try {
    const { id } = params;

    connection = await mysql.createConnection(dbConfig);

    // Start transaction
    await connection.beginTransaction();

    try {
      // Delete media files first (CASCADE will handle this, but we do it explicitly for clarity)
      await connection.execute(
        'DELETE FROM post_photos WHERE post_detail_id = ?',
        [parseInt(id)]
      );

      await connection.execute(
        'DELETE FROM post_videos WHERE post_detail_id = ?',
        [parseInt(id)]
      );

      await connection.execute(
        'DELETE FROM post_pdfs WHERE post_detail_id = ?',
        [parseInt(id)]
      );

      // Delete post detail
      const [result] = await connection.execute(
        'DELETE FROM post_details WHERE id = ?',
        [parseInt(id)]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        return NextResponse.json(
          { success: false, error: 'Post detail not found' },
          { status: 404 }
        );
      }

      // Commit transaction
      await connection.commit();

      return NextResponse.json({
        success: true,
        message: 'Post detail deleted successfully'
      });

    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Error deleting post detail:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete post detail', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}