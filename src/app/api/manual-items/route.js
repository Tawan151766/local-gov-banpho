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

// GET - ดึงรายการคู่มือ
export async function GET(request) {
  let connection;
  
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 20;
    const search = url.searchParams.get('search') || '';
    const categoryId = url.searchParams.get('categoryId');
    const featuredOnly = url.searchParams.get('featuredOnly') === 'true';
    const activeOnly = url.searchParams.get('activeOnly') !== 'false';
    
    const offset = (page - 1) * limit;
    
    connection = await mysql.createConnection(dbConfig);
    
    // Build WHERE clause
    let whereClause = '';
    const params = [];
    
    if (activeOnly) {
      whereClause += 'WHERE mi.is_active = TRUE';
    }
    
    if (categoryId) {
      whereClause += (whereClause ? ' AND' : 'WHERE') + ' mi.category_id = ?';
      params.push(categoryId);
    }
    
    if (featuredOnly) {
      whereClause += (whereClause ? ' AND' : 'WHERE') + ' mi.is_featured = TRUE';
    }
    
    if (search) {
      whereClause += (whereClause ? ' AND' : 'WHERE') + ' (mi.title LIKE ? OR mi.description LIKE ? OR mi.content LIKE ? OR mi.tags LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    // Get manual items
    const [items] = await connection.execute(`
      SELECT 
        mi.*,
        mc.category_name,
        (SELECT COUNT(*) FROM manual_files mf WHERE mf.manual_id = mi.id AND mf.is_active = TRUE) as files_count
      FROM manual_items mi
      LEFT JOIN manual_categories mc ON mi.category_id = mc.id
      ${whereClause}
      ORDER BY mi.display_order ASC, mi.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    // Get all manual_files for all items in this page
    const itemIds = items.map(item => item.id);
    let filesByItem = {};
    if (itemIds.length > 0) {
      const [files] = await connection.execute(
        `SELECT * FROM manual_files WHERE manual_id IN (${itemIds.map(() => '?').join(',')}) AND is_active = TRUE ORDER BY display_order, id`,
        itemIds
      );
      filesByItem = itemIds.reduce((acc, id) => {
        acc[id] = files.filter(f => f.manual_id === id);
        return acc;
      }, {});
    }
    // Attach files to each item
    const itemsWithFiles = items.map(item => ({
      ...item,
      files: filesByItem[item.id] || []
    }));

    // Get total count
    const [countResult] = await connection.execute(`
      SELECT COUNT(*) as total
      FROM manual_items mi
      LEFT JOIN manual_categories mc ON mi.category_id = mc.id
      ${whereClause}
    `, params);
    
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);
    
    return NextResponse.json({
      success: true,
      data: itemsWithFiles,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get manual items error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get manual items',
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

// POST - สร้างคู่มือใหม่
export async function POST(request) {
  let connection;
  
  try {
    const body = await request.json();
    const { 
      category_id,
      title,
      description,
      content,
      tags,
      display_order,
      is_featured,
      files
    } = body;
    
    if (!category_id || !title?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Category ID and title are required' },
        { status: 400 }
      );
    }
    
    connection = await mysql.createConnection(dbConfig);
    await connection.beginTransaction();
    
    // Insert manual item
    const [result] = await connection.execute(`
      INSERT INTO manual_items (
        category_id,
        title,
        description,
        content,
        tags,
        display_order,
        is_featured,
        file_path,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      category_id,
      title.trim(),
      description || null,
      content || null,
      tags || null,
      display_order || 0,
      is_featured || false,
      body.file_path || null
    ]);
    
    const manualId = result.insertId;
    
    // Insert files if provided
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
            manualId, 
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
    
    // Get created manual with category info
    const [newManual] = await connection.execute(`
      SELECT 
        mi.*,
        mc.category_name,
        (SELECT COUNT(*) FROM manual_files mf WHERE mf.manual_id = mi.id AND mf.is_active = TRUE) as files_count
      FROM manual_items mi
      LEFT JOIN manual_categories mc ON mi.category_id = mc.id
      WHERE mi.id = ?
    `, [manualId]);
    
    return NextResponse.json({
      success: true,
      data: newManual[0],
      message: 'Manual created successfully'
    });

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Create manual error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create manual',
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