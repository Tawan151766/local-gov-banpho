import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Database connection
// GET - ดึงโพสต์ตาม id
export async function GET(request, { params }) {
  let connection;
  try {
    const postId = params.id;
    if (!postId) {
      return NextResponse.json({ success: false, error: "Missing post id" }, { status: 400 });
    }
    connection = await mysql.createConnection(dbConfig);
    // ดึงข้อมูลโพสต์
    const [posts] = await connection.execute(
      `SELECT pd.*, pt.type_name FROM post_details pd LEFT JOIN post_types pt ON pd.post_type_id = pt.id WHERE pd.id = ?`,
      [postId]
    );
    if (posts.length === 0) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }
    const post = posts[0];
    // ดึงไฟล์แนบ
    const [photos] = await connection.execute(`SELECT * FROM post_photos WHERE post_detail_id = ?`, [postId]);
    const [videos] = await connection.execute(`SELECT * FROM post_videos WHERE post_detail_id = ?`, [postId]);
    const [pdfs] = await connection.execute(`SELECT * FROM post_pdfs WHERE post_detail_id = ?`, [postId]);
    post.photos = photos;
    post.videos = videos;
    post.pdfs = pdfs;
    post.photos_count = photos.length;
    post.videos_count = videos.length;
    post.pdfs_count = pdfs.length;
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error("Get post by id error:", error);
    return NextResponse.json({ success: false, error: "Failed to get post", details: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// PUT - แก้ไขโพสต์
export async function PUT(request, { params }) {
  let connection;
  
  try {
    const { id } = params;
    const body = await request.json();
    const { 
      title_name,
      topic_name,
      details,
      post_type,
      date,
      file_path
    } = body;
    
    if (!title_name?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }
    
    if (!post_type?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Post type is required' },
        { status: 400 }
      );
    }
    
    connection = await mysql.createConnection(dbConfig);
    await connection.beginTransaction();
    
    try {
      // Get or create post_type
      let [postTypes] = await connection.execute(
        'SELECT id FROM post_types WHERE type_name = ?',
        [post_type.trim()]
      );
      
      let postTypeId;
      if (postTypes.length === 0) {
        // Create new post type
        const [typeResult] = await connection.execute(
          'INSERT INTO post_types (type_name) VALUES (?)',
          [post_type.trim()]
        );
        postTypeId = typeResult.insertId;
      } else {
        postTypeId = postTypes[0].id;
      }
      
      // Update post detail
      const [result] = await connection.execute(`
        UPDATE post_details 
        SET 
          post_type_id = ?,
          date = ?,
          title_name = ?,
          topic_name = ?,
          details = ?,
          updated_at = NOW()
        WHERE id = ?
      `, [
        postTypeId,
        date || new Date().toISOString().split('T')[0],
        title_name.trim(),
        topic_name || null,
        details || null,
        id
      ]);
      
      if (result.affectedRows === 0) {
        await connection.rollback();
        return NextResponse.json(
          { success: false, error: 'Post not found' },
          { status: 404 }
        );
      }
      
      // Handle PDF file
      if (file_path) {
        // Remove existing PDFs
        await connection.execute('DELETE FROM post_pdfs WHERE post_detail_id = ?', [id]);
        // Add new PDF
        await connection.execute(
          'INSERT INTO post_pdfs (post_detail_id, post_pdf_file) VALUES (?, ?)',
          [id, file_path]
        );
      } else {
        // Remove all PDFs if no file_path provided
        await connection.execute('DELETE FROM post_pdfs WHERE post_detail_id = ?', [id]);
      }
      
      await connection.commit();
      
      // Get updated post with type info
      const [updatedPost] = await connection.execute(`
        SELECT 
          pd.*,
          pt.type_name,
          (SELECT COUNT(*) FROM post_photos WHERE post_detail_id = pd.id) as photos_count,
          (SELECT COUNT(*) FROM post_videos WHERE post_detail_id = pd.id) as videos_count,
          (SELECT COUNT(*) FROM post_pdfs WHERE post_detail_id = pd.id) as pdfs_count
        FROM post_details pd
        LEFT JOIN post_types pt ON pd.post_type_id = pt.id
        WHERE pd.id = ?
      `, [id]);
      
      return NextResponse.json({
        success: true,
        data: updatedPost[0],
        message: 'Post updated successfully'
      });
      
    } catch (error) {
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Update post error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update post',
        details: error.message 
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// DELETE - ลบโพสต์
export async function DELETE(request, { params }) {
  let connection;
  
  try {
    const { id } = params;
    
    connection = await mysql.createConnection(dbConfig);
    
    // Delete from post_details (CASCADE will handle related tables)
    const [result] = await connection.execute(
      'DELETE FROM post_details WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete post',
        details: error.message 
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}