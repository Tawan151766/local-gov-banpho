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
    
    // Create general_requests table
    const createGeneralRequestsTable = `
      CREATE TABLE IF NOT EXISTS general_requests (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        request_date DATE NOT NULL,
        
        -- ข้อมูลผู้ยื่นคำร้อง (Requester Information)
        requester_title ENUM('นาย', 'นาง', 'นางสาว') NOT NULL,
        requester_name VARCHAR(255) NOT NULL,
        requester_age INT NOT NULL,
        requester_nationality VARCHAR(100) NOT NULL DEFAULT 'ไทย',
        requester_house_number VARCHAR(50) NOT NULL,
        requester_village VARCHAR(100),
        requester_subdistrict VARCHAR(100) NOT NULL,
        requester_district VARCHAR(100) NOT NULL,
        requester_province VARCHAR(100) NOT NULL,
        requester_postal_code VARCHAR(10) NOT NULL,
        requester_phone VARCHAR(20),
        
        -- รายละเอียดคำร้อง (Request Details)
        request_subject VARCHAR(500) NOT NULL,
        request_details TEXT NOT NULL,
        
        -- ไฟล์แนบ (Attachments)
        document_1 VARCHAR(255),
        document_2 VARCHAR(255),
        document_3 VARCHAR(255),
        other_document_1 VARCHAR(255),
        other_document_2 VARCHAR(255),
        
        -- ข้อมูลระบบ (System Information)
        captcha_answer VARCHAR(10),
        ip_address VARCHAR(45),
        user_agent TEXT,
        status ENUM('pending', 'processing', 'completed', 'rejected') DEFAULT 'pending',
        status_note TEXT,
        
        -- Timestamps
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        -- Indexes
        INDEX idx_request_date (request_date),
        INDEX idx_requester_name (requester_name),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.execute(createGeneralRequestsTable);

    return NextResponse.json({
      success: true,
      message: 'General request tables created successfully',
      tables: ['general_requests']
    });

  } catch (error) {
    console.error('Error creating general request tables:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create general request tables', 
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