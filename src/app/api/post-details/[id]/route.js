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
    const { date, title_name, topic_name, details, photos = [], videos = [], pdfs = [] } = body;

    // Debug logging
    console.log('PUT request body:', body);
    console.log('Photos:', photos);
    console.log('Videos:', videos);
    console.log('PDFs:', pdfs);

    // Validation
    if (!title_name) {
      return NextResponse.json(
        { success: false, error: 'Title name is required' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Start transaction
    await connection.beginTransaction();

    try {
      // Update post detail
      const [result] = await connection.execute(
        'UPDATE post_details SET date = ?, title_name = ?, topic_name = ?, details = ?, updated_at = NOW() WHERE id = ?',
        [date || null, title_name, topic_name || null, details || null, parseInt(id)]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        return NextResponse.json(
          { success: false, error: 'Post detail not found' },
          { status: 404 }
        );
      }

      // Delete existing media files
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

      // Insert new photos if provided
      if (photos && photos.length > 0) {
        console.log('Inserting photos:', photos);
        for (const photo of photos) {
          if (photo.post_photo_file) {
            console.log('Inserting photo:', photo.post_photo_file);
            const [photoResult] = await connection.execute(
              'INSERT INTO post_photos (post_detail_id, post_photo_file, post_photo_status, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
              [parseInt(id), photo.post_photo_file, photo.post_photo_status || 'active']
            );
            console.log('Photo insert result:', photoResult);
          }
        }
      }

      // Insert new videos if provided
      if (videos && videos.length > 0) {
        console.log('Inserting videos:', videos);
        for (const video of videos) {
          if (video.post_video_file) {
            console.log('Inserting video:', video.post_video_file);
            const [videoResult] = await connection.execute(
              'INSERT INTO post_videos (post_detail_id, post_video_file, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
              [parseInt(id), video.post_video_file]
            );
            console.log('Video insert result:', videoResult);
          }
        }
      }

      // Insert new PDFs if provided
      if (pdfs && pdfs.length > 0) {
        console.log('Inserting PDFs:', pdfs);
        for (const pdf of pdfs) {
          if (pdf.post_pdf_file) {
            console.log('Inserting PDF:', pdf.post_pdf_file);
            const [pdfResult] = await connection.execute(
              'INSERT INTO post_pdfs (post_detail_id, post_pdf_file, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
              [parseInt(id), pdf.post_pdf_file]
            );
            console.log('PDF insert result:', pdfResult);
          }
        }
      }

      // Commit transaction
      await connection.commit();

      // Get updated post detail with media
      const [updatedDetail] = await connection.execute(
        `SELECT pd.*, pt.type_name 
         FROM post_details pd 
         LEFT JOIN post_types pt ON pd.post_type_id = pt.id 
         WHERE pd.id = ?`,
        [parseInt(id)]
      );

      const [updatedPhotos] = await connection.execute(
        'SELECT * FROM post_photos WHERE post_detail_id = ?',
        [parseInt(id)]
      );

      const [updatedVideos] = await connection.execute(
        'SELECT * FROM post_videos WHERE post_detail_id = ?',
        [parseInt(id)]
      );

      const [updatedPdfs] = await connection.execute(
        'SELECT * FROM post_pdfs WHERE post_detail_id = ?',
        [parseInt(id)]
      );

      const postDetailWithMedia = {
        ...updatedDetail[0],
        photos: updatedPhotos,
        videos: updatedVideos,
        pdfs: updatedPdfs
      };

      return NextResponse.json({
        success: true,
        data: postDetailWithMedia,
        message: 'Post detail updated successfully'
      });

    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }

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