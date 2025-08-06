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

// GET - ดึงความคิดเห็นของ Q&A item
export async function GET(request) {
  let connection;
  
  try {
    const url = new URL(request.url);
    const qaItemId = url.searchParams.get('qa_item_id');
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;
    
    if (!qaItemId) {
      return NextResponse.json(
        { success: false, error: 'qa_item_id is required' },
        { status: 400 }
      );
    }
    
    connection = await mysql.createConnection(dbConfig);
    
    // ดึงความคิดเห็นทั้งหมด (ไม่ต้องรอการอนุมัติ)
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
      WHERE qa_item_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [qaItemId, limit, offset]);
    
    // นับจำนวนความคิดเห็นทั้งหมด
    const [countResult] = await connection.execute(`
      SELECT COUNT(*) as total
      FROM qa_comments 
      WHERE qa_item_id = ?
    `, [qaItemId]);
    
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);
    
    return NextResponse.json({
      success: true,
      data: comments,
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
    console.error('Get comments error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get comments',
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

// POST - ส่งความคิดเห็นใหม่
export async function POST(request) {
  let connection;
  
  try {
    const body = await request.json();
    const { 
      qa_item_id, 
      comment_text, 
      commenter_name, 
      commenter_email,
      rating 
    } = body;
    
    if (!qa_item_id || !comment_text?.trim()) {
      return NextResponse.json(
        { success: false, error: 'qa_item_id and comment_text are required' },
        { status: 400 }
      );
    }
    
    // Get client IP
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    
    connection = await mysql.createConnection(dbConfig);
    
    // Insert comment (อนุมัติทันที)
    const [result] = await connection.execute(`
      INSERT INTO qa_comments (
        qa_item_id,
        comment_text,
        commenter_name,
        commenter_email,
        rating,
        commenter_ip,
        is_approved,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
    `, [
      qa_item_id,
      comment_text.trim(),
      commenter_name || null,
      commenter_email || null,
      rating || null,
      ip
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        id: result.insertId,
        qa_item_id,
        comment_text: comment_text.trim(),
        commenter_name,
        commenter_email,
        rating,
        is_approved: true
      },
      message: 'Comment submitted and published successfully.'
    });

  } catch (error) {
    console.error('Submit comment error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit comment',
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