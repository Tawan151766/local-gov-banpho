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

// POST /api/complaints - สร้างคำร้องเรียนใหม่
export async function POST(request) {
  let connection;
  try {
    const body = await request.json();
    const {
      senderName,
      senderEmail,
      phone,
      subject,
      message,
      captcha
    } = body;

    // Validate required fields
    if (!senderName || !senderEmail || !message) {
      return NextResponse.json(
        { success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // Get client IP and user agent
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    connection = await mysql.createConnection(dbConfig);

    // Start transaction
    await connection.beginTransaction();

    try {
      // Insert complaint
      const [result] = await connection.execute(`
        INSERT INTO complaints (
          senderName,
          senderEmail,
          phone,
          subject,
          message,
          captcha,
          ip_address,
          user_agent
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        senderName,
        senderEmail,
        phone || null,
        subject || null,
        message,
        captcha || null,
        ip,
        userAgent
      ]);

      const complaintId = result.insertId;

      // Commit transaction
      await connection.commit();

      return NextResponse.json({
        success: true,
        message: 'ส่งเรื่องร้องทุกข์เรียบร้อยแล้ว',
        data: {
          complaintId,
          referenceNumber: `C${complaintId.toString().padStart(6, '0')}`
        }
      }, { status: 201 });

    } catch (error) {
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Error creating complaint:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการส่งเรื่องร้องทุกข์', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
