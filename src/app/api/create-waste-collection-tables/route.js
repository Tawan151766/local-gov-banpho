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

export async function POST() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    
    // Create waste_collection_requests table
    const createWasteCollectionRequestsTable = `
      CREATE TABLE IF NOT EXISTS waste_collection_requests (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        request_date DATE NOT NULL,
        
        -- ข้อมูลผู้ยื่นคำร้อง (Requester Information)
        requester_title VARCHAR(20) NOT NULL,
        requester_name VARCHAR(255) NOT NULL,
        requester_id_card VARCHAR(20),
        requester_age INT NOT NULL,
        requester_house_number VARCHAR(50) NOT NULL,
        requester_village VARCHAR(100) NOT NULL,
        requester_subdistrict VARCHAR(100) NOT NULL DEFAULT 'ตำบลบ้านโพธิ์',
        requester_district VARCHAR(100) NOT NULL DEFAULT 'อำเภอบ้านโพธิ์',
        requester_province VARCHAR(100) NOT NULL DEFAULT 'จังหวัดฉะเชิงเทรา',
        requester_phone VARCHAR(20),
        
        -- ประเภทขยะ (Waste Types)
        waste_type_household BOOLEAN DEFAULT FALSE,
        waste_type_rental BOOLEAN DEFAULT FALSE,
        waste_type_shop BOOLEAN DEFAULT FALSE,
        waste_type_factory BOOLEAN DEFAULT FALSE,
        other_waste_type TEXT,
        
        -- รายละเอียดคำร้อง (Request Details)
        collection_details TEXT NOT NULL,
        reason_for_request TEXT NOT NULL,
        
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
        INDEX idx_waste_collection_request_date (request_date),
        INDEX idx_waste_collection_requester_name (requester_name),
        INDEX idx_waste_collection_status (status),
        INDEX idx_waste_collection_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.execute(createWasteCollectionRequestsTable);

    return NextResponse.json({
      success: true,
      message: 'Waste collection request tables created successfully',
      tables: ['waste_collection_requests']
    });

  } catch (error) {
    console.error('Error creating waste collection request tables:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create waste collection request tables', 
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