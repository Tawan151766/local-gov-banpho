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

// GET /api/post-details - ดึงรายการ post details
export async function GET(request) {
  let connection;
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const postTypeId = searchParams.get('postTypeId');
    const withMedia = searchParams.get('withMedia') === 'true';

    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    // Build WHERE clause
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (pd.title_name LIKE ? OR pd.topic_name LIKE ? OR pd.details LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (postTypeId) {
      whereClause += ' AND pd.post_type_id = ?';
      params.push(parseInt(postTypeId));
    }

    // Get post details with post type info
    const [postDetails] = await connection.execute(
      `SELECT pd.*, pt.type_name 
       FROM post_details pd 
       LEFT JOIN post_types pt ON pd.post_type_id = pt.id 
       ${whereClause} ORDER BY pd.date DESC, pd.created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Get total count
    const [countResult] = await connection.execute(
      `SELECT COUNT(*) as total FROM post_details pd 
       LEFT JOIN post_types pt ON pd.post_type_id = pt.id 
       ${whereClause}`,
      params
    );

    const total = countResult[0]?.total || 0;

    // If withMedia is true, get media files for each post detail
    let postDetailsWithMedia = postDetails;
    if (withMedia && postDetails.length > 0) {
      const postDetailIds = postDetails.map(detail => detail.id);
      const placeholders = postDetailIds.map(() => '?').join(',');
      
      // Get photos
      const [photos] = await connection.execute(
        `SELECT * FROM post_photos WHERE post_detail_id IN (${placeholders}) ORDER BY created_at ASC`,
        postDetailIds
      );

      // Get videos
      const [videos] = await connection.execute(
        `SELECT * FROM post_videos WHERE post_detail_id IN (${placeholders}) ORDER BY created_at ASC`,
        postDetailIds
      );

      // Get PDFs
      const [pdfs] = await connection.execute(
        `SELECT * FROM post_pdfs WHERE post_detail_id IN (${placeholders}) ORDER BY created_at ASC`,
        postDetailIds
      );

      // Group media by post_detail_id
      const photosByDetail = photos.reduce((acc, photo) => {
        if (!acc[photo.post_detail_id]) acc[photo.post_detail_id] = [];
        acc[photo.post_detail_id].push(photo);
        return acc;
      }, {});

      const videosByDetail = videos.reduce((acc, video) => {
        if (!acc[video.post_detail_id]) acc[video.post_detail_id] = [];
        acc[video.post_detail_id].push(video);
        return acc;
      }, {});

      const pdfsByDetail = pdfs.reduce((acc, pdf) => {
        if (!acc[pdf.post_detail_id]) acc[pdf.post_detail_id] = [];
        acc[pdf.post_detail_id].push(pdf);
        return acc;
      }, {});

      // Add media to each post detail
      postDetailsWithMedia = postDetails.map(detail => ({
        ...detail,
        photos: photosByDetail[detail.id] || [],
        videos: videosByDetail[detail.id] || [],
        pdfs: pdfsByDetail[detail.id] || []
      }));
    }

    return NextResponse.json({
      success: true,
      data: postDetailsWithMedia,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching post details:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch post details', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// POST /api/post-details - สร้าง post detail ใหม่
export async function POST(request) {
  let connection;
  
  try {
    const body = await request.json();
    const { post_type_id, date, title_name, topic_name, details, photos = [], videos = [], pdfs = [] } = body;

    // Validation
    if (!post_type_id || !title_name) {
      return NextResponse.json(
        { success: false, error: 'Post type ID and title name are required' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Start transaction
    await connection.beginTransaction();

    try {
      // Check if post type exists
      const [postTypeCheck] = await connection.execute(
        'SELECT id FROM post_types WHERE id = ?',
        [post_type_id]
      );

      if (postTypeCheck.length === 0) {
        await connection.rollback();
        return NextResponse.json(
          { success: false, error: 'Post type not found' },
          { status: 404 }
        );
      }

      // Insert post detail
      const [result] = await connection.execute(
        'INSERT INTO post_details (post_type_id, date, title_name, topic_name, details, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
        [post_type_id, date || null, title_name, topic_name || null, details || null]
      );

      const postDetailId = result.insertId;

      // Insert photos if provided
      if (photos && photos.length > 0) {
        for (const photo of photos) {
          if (photo.post_photo_file) {
            await connection.execute(
              'INSERT INTO post_photos (post_detail_id, post_photo_file, post_photo_status, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
              [postDetailId, photo.post_photo_file, photo.post_photo_status || 'active']
            );
          }
        }
      }

      // Insert videos if provided
      if (videos && videos.length > 0) {
        for (const video of videos) {
          if (video.post_video_file) {
            await connection.execute(
              'INSERT INTO post_videos (post_detail_id, post_video_file, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
              [postDetailId, video.post_video_file]
            );
          }
        }
      }

      // Insert PDFs if provided
      if (pdfs && pdfs.length > 0) {
        for (const pdf of pdfs) {
          if (pdf.post_pdf_file) {
            await connection.execute(
              'INSERT INTO post_pdfs (post_detail_id, post_pdf_file, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
              [postDetailId, pdf.post_pdf_file]
            );
          }
        }
      }

      // Commit transaction
      await connection.commit();

      // Get the created post detail with media
      const [createdDetail] = await connection.execute(
        `SELECT pd.*, pt.type_name 
         FROM post_details pd 
         LEFT JOIN post_types pt ON pd.post_type_id = pt.id 
         WHERE pd.id = ?`,
        [postDetailId]
      );

      const [createdPhotos] = await connection.execute(
        'SELECT * FROM post_photos WHERE post_detail_id = ?',
        [postDetailId]
      );

      const [createdVideos] = await connection.execute(
        'SELECT * FROM post_videos WHERE post_detail_id = ?',
        [postDetailId]
      );

      const [createdPdfs] = await connection.execute(
        'SELECT * FROM post_pdfs WHERE post_detail_id = ?',
        [postDetailId]
      );

      const postDetailWithMedia = {
        ...createdDetail[0],
        photos: createdPhotos,
        videos: createdVideos,
        pdfs: createdPdfs
      };

      return NextResponse.json({
        success: true,
        data: postDetailWithMedia,
        message: 'Post detail created successfully'
      }, { status: 201 });

    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Error creating post detail:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create post detail', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}