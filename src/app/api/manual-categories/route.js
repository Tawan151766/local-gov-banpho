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

// GET - ดึงรายการหมวดหมู่คู่มือ
export async function GET(request) {
  let connection;
  
  try {
    const url = new URL(request.url);
    const activeOnly = url.searchParams.get('activeOnly') !== 'false';
    const withItems = url.searchParams.get('withItems') === 'true';
    
    connection = await mysql.createConnection(dbConfig);
    
    let whereClause = '';
    const params = [];
    
    if (activeOnly) {
      whereClause = 'WHERE mc.is_active = TRUE';
    }
    
    const [categories] = await connection.execute(`
      SELECT 
        mc.*,
        ${withItems ? 'COUNT(mi.id) as items_count' : '0 as items_count'}
      FROM manual_categories mc
      ${withItems ? 'LEFT JOIN manual_items mi ON mc.id = mi.category_id AND mi.is_active = TRUE' : ''}
      ${whereClause}
      ${withItems ? 'GROUP BY mc.id' : ''}
      ORDER BY mc.display_order ASC, mc.category_name ASC
    `, params);
    
    return NextResponse.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Get manual categories error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get manual categories',
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

// POST - สร้างหมวดหมู่ใหม่
export async function POST(request) {
  let connection;
  
  try {
    const body = await request.json();
    const { 
      category_name, 
      category_description, 
      icon, 
      color, 
      display_order 
    } = body;
    
    if (!category_name?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }
    
    connection = await mysql.createConnection(dbConfig);
    
    const [result] = await connection.execute(`
      INSERT INTO manual_categories (
        category_name, 
        category_description, 
        icon, 
        color, 
        display_order,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      category_name.trim(),
      category_description || null,
      icon || null,
      color || '#1890ff',
      display_order || 0
    ]);
    
    const [newCategory] = await connection.execute(
      'SELECT * FROM manual_categories WHERE id = ?',
      [result.insertId]
    );
    
    return NextResponse.json({
      success: true,
      data: newCategory[0],
      message: 'Manual category created successfully'
    });

  } catch (error) {
    console.error('Create manual category error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create manual category',
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