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

// POST - เพิ่มจำนวนการดู
export async function POST(request, { params }) {
  let connection;
  
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Q&A ID is required' },
        { status: 400 }
      );
    }
    
    connection = await mysql.createConnection(dbConfig);
    
    // เพิ่มจำนวนการดู
    await connection.execute(`
      UPDATE qa_items 
      SET view_count = view_count + 1 
      WHERE id = ? AND is_active = TRUE
    `, [id]);
    
    // ดึงข้อมูลที่อัปเดตแล้ว
    const [items] = await connection.execute(`
      SELECT 
        qi.*,
        qc.category_name
      FROM qa_items qi
      LEFT JOIN qa_categories qc ON qi.category_id = qc.id
      WHERE qi.id = ?
    `, [id]);
    
    if (items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Q&A item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: items[0],
      message: 'View count updated successfully'
    });

  } catch (error) {
    console.error('Update view count error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update view count',
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