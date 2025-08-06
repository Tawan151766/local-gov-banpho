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

// GET - ตรวจสอบสถานะตาราง
export async function GET() {
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    // ตรวจสอบว่าตารางมีอยู่หรือไม่
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME IN ('qa_categories', 'qa_items')
    `, [dbConfig.database]);

    const tablesExist = {
      qa_categories: tables.some(table => table.TABLE_NAME === 'qa_categories'),
      qa_items: tables.some(table => table.TABLE_NAME === 'qa_items')
    };

    return NextResponse.json({
      success: true,
      tablesExist,
      allTablesExist: Object.values(tablesExist).every(exists => exists)
    });

  } catch (error) {
    console.error('Error checking Q&A tables:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check Q&A tables',
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

// POST - สร้างตาราง
export async function POST() {
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    // สร้างตาราง qa_categories (หมวดหมู่คำถาม)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS qa_categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_name VARCHAR(255) NOT NULL,
        category_description TEXT,
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_display_order (display_order),
        INDEX idx_is_active (is_active)
      )
    `);

    // สร้างตาราง qa_items (คำถาม-คำตอบ)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS qa_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_id INT,
        question TEXT NOT NULL,
        answer LONGTEXT NOT NULL,
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        view_count INT DEFAULT 0,
        is_featured BOOLEAN DEFAULT FALSE,
        tags VARCHAR(500),
        submitter_ip VARCHAR(45),
        submitter_user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES qa_categories(id) ON DELETE SET NULL,
        INDEX idx_category_id (category_id),
        INDEX idx_display_order (display_order),
        INDEX idx_is_active (is_active),
        INDEX idx_is_featured (is_featured),
        INDEX idx_submitter_ip (submitter_ip),
        FULLTEXT idx_question_answer (question, answer)
      )
    `);

    // เพิ่มคอลัมน์ IP ถ้าตารางมีอยู่แล้วแต่ไม่มีคอลัมน์นี้
    try {
      await connection.execute(`
        ALTER TABLE qa_items 
        ADD COLUMN IF NOT EXISTS submitter_ip VARCHAR(45),
        ADD COLUMN IF NOT EXISTS submitter_user_agent TEXT,
        ADD INDEX IF NOT EXISTS idx_submitter_ip (submitter_ip)
      `);
    } catch (alterError) {
      console.log('Columns may already exist:', alterError.message);
    }

    // Create qa_comments table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS qa_comments (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        qa_item_id INT NOT NULL,
        comment_text TEXT NOT NULL,
        commenter_name VARCHAR(255),
        commenter_email VARCHAR(255),
        rating TINYINT UNSIGNED,
        commenter_ip VARCHAR(45),
        is_approved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (qa_item_id) REFERENCES qa_items(id) ON DELETE CASCADE,
        INDEX idx_qa_item_id (qa_item_id),
        INDEX idx_is_approved (is_approved),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // เพิ่มข้อมูลตัวอย่าง
    await connection.execute(`
      INSERT IGNORE INTO qa_categories (id, category_name, category_description, display_order) VALUES
      (1, 'บริการทั่วไป', 'คำถามเกี่ยวกับบริการทั่วไปของเทศบาล', 1),
      (2, 'เอกสารราชการ', 'คำถามเกี่ยวกับการขอเอกสารต่างๆ', 2),
      (3, 'ภาษีและค่าธรรมเนียม', 'คำถามเกี่ยวกับการชำระภาษีและค่าธรรมเนียม', 3),
      (4, 'สาธารณูปโภค', 'คำถามเกี่ยวกับน้ำประปา ไฟฟ้า ถนน', 4),
      (5, 'สวัสดิการสังคม', 'คำถามเกี่ยวกับสวัสดิการและการช่วยเหลือ', 5),
      (6, 'การศึกษา', 'คำถามเกี่ยวกับโรงเรียนและการศึกษา', 6),
      (7, 'สาธารณสุข', 'คำถามเกี่ยวกับสุขภาพและการแพทย์', 7),
      (8, 'สิ่งแวดล้อม', 'คำถามเกี่ยวกับขยะ มลพิษ และสิ่งแวดล้อม', 8)
    `);

    await connection.execute(`
      INSERT IGNORE INTO qa_items (id, category_id, question, answer, display_order, is_featured) VALUES
      (1, 1, 'เทศบาลตำบลบ้านโพธิ์เปิดให้บริการวันไหนบ้าง?', 'เทศบาลตำบลบ้านโพธิ์เปิดให้บริการวันจันทร์-วันศุกร์ เวลา 08:30-16:30 น. (หยุดพักเที่ยง 12:00-13:00 น.) ยกเว้นวันหยุดราชการ', 1, TRUE),
      (2, 2, 'ขอใบรับรองการไม่มีหนี้สินต่อเทศบาลต้องเตรียมเอกสารอะไรบ้าง?', 'ต้องเตรียมเอกสาร: 1) บัตรประชาชน 2) ทะเบียนบ้าน 3) หนังสือมอบอำนาจ (กรณีมาแทน) 4) ค่าธรรมเนียม 20 บาท', 1, TRUE),
      (3, 3, 'ชำระภาษีโรงเรือนและที่ดินได้ที่ไหนบ้าง?', 'สามารถชำระได้ที่: 1) สำนักงานเทศบาลตำบลบ้านโพธิ์ 2) ธนาคารกรุงไทย สาขาต่างๆ 3) เคาน์เตอร์เซอร์วิส 4) ระบบออนไลน์ผ่านแอปธนาคาร', 1, FALSE),
      (4, 4, 'แจ้งปัญหาน้ำประปาไม่ไหลได้อย่างไร?', 'สามารถแจ้งได้ 3 ช่องทาง: 1) โทรศัพท์ 038-123456 2) แจ้งผ่านเว็บไซต์ในหมวด "แจ้งปัญหา" 3) มาแจ้งที่สำนักงานเทศบาลโดยตรง', 1, FALSE),
      (5, 5, 'ผู้สูงอายุมีสิทธิ์รับเบี้ยยังชีพอย่างไร?', 'ผู้สูงอายุ 60 ปีขึ้นไป ที่มีคุณสมบัติตามระเบียบ สามารถยื่นขอรับเบี้ยยังชีพได้ที่สำนักงานเทศบาล โดยเตรียมเอกสาร: บัตรประชาชน, ทะเบียนบ้าน, บัญชีธนาคาร', 1, FALSE),
      (6, 6, 'โรงเรียนในเขตเทศบาลมีกี่แห่ง?', 'ในเขตเทศบาลตำบลบ้านโพธิ์มีโรงเรียน 3 แห่ง คือ 1) โรงเรียนบ้านโพธิ์วิทยา 2) โรงเรียนวัดบ้านโพธิ์ 3) โรงเรียนอนุบาลบ้านโพธิ์', 1, FALSE),
      (7, 7, 'มีโรงพยาบาลหรือสถานีอนามัยในพื้นที่หรือไม่?', 'มีสถานีอนามัยบ้านโพธิ์ให้บริการตรวจรักษาเบื้องต้น และโรงพยาบาลส่งเสริมสุขภาพตำบลบ้านโพธิ์ เปิดให้บริการวันจันทร์-วันศุกร์ เวลา 08:30-16:30 น.', 1, FALSE),
      (8, 8, 'วันไหนเก็บขยะในแต่ละหมู่บ้าน?', 'การเก็บขยะแบ่งตามเขต: หมู่ 1-3 วันจันทร์และพฤหัสบดี, หมู่ 4-6 วันอังคารและศุกร์, หมู่ 7-9 วันพุธและเสาร์ เวลา 06:00-10:00 น.', 1, FALSE)
    `);

    return NextResponse.json({
      success: true,
      message: 'Q&A tables created successfully with sample data'
    });

  } catch (error) {
    console.error('Error creating Q&A tables:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create Q&A tables',
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