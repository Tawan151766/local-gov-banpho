import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Database connection
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// GET - ดึงสถิติการเข้าชมเว็บไซต์
export async function GET(request) {
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

    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const thisWeekStart = new Date(now.setDate(now.getDate() - now.getDay()))
      .toISOString()
      .split("T")[0];
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    const thisYearStart = new Date(now.getFullYear(), 0, 1)
      .toISOString()
      .split("T")[0];

    // ดึงสถิติต่างๆ
    const queries = {
      // ขณะนี้ (ผู้ใช้ที่ active ใน 5 นาทีที่ผ่านมา)
      current: `
        SELECT COUNT(DISTINCT ip_address) as count 
        FROM website_visits 
        WHERE visit_time >= DATE_SUB(NOW(), INTERVAL 5 MINUTE)
      `,

      // วันนี้
      today: `
        SELECT COUNT(DISTINCT ip_address) as count 
        FROM website_visits 
        WHERE visit_date = CURDATE()
      `,

      // สัปดาห์นี้
      thisWeek: `
        SELECT COUNT(DISTINCT ip_address) as count 
        FROM website_visits 
        WHERE visit_date >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
      `,

      // เดือนนี้
      thisMonth: `
        SELECT COUNT(DISTINCT ip_address) as count 
        FROM website_visits 
        WHERE visit_date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
      `,

      // ปีนี้
      thisYear: `
        SELECT COUNT(DISTINCT ip_address) as count 
        FROM website_visits 
        WHERE visit_date >= DATE_FORMAT(CURDATE(), '%Y-01-01')
      `,

      // ทั้งหมด
      total: `
        SELECT COUNT(DISTINCT ip_address) as count 
        FROM website_visits
      `,
    };

    const results = {};

    for (const [key, query] of Object.entries(queries)) {
      const [rows] = await connection.execute(query);
      results[key] = rows[0]?.count || 0;
    }

    return NextResponse.json({
      success: true,
      data: {
        current: results.current,
        today: results.today,
        thisWeek: results.thisWeek,
        thisMonth: results.thisMonth,
        thisYear: results.thisYear,
        total: results.total,
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Website stats error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get website statistics",
        details: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// POST - บันทึกการเข้าชม
export async function POST(request) {
  let connection;

  try {
    const body = await request.json();
    const { pageUrl, sessionId } = body;

    // ดึง IP address และ User Agent
    const forwarded = request.headers.get("x-forwarded-for");
    const ipAddress = forwarded
      ? forwarded.split(",")[0]
      : request.headers.get("x-real-ip") || request.ip || "unknown";

    const userAgent = request.headers.get("user-agent") || "";

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

    // บันทึกการเข้าชม
    await connection.execute(
      `INSERT INTO website_visits 
       (ip_address, user_agent, page_url, visit_date, session_id) 
       VALUES (?, ?, ?, CURDATE(), ?)`,
      [ipAddress, userAgent, pageUrl || "/", sessionId || ""]
    );

    return NextResponse.json({
      success: true,
      message: "Visit recorded successfully",
    });
  } catch (error) {
    console.error("Record visit error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to record visit",
        details: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
