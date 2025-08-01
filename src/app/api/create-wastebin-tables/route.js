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

export async function POST() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    
    // Create wastebin_requests table
    const createWastebinRequestsTable = `
      CREATE TABLE IF NOT EXISTS wastebin_requests (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        request_date DATE NOT NULL,
        
        -- ข้อมูลผู้ยื่นคำร้อง (Requester Information)
        requester_title VARCHAR(20) NOT NULL,
        requester_name VARCHAR(255) NOT NULL,
        requester_age INT NOT NULL,
        requester_house_number VARCHAR(50) NOT NULL,
        requester_street VARCHAR(100),
        requester_village VARCHAR(100) NOT NULL,
        requester_subdistrict VARCHAR(100) NOT NULL DEFAULT 'ตำบลบ้านโพธิ์',
        requester_district VARCHAR(100) NOT NULL DEFAULT 'อำเภอบ้านโพธิ์',
        requester_province VARCHAR(100) NOT NULL DEFAULT 'จังหวัดฉะเชิงเทรา',
        
        -- รายละเอียดคำร้อง (Request Details)
        bin_quantity INT NOT NULL,
        delivery_house_number VARCHAR(50) NOT NULL,
        delivery_village VARCHAR(100) NOT NULL,
        
        -- เอกสารประกอบ (Documents)
        house_registration_doc VARCHAR(255),
        id_card_doc VARCHAR(255),
        document_1 VARCHAR(255),
        document_2 VARCHAR(255),
        document_3 VARCHAR(255),
        
        -- สถานะการดำเนินการ (Status Management)
        status ENUM('pending', 'processing', 'completed', 'rejected') DEFAULT 'pending',
        status_note TEXT,
        
        -- ข้อมูลระบบ (System Information)
        captcha_answer VARCHAR(10),
        ip_address VARCHAR(45),
        user_agent TEXT,
        
        -- Timestamps
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        -- Indexes
        INDEX idx_wastebin_request_date (request_date),
        INDEX idx_wastebin_requester_name (requester_name),
        INDEX idx_wastebin_status (status),
        INDEX idx_wastebin_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.execute(createWastebinRequestsTable);

    return NextResponse.json({
      success: true,
      message: 'Wastebin request tables created successfully',
      tables: ['wastebin_requests']
    });

  } catch (error) {
    console.error('Error creating wastebin request tables:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create wastebin request tables', 
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