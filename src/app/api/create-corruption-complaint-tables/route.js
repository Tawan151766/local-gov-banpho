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

// POST /api/create-corruption-complaint-tables - สร้างตาราง Corruption Complaint
export async function POST(request) {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);

    // Start transaction
    await connection.beginTransaction();

    try {
      // Create corruption_complaints table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS corruption_complaints (
          id INT AUTO_INCREMENT PRIMARY KEY,
          complaint_date DATE NOT NULL,
          
          -- ข้อมูลผู้ร้องเรียน
          complainant_name VARCHAR(255) NOT NULL,
          complainant_id_card VARCHAR(13) NOT NULL,
          complainant_address TEXT NOT NULL,
          complainant_age INT NOT NULL,
          complainant_phone VARCHAR(20) NOT NULL,
          
          -- ข้อมูลผู้ถูกร้องเรียน
          accused_name VARCHAR(255) NOT NULL,
          accused_position VARCHAR(255) NOT NULL,
          accused_agency VARCHAR(255) NOT NULL,
          accused_province VARCHAR(100) NOT NULL,
          
          -- รายละเอียดการร้องเรียน
          complaint_details TEXT NOT NULL,
          
          -- สถานะการดำเนินการ
          status ENUM('pending', 'investigating', 'completed', 'rejected') DEFAULT 'pending',
          status_note TEXT,
          
          -- ข้อมูลการติดตาม
          assigned_to VARCHAR(255),
          investigation_result TEXT,
          action_taken TEXT,
          
          -- ข้อมูลระบบ
          ip_address VARCHAR(45),
          user_agent TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          
          -- Indexes
          INDEX idx_complaint_date (complaint_date),
          INDEX idx_complainant_name (complainant_name),
          INDEX idx_accused_name (accused_name),
          INDEX idx_status (status),
          INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // Commit transaction
      await connection.commit();

      return NextResponse.json({
        success: true,
        message: 'Corruption Complaint table created successfully',
        tables: ['corruption_complaints']
      }, { status: 201 });

    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Error creating Corruption Complaint tables:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create Corruption Complaint tables', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// GET /api/create-corruption-complaint-tables - ตรวจสอบสถานะตาราง
export async function GET(request) {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);

    // Check if table exists
    const tableName = 'corruption_complaints';
    const [tableCheck] = await connection.execute(`
      SELECT COUNT(*) as count FROM information_schema.tables 
      WHERE table_schema = 'gmsky_banphokorat' AND table_name = ?
    `, [tableName]);

    const tableExists = tableCheck[0].count > 0;
    let recordCount = 0;

    // Get record count if table exists
    if (tableExists) {
      const [recordCountResult] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
      recordCount = recordCountResult[0].count;
    }

    // Get recent complaints with status summary
    let recentComplaints = [];
    let statusSummary = {};
    
    if (tableExists) {
      // Get recent complaints
      const [complaints] = await connection.execute(`
        SELECT 
          id,
          complaint_date,
          complainant_name,
          accused_name,
          accused_position,
          accused_agency,
          status,
          created_at
        FROM corruption_complaints
        ORDER BY created_at DESC
        LIMIT 10
      `);
      recentComplaints = complaints;

      // Get status summary
      const [statusCounts] = await connection.execute(`
        SELECT status, COUNT(*) as count
        FROM corruption_complaints
        GROUP BY status
      `);
      
      statusCounts.forEach(row => {
        statusSummary[row.status] = row.count;
      });
    }

    return NextResponse.json({
      success: true,
      tableExists,
      recordCount,
      recentComplaints,
      statusSummary
    });

  } catch (error) {
    console.error('Error checking Corruption Complaint tables:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check Corruption Complaint tables', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}