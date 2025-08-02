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

// GET - ดึงรายการคำถามที่รอการตอบ (สำหรับ Admin)
export async function GET(request) {
  let connection;
  
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 10;
    const search = url.searchParams.get('search') || '';
    const offset = (page - 1) * limit;
    
    connection = await mysql.createConnection(dbConfig);
    
    // สร้าง WHERE clause สำหรับการค้นหา
    let whereClause = 'WHERE (qi.answer IS NULL OR qi.answer = "" OR qi.is_active = FALSE)';
    let searchParams = [];
    
    if (search.trim()) {
      whereClause += ' AND (qi.question LIKE ? OR qs.submitter_name LIKE ? OR qs.submitter_email LIKE ?)';
      const searchTerm = `%${search.trim()}%`;
      searchParams.push(searchTerm, searchTerm, searchTerm);
    }
    
    // ดึงข้อมูลคำถามที่รอการตอบ
    const [items] = await connection.execute(`
      SELECT 
        qi.id,
        qi.question,
        qi.answer,
        qi.category_id,
        qi.is_active,
        qi.is_featured,
        qi.tags,
        qi.display_order,
        qi.view_count,
        qi.created_at,
        qi.updated_at,
        qc.category_name,
        qs.submitter_name,
        qs.submitter_email,
        qs.submitter_phone,
        qs.submitter_ip
      FROM qa_items qi
      LEFT JOIN qa_categories qc ON qi.category_id = qc.id
      LEFT JOIN qa_submitters qs ON qi.id = qs.qa_item_id
      ${whereClause}
      ORDER BY qi.created_at DESC
      LIMIT ? OFFSET ?
    `, [...searchParams, limit, offset]);
    
    // นับจำนวนทั้งหมด
    const [countResult] = await connection.execute(`
      SELECT COUNT(*) as total
      FROM qa_items qi
      LEFT JOIN qa_submitters qs ON qi.id = qs.qa_item_id
      ${whereClause}
    `, searchParams);
    
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);
    
    return NextResponse.json({
      success: true,
      data: items,
      pagination: {
        current_page: page,
        per_page: limit,
        total: total,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_prev: page > 1
      }
    });

  } catch (error) {
    console.error('Get pending Q&A items error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get pending Q&A items',
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