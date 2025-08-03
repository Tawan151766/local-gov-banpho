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

// PUT - แก้ไขคู่มือ
export async function PUT(request, { params }) {
  let connection;
  
  try {
    const { id } = params;
    const body = await request.json();
    const { 
      title, 
      description, 
      content,
      category_id,
      is_active,
      files = []
    } = body;
    
    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, error: 'ชื่อคู่มือจำเป็นต้องกรอก' },
        { status: 400 }
      );
    }
    
    if (!category_id) {
      return NextResponse.json(
        { success: false, error: 'กรุณาเลือกหมวดหมู่' },
        { status: 400 }
      );
    }
    
    connection = await mysql.createConnection(dbConfig);
    await connection.beginTransaction();
    
    try {
      // ตรวจสอบว่าหมวดหมู่มีอยู่จริง
      const [categories] = await connection.execute(
        'SELECT id FROM manual_categories WHERE id = ?',
        [category_id]
      );
      
      if (categories.length === 0) {
        return NextResponse.json(
          { success: false, error: 'ไม่พบหมวดหมู่ที่เลือก' },
          { status: 400 }
        );
      }
      
      // Update manual item
      const [result] = await connection.execute(`
        UPDATE manual_items 
        SET 
          title = ?,
          description = ?,
          content = ?,
          category_id = ?,
          is_active = ?,
          file_path = ?,
          updated_at = NOW()
        WHERE id = ?
      `, [
        title.trim(),
        description || null,
        content || null,
        category_id,
        is_active !== undefined ? is_active : true,
        body.file_path || null,
        id
      ]);
      
      if (result.affectedRows === 0) {
        return NextResponse.json(
          { success: false, error: 'ไม่พบคู่มือที่ต้องการแก้ไข' },
          { status: 404 }
        );
      }
      
      // Delete existing files and insert new ones
      await connection.execute('DELETE FROM manual_files WHERE manual_id = ?', [id]);
      
      // Insert new files if provided
      if (files && files.length > 0) {
        for (const file of files) {
          if (file.files_path && file.files_type) {
            await connection.execute(`
              INSERT INTO manual_files (
                manual_id, 
                files_path, 
                files_type, 
                original_name, 
                file_size, 
                description,
                display_order,
                created_at, 
                updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            `, [
              id, 
              file.files_path, 
              file.files_type,
              file.original_name || null,
              file.file_size || null,
              file.description || null,
              file.display_order || 0
            ]);
          }
        }
      }
      
      await connection.commit();
      
      const [updatedItem] = await connection.execute(`
        SELECT 
          mi.*,
          mc.category_name as category_name
        FROM manual_items mi
        LEFT JOIN manual_categories mc ON mi.category_id = mc.id
        WHERE mi.id = ?
      `, [id]);
      
      return NextResponse.json({
        success: true,
        data: updatedItem[0],
        message: 'แก้ไขคู่มือสำเร็จ'
      });
      
    } catch (error) {
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Update manual item error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'เกิดข้อผิดพลาดในการแก้ไขคู่มือ',
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

// DELETE - ลบคู่มือ
export async function DELETE(request, { params }) {
  let connection;
  
  try {
    const { id } = params;
    
    connection = await mysql.createConnection(dbConfig);
    
    // ลบไฟล์ที่เกี่ยวข้องก่อน
    await connection.execute(
      'DELETE FROM manual_files WHERE manual_id = ?',
      [id]
    );
    
    // ลบคู่มือ
    const [result] = await connection.execute(
      'DELETE FROM manual_items WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบคู่มือที่ต้องการลบ' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'ลบคู่มือสำเร็จ'
    });

  } catch (error) {
    console.error('Delete manual item error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'เกิดข้อผิดพลาดในการลบคู่มือ',
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