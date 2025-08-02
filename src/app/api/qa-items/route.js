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

// GET - ดึงรายการ Q&A
export async function GET(request) {
  let connection;
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId');
    const featuredOnly = searchParams.get('featuredOnly') === 'true';
    const activeOnly = searchParams.get('activeOnly') !== 'false'; // default true
    
    const offset = (page - 1) * limit;
    
    connection = await mysql.createConnection(dbConfig);
    
    // Build WHERE clause
    let whereClause = '';
    const params = [];
    
    if (activeOnly) {
      whereClause += 'WHERE qi.is_active = TRUE';
    }
    
    if (categoryId) {
      whereClause += (whereClause ? ' AND' : 'WHERE') + ' qi.category_id = ?';
      params.push(categoryId);
    }
    
    if (featuredOnly) {
      whereClause += (whereClause ? ' AND' : 'WHERE') + ' qi.is_featured = TRUE';
    }
    
    if (search) {
      whereClause += (whereClause ? ' AND' : 'WHERE') + ' (qi.question LIKE ? OR qi.answer LIKE ? OR qi.tags LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    // Get Q&A items
    const [items] = await connection.execute(`
      SELECT 
        qi.*,
        qc.category_name
      FROM qa_items qi
      LEFT JOIN qa_categories qc ON qi.category_id = qc.id
      ${whereClause}
      ORDER BY qi.display_order ASC, qi.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);
    
    // Get total count
    const [countResult] = await connection.execute(`
      SELECT COUNT(*) as total
      FROM qa_items qi
      LEFT JOIN qa_categories qc ON qi.category_id = qc.id
      ${whereClause}
    `, params);
    
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);
    
    return NextResponse.json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });

  } catch (error) {
    console.error('Get Q&A items error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get Q&A items',
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

// POST - สร้าง Q&A ใหม่
export async function POST(request) {
  let connection;
  
  try {
    const body = await request.json();
    const { 
      category_id, 
      question, 
      answer, 
      display_order, 
      is_active, 
      is_featured, 
      tags 
    } = body;
    
    if (!question?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Question is required' },
        { status: 400 }
      );
    }
    
    if (!answer?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Answer is required' },
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
    
    const [result] = await connection.execute(`
      INSERT INTO qa_items 
      (category_id, question, answer, display_order, is_active, is_featured, tags, submitter_ip, submitter_user_agent) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      category_id || null,
      question.trim(),
      answer.trim(),
      display_order || 0,
      is_active !== false,
      is_featured === true,
      tags || null,
      ipAddress,
      userAgent
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        id: result.insertId,
        category_id,
        question: question.trim(),
        answer: answer.trim(),
        display_order: display_order || 0,
        is_active: is_active !== false,
        is_featured: is_featured === true,
        tags
      },
      message: 'Q&A item created successfully'
    });

  } catch (error) {
    console.error('Create Q&A item error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create Q&A item',
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