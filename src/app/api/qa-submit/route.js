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

// POST - ส่งคำถามใหม่จากประชาชน
export async function POST(request) {
  let connection;
  
  try {
    const body = await request.json();
    const { 
      category_id, 
      question, 
      submitter_name,
      submitter_email,
      submitter_phone
    } = body;
    
    if (!question?.trim()) {
      return NextResponse.json(
        { success: false, error: 'กรุณากรอกคำถาม' },
        { status: 400 }
      );
    }
    
    // ดึง IP address และ User Agent
    const forwarded = request.headers.get('x-forwarded-for');
    const ipAddress = forwarded ? forwarded.split(',')[0] : 
                     request.headers.get('x-real-ip') || 
                     request.ip || 
                     'unknown';
    
    const userAgent = request.headers.get('user-agent') || '';
    
    connection = await mysql.createConnection(dbConfig);
    
    // บันทึกคำถามใหม่ (เผยแพร่ทันที)
    const [result] = await connection.execute(`
      INSERT INTO qa_items 
      (category_id, question, answer, is_active, is_featured, submitter_ip, submitter_user_agent) 
      VALUES (?, ?, ?, TRUE, FALSE, ?, ?)
    `, [
      category_id || null,
      question.trim(),
      'คำตอบจะถูกเพิ่มโดยเจ้าหน้าที่โดยเร็วที่สุด', // คำตอบเริ่มต้น
      ipAddress,
      userAgent
    ]);
    
    // บันทึกข้อมูลผู้ส่งคำถาม (ถ้ามี)
    if (submitter_name || submitter_email || submitter_phone) {
      try {
        // สร้างตารางสำหรับเก็บข้อมูลผู้ส่งคำถาม
        await connection.execute(`
          CREATE TABLE IF NOT EXISTS qa_submitters (
            id INT AUTO_INCREMENT PRIMARY KEY,
            qa_item_id INT,
            submitter_name VARCHAR(255),
            submitter_email VARCHAR(255),
            submitter_phone VARCHAR(20),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (qa_item_id) REFERENCES qa_items(id) ON DELETE CASCADE,
            INDEX idx_qa_item_id (qa_item_id),
            INDEX idx_submitter_email (submitter_email)
          )
        `);
        
        await connection.execute(`
          INSERT INTO qa_submitters 
          (qa_item_id, submitter_name, submitter_email, submitter_phone) 
          VALUES (?, ?, ?, ?)
        `, [
          result.insertId,
          submitter_name || null,
          submitter_email || null,
          submitter_phone || null
        ]);
      } catch (submitterError) {
        console.error('Error saving submitter info:', submitterError);
        // ไม่ให้ error นี้หยุดการทำงาน
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        id: result.insertId,
        question: question.trim(),
        status: 'รอการตอบจากเจ้าหน้าที่',
        submitter_ip: ipAddress
      },
      message: 'ส่งคำถามเรียบร้อยแล้ว เจ้าหน้าที่จะตอบกลับโดยเร็วที่สุด'
    });

  } catch (error) {
    console.error('Submit Q&A error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'ไม่สามารถส่งคำถามได้ กรุณาลองใหม่อีกครั้ง',
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