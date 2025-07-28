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

// POST /api/create-post-tables - สร้างตาราง Post Management
export async function POST(request) {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);

    // Start transaction
    await connection.beginTransaction();

    try {
      // Create post_types table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS post_types (
          id INT AUTO_INCREMENT PRIMARY KEY,
          type_name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_type_name (type_name)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // Create post_details table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS post_details (
          id INT AUTO_INCREMENT PRIMARY KEY,
          post_type_id INT NOT NULL,
          date DATE,
          title_name VARCHAR(500) NOT NULL,
          topic_name VARCHAR(500),
          details TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (post_type_id) REFERENCES post_types(id) ON DELETE CASCADE,
          INDEX idx_post_type_id (post_type_id),
          INDEX idx_date (date),
          INDEX idx_title_name (title_name)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // Create post_photos table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS post_photos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          post_detail_id INT NOT NULL,
          post_photo_file VARCHAR(500) NOT NULL,
          post_photo_status ENUM('active', 'inactive') DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (post_detail_id) REFERENCES post_details(id) ON DELETE CASCADE,
          INDEX idx_post_detail_id (post_detail_id),
          INDEX idx_status (post_photo_status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // Create post_videos table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS post_videos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          post_detail_id INT NOT NULL,
          post_video_file VARCHAR(500) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (post_detail_id) REFERENCES post_details(id) ON DELETE CASCADE,
          INDEX idx_post_detail_id (post_detail_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // Create post_pdfs table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS post_pdfs (
          id INT AUTO_INCREMENT PRIMARY KEY,
          post_detail_id INT NOT NULL,
          post_pdf_file VARCHAR(500) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (post_detail_id) REFERENCES post_details(id) ON DELETE CASCADE,
          INDEX idx_post_detail_id (post_detail_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // Insert sample data for post_types
      await connection.execute(`
        INSERT IGNORE INTO post_types (id, type_name) VALUES
        (1, 'ข่าวประชาสัมพันธ์'),
        (2, 'ประกาศ'),
        (3, 'กิจกรรม'),
        (4, 'โครงการ'),
        (5, 'การประชุม'),
        (6, 'การจัดซื้อจัดจ้าง'),
        (7, 'รายงานผลการดำเนินงาน')
      `);

      // Insert sample data for post_details
      await connection.execute(`
        INSERT IGNORE INTO post_details (id, post_type_id, date, title_name, topic_name, details) VALUES
        (1, 1, '2024-01-15', 'ข่าวประชาสัมพันธ์การให้บริการประชาชน', 'การให้บริการประชาชน', 'องค์การบริหารส่วนตำบลบ้านโพธิ์ ขอประชาสัมพันธ์การให้บริการประชาชนในด้านต่างๆ'),
        (2, 2, '2024-01-20', 'ประกาศรับสมัครพนักงานจ้าง', 'การรับสมัครงาน', 'ประกาศรับสมัครพนักงานจ้างตำแหน่งผู้ช่วยเจ้าหน้าที่ธุรการ'),
        (3, 3, '2024-02-01', 'กิจกรรมวันเด็กแห่งชาติ', 'วันเด็กแห่งชาติ 2567', 'จัดกิจกรรมวันเด็กแห่งชาติ ประจำปี 2567 ณ ศาลาประชาคม'),
        (4, 4, '2024-02-10', 'โครงการพัฒนาถนนในหมู่บ้าน', 'การพัฒนาโครงสร้างพื้นฐาน', 'โครงการปรับปรุงถนนลูกรังเป็นถนนลาดยางในเขตตำบลบ้านโพธิ์'),
        (5, 5, '2024-02-15', 'การประชุมสภาองค์การบริหารส่วนตำบล', 'การประชุมสภา ครั้งที่ 1/2567', 'การประชุมสภาองค์การบริหารส่วนตำบลบ้านโพธิ์ สมัยสามัญ ครั้งที่ 1 ประจำปี 2567')
      `);

      // Insert sample data for post_photos
      await connection.execute(`
        INSERT IGNORE INTO post_photos (id, post_detail_id, post_photo_file, post_photo_status) VALUES
        (1, 1, '/assets/images/posts/news_service_01.jpg', 'active'),
        (2, 1, '/assets/images/posts/news_service_02.jpg', 'active'),
        (3, 3, '/assets/images/posts/children_day_01.jpg', 'active'),
        (4, 3, '/assets/images/posts/children_day_02.jpg', 'active'),
        (5, 3, '/assets/images/posts/children_day_03.jpg', 'active'),
        (6, 4, '/assets/images/posts/road_project_01.jpg', 'active'),
        (7, 5, '/assets/images/posts/meeting_01.jpg', 'active')
      `);

      // Insert sample data for post_videos
      await connection.execute(`
        INSERT IGNORE INTO post_videos (id, post_detail_id, post_video_file) VALUES
        (1, 3, '/assets/videos/posts/children_day_2567.mp4'),
        (2, 4, '/assets/videos/posts/road_construction.mp4'),
        (3, 5, '/assets/videos/posts/council_meeting_1_2567.mp4')
      `);

      // Insert sample data for post_pdfs
      await connection.execute(`
        INSERT IGNORE INTO post_pdfs (id, post_detail_id, post_pdf_file) VALUES
        (1, 2, '/assets/documents/posts/job_announcement.pdf'),
        (2, 4, '/assets/documents/posts/road_project_proposal.pdf'),
        (3, 5, '/assets/documents/posts/meeting_minutes_1_2567.pdf'),
        (4, 1, '/assets/documents/posts/service_manual.pdf')
      `);

      // Commit transaction
      await connection.commit();

      return NextResponse.json({
        success: true,
        message: 'Post Management tables created successfully',
        tables: ['post_types', 'post_details', 'post_photos', 'post_videos', 'post_pdfs']
      }, { status: 201 });

    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Error creating Post Management tables:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create Post Management tables', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// GET /api/create-post-tables - ตรวจสอบสถานะตาราง
export async function GET(request) {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);

    // Check if tables exist
    const tableNames = ['post_types', 'post_details', 'post_photos', 'post_videos', 'post_pdfs'];
    const tablesExist = {};
    const recordCounts = {};

    for (const tableName of tableNames) {
      const [tableCheck] = await connection.execute(`
        SELECT COUNT(*) as count FROM information_schema.tables 
        WHERE table_schema = 'gmsky_banphokorat' AND table_name = ?
      `, [tableName]);

      tablesExist[tableName] = tableCheck[0].count > 0;

      // Get record counts if table exists
      if (tablesExist[tableName]) {
        const [recordCount] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
        recordCounts[tableName] = recordCount[0].count;
      }
    }

    // Get post details with related data counts
    let postDetailsWithCounts = [];
    if (tablesExist.post_details) {
      const [postDetails] = await connection.execute(`
        SELECT 
          pd.*,
          pt.type_name,
          (SELECT COUNT(*) FROM post_photos WHERE post_detail_id = pd.id) as photos_count,
          (SELECT COUNT(*) FROM post_videos WHERE post_detail_id = pd.id) as videos_count,
          (SELECT COUNT(*) FROM post_pdfs WHERE post_detail_id = pd.id) as pdfs_count
        FROM post_details pd
        LEFT JOIN post_types pt ON pd.post_type_id = pt.id
        ORDER BY pd.created_at DESC
        LIMIT 5
      `);
      postDetailsWithCounts = postDetails;
    }

    return NextResponse.json({
      success: true,
      tablesExist,
      recordCounts,
      sampleData: postDetailsWithCounts
    });

  } catch (error) {
    console.error('Error checking Post Management tables:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check Post Management tables', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}