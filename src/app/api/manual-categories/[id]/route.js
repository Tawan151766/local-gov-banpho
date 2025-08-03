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

// PUT - แก้ไขหมวดหมู่
export async function PUT(request, { params }) {
  let connection;
  
  try {
    const { id } = params;
    const body = await request.json();
    const { 
      name, 
      description, 
      is_active,
      category_name,
      category_description,
      icon,
      color,
      display_order
    } = body;
    
    // Support both old and new field names
    const categoryName = name || category_name;
    const categoryDescription = description || category_description;
    
    if (!categoryName?.trim()) {
      return NextResponse.json(
        { success: false, error: 'ชื่อหมวดหมู่จำเป็นต้องกรอก' },
        { status: 400 }
      );
    }
    
    connection = await mysql.createConnection(dbConfig);
    
    const [result] = await connection.execute(`
      UPDATE manual_categories 
      SET 
        category_name = ?,
        category_description = ?,
        icon = ?,
        color = ?,
        display_order = ?,
        is_active = ?,
        updated_at = NOW()
      WHERE id = ?
    `, [
      categoryName.trim(),
      categoryDescription || null,
      icon || null,
      color || '#1890ff',
      display_order || 0,
      is_active !== undefined ? is_active : true,
      id
    ]);
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบหมวดหมู่ที่ต้องการแก้ไข' },
        { status: 404 }
      );
    }
    
    const [updatedCategory] = await connection.execute(
      'SELECT * FROM manual_categories WHERE id = ?',
      [id]
    );
    
    return NextResponse.json({
      success: true,
      data: updatedCategory[0],
      message: 'แก้ไขหมวดหมู่สำเร็จ'
    });

  } catch (error) {
    console.error('Update manual category error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'เกิดข้อผิดพลาดในการแก้ไขหมวดหมู่',
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

// DELETE - ลบหมวดหมู่
export async function DELETE(request, { params }) {
  let connection;
  
  try {
    const { id } = params;
    
    connection = await mysql.createConnection(dbConfig);
    
    // ตรวจสอบว่ามีคู่มือในหมวดหมู่นี้หรือไม่
    const [items] = await connection.execute(
      'SELECT COUNT(*) as count FROM manual_items WHERE category_id = ?',
      [id]
    );
    
    if (items[0].count > 0) {
      return NextResponse.json(
        { success: false, error: 'ไม่สามารถลบหมวดหมู่ที่มีคู่มืออยู่ได้' },
        { status: 400 }
      );
    }
    
    const [result] = await connection.execute(
      'DELETE FROM manual_categories WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบหมวดหมู่ที่ต้องการลบ' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'ลบหมวดหมู่สำเร็จ'
    });

  } catch (error) {
    console.error('Delete manual category error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'เกิดข้อผิดพลาดในการลบหมวดหมู่',
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