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

// PUT - อนุมัติความคิดเห็น
export async function PUT(request, { params }) {
  let connection;
  
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Comment ID is required' },
        { status: 400 }
      );
    }
    
    connection = await mysql.createConnection(dbConfig);
    
    // อนุมัติความคิดเห็น
    await connection.execute(`
      UPDATE qa_comments 
      SET is_approved = 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [id]);
    
    // ดึงข้อมูลความคิดเห็นที่อนุมัติแล้ว
    const [comments] = await connection.execute(`
      SELECT 
        id,
        qa_item_id,
        comment_text,
        commenter_name,
        commenter_email,
        rating,
        is_approved,
        created_at,
        updated_at
      FROM qa_comments 
      WHERE id = ?
    `, [id]);
    
    return NextResponse.json({
      success: true,
      data: comments[0],
      message: 'Comment approved successfully'
    });

  } catch (error) {
    console.error('Approve comment error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to approve comment',
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