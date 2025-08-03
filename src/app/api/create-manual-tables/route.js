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

export async function POST(request) {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    
    // Create manual_categories table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS manual_categories (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        category_name VARCHAR(255) NOT NULL COMMENT 'ชื่อหมวดหมู่คู่มือ',
        category_description TEXT COMMENT 'คำอธิบายหมวดหมู่',
        icon VARCHAR(100) COMMENT 'ไอคอน',
        color VARCHAR(7) COMMENT 'สีของหมวดหมู่',
        display_order INT DEFAULT 0 COMMENT 'ลำดับการแสดง',
        is_active BOOLEAN DEFAULT TRUE COMMENT 'สถานะการใช้งาน',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_category_name (category_name),
        INDEX idx_display_order (display_order),
        INDEX idx_is_active (is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางหมวดหมู่คู่มือ'
    `);

    // Create manual_items table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS manual_items (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        category_id BIGINT UNSIGNED NOT NULL COMMENT 'รหัสหมวดหมู่',
        title VARCHAR(500) NOT NULL COMMENT 'ชื่อคู่มือ',
        description TEXT COMMENT 'คำอธิบายคู่มือ',
        content LONGTEXT COMMENT 'เนื้อหาคู่มือ',
        tags VARCHAR(500) COMMENT 'แท็กสำหรับค้นหา',
        display_order INT DEFAULT 0 COMMENT 'ลำดับการแสดง',
        is_active BOOLEAN DEFAULT TRUE COMMENT 'สถานะการใช้งาน',
        is_featured BOOLEAN DEFAULT FALSE COMMENT 'คู่มือแนะนำ',
        view_count INT DEFAULT 0 COMMENT 'จำนวนการเข้าชม',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (category_id) REFERENCES manual_categories(id) ON DELETE CASCADE,
        INDEX idx_category_id (category_id),
        INDEX idx_title (title),
        INDEX idx_display_order (display_order),
        INDEX idx_is_active (is_active),
        INDEX idx_is_featured (is_featured),
        INDEX idx_view_count (view_count),
        FULLTEXT idx_title_content (title, content, tags)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางรายการคู่มือ'
    `);

    // Create manual_files table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS manual_files (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        manual_id BIGINT UNSIGNED NOT NULL COMMENT 'รหัสคู่มือ',
        files_path VARCHAR(255) NOT NULL COMMENT 'เส้นทางไฟล์',
        files_type VARCHAR(255) NOT NULL COMMENT 'ประเภทไฟล์',
        original_name VARCHAR(255) COMMENT 'ชื่อไฟล์เดิม',
        file_size BIGINT COMMENT 'ขนาดไฟล์ (bytes)',
        description TEXT COMMENT 'คำอธิบายไฟล์',
        display_order INT DEFAULT 0 COMMENT 'ลำดับการแสดง',
        is_active BOOLEAN DEFAULT TRUE COMMENT 'สถานะการใช้งาน',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (manual_id) REFERENCES manual_items(id) ON DELETE CASCADE,
        INDEX idx_manual_id (manual_id),
        INDEX idx_files_type (files_type),
        INDEX idx_display_order (display_order),
        INDEX idx_is_active (is_active),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางไฟล์คู่มือ'
    `);

    // Insert sample categories
    await connection.execute(`
      INSERT IGNORE INTO manual_categories (id, category_name, category_description, icon, color, display_order) VALUES
      (1, 'คู่มือสำหรับเข้าหน้าที่', 'คู่มือและแนวทางสำหรับเจ้าหน้าที่เทศบาล', 'UserOutlined', '#1890ff', 1),
      (2, 'คู่มือสำหรับประชาชน', 'คู่มือการใช้บริการสำหรับประชาชน', 'TeamOutlined', '#52c41a', 2),
      (3, 'คู่มือการใช้งานระบบ', 'คู่มือการใช้งานระบบต่างๆ ของเทศบาล', 'SettingOutlined', '#722ed1', 3),
      (4, 'กฎหมายและระเบียบ', 'กฎหมาย ระเบียบ และข้อบังคับที่เกี่ยวข้อง', 'BookOutlined', '#fa8c16', 4),
      (5, 'แบบฟอร์มและเอกสาร', 'แบบฟอร์มและเอกสารต่างๆ ที่ใช้ในการปฏิบัติงาน', 'FileTextOutlined', '#13c2c2', 5)
    `);

    // Insert sample manual items
    await connection.execute(`
      INSERT IGNORE INTO manual_items (id, category_id, title, description, content, tags, display_order, is_featured) VALUES
      (1, 1, 'คู่มือการปฏิบัติงานสำหรับเจ้าหน้าที่ใหม่', 'แนวทางและขั้นตอนการปฏิบัติงานสำหรับเจ้าหน้าที่ที่เข้าใหม่', 
       'คู่มือนี้จัดทำขึ้นเพื่อเป็นแนวทางในการปฏิบัติงานสำหรับเจ้าหน้าที่ใหม่ ประกอบด้วย\\n\\n1. การรายงานตัว\\n2. การทำความรู้จักกับหน่วยงาน\\n3. ระเบียบการปฏิบัติงาน\\n4. การใช้งานระบบต่างๆ', 
       'เจ้าหน้าที่ใหม่, การปฏิบัติงาน, แนวทาง', 1, TRUE),
      (2, 2, 'คู่มือการขอใบรับรองต่างๆ', 'ขั้นตอนการขอใบรับรองจากเทศบาล', 
       'การขอใบรับรองจากเทศบาลตำบลบ้านโพธิ์\\n\\n**ประเภทใบรับรอง:**\\n- ใบรับรองการไม่มีหนี้สิน\\n- ใบรับรองรายได้\\n- ใบรับรองการค้า\\n\\n**เอกสารที่ต้องเตรียม:**\\n1. บัตรประชาชน\\n2. ทะเบียนบ้าน\\n3. หนังสือมอบอำนาจ (กรณีมาแทน)', 
       'ใบรับรอง, เอกสาร, ประชาชน', 1, TRUE),
      (3, 3, 'คู่มือการใช้งานระบบบริหารจัดการ', 'วิธีการใช้งานระบบบริหารจัดการของเทศบาล', 
       'ระบบบริหารจัดการเทศบาลตำบลบ้านโพธิ์\\n\\n**การเข้าสู่ระบบ:**\\n1. เปิดเว็บไซต์\\n2. กรอก Username และ Password\\n3. คลิกเข้าสู่ระบบ\\n\\n**เมนูหลัก:**\\n- จัดการข้อมูลพื้นฐาน\\n- รายงาน\\n- การตั้งค่า', 
       'ระบบ, การใช้งาน, บริหารจัดการ', 1, FALSE)
    `);

    return NextResponse.json({
      success: true,
      message: 'Manual system tables created successfully with sample data',
      tables: ['manual_categories', 'manual_items', 'manual_files'],
      sampleData: {
        categories: 5,
        manuals: 3,
        files: 0
      }
    });

  } catch (error) {
    console.error('Create manual tables error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create manual tables',
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