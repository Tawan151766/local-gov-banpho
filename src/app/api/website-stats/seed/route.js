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

// POST - สร้างข้อมูลทดสอบ
export async function POST(request) {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    
    // สร้างตารางถ้ายังไม่มี
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS website_visits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ip_address VARCHAR(45),
        user_agent TEXT,
        page_url VARCHAR(500),
        visit_date DATE,
        visit_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        session_id VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_visit_date (visit_date),
        INDEX idx_visit_time (visit_time),
        INDEX idx_ip_address (ip_address)
      )
    `);

    // ลบข้อมูลเก่า
    await connection.execute('DELETE FROM website_visits');

    const now = new Date();
    const visits = [];

    // สร้างข้อมูลย้อนหลัง 1 ปี
    for (let days = 365; days >= 0; days--) {
      const date = new Date(now);
      date.setDate(date.getDate() - days);
      
      // จำนวนผู้เข้าชมต่อวัน (สุ่ม)
      const dailyVisitors = Math.floor(Math.random() * 500) + 100; // 100-600 คนต่อวัน
      
      for (let i = 0; i < dailyVisitors; i++) {
        // สร้าง IP address สุ่ม
        const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        
        // สร้างเวลาสุ่มในวันนั้น
        const visitTime = new Date(date);
        visitTime.setHours(Math.floor(Math.random() * 24));
        visitTime.setMinutes(Math.floor(Math.random() * 60));
        visitTime.setSeconds(Math.floor(Math.random() * 60));
        
        const userAgents = [
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
          'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0'
        ];
        
        const pages = ['/', '/news', '/services', '/contact', '/about'];
        
        visits.push([
          ip,
          userAgents[Math.floor(Math.random() * userAgents.length)],
          pages[Math.floor(Math.random() * pages.length)],
          date.toISOString().split('T')[0],
          visitTime.toISOString().slice(0, 19).replace('T', ' '),
          `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        ]);
      }
    }

    // เพิ่มผู้ใช้ที่ active ขณะนี้ (5 นาทีที่ผ่านมา)
    const currentActiveUsers = Math.floor(Math.random() * 50) + 10; // 10-60 คน
    for (let i = 0; i < currentActiveUsers; i++) {
      const ip = `192.168.1.${Math.floor(Math.random() * 255)}`;
      const recentTime = new Date();
      recentTime.setMinutes(recentTime.getMinutes() - Math.floor(Math.random() * 5));
      
      visits.push([
        ip,
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        '/',
        now.toISOString().split('T')[0],
        recentTime.toISOString().slice(0, 19).replace('T', ' '),
        `current_session_${Date.now()}_${i}`
      ]);
    }

    // บันทึกข้อมูลทั้งหมด
    const batchSize = 1000;
    for (let i = 0; i < visits.length; i += batchSize) {
      const batch = visits.slice(i, i + batchSize);
      const placeholders = batch.map(() => '(?, ?, ?, ?, ?, ?)').join(', ');
      const values = batch.flat();
      
      await connection.execute(
        `INSERT INTO website_visits 
         (ip_address, user_agent, page_url, visit_date, visit_time, session_id) 
         VALUES ${placeholders}`,
        values
      );
    }

    return NextResponse.json({
      success: true,
      message: `Created ${visits.length} sample visit records`,
      data: {
        totalRecords: visits.length,
        currentActiveUsers: currentActiveUsers
      }
    });

  } catch (error) {
    console.error('Seed data error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create seed data',
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