// /api/manuals/route.js
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

export async function GET(request) {
  let connection;
  
  try {
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get('q') || '';
    const categoryName = url.searchParams.get('categoryName');
    const limit = parseInt(url.searchParams.get('limit')) || 50;
    
    connection = await mysql.createConnection(dbConfig);
    
    let sqlQuery;
    let params = [];
    
    if (searchQuery.trim()) {
      // มีการค้นหา
      sqlQuery = `
        SELECT mi.*, mc.category_name
        FROM manual_items mi
        LEFT JOIN manual_categories mc ON mi.category_id = mc.id
        WHERE mi.is_active = TRUE
        AND (mi.title LIKE ? OR mi.description LIKE ? OR mi.content LIKE ?)
        ${categoryName ? 'AND mc.category_name = ?' : ''}
        ORDER BY mi.created_at DESC
        LIMIT ?
      `;
      
      const searchTerm = `%${searchQuery.trim()}%`;
      params = [searchTerm, searchTerm, searchTerm];
      
      if (categoryName) {
        params.push(categoryName);
      }
      
      params.push(limit);
      
    } else {
      // ไม่มีการค้นหา - ดึงทั้งหมด
      sqlQuery = `
        SELECT mi.*, mc.category_name
        FROM manual_items mi
        LEFT JOIN manual_categories mc ON mi.category_id = mc.id
        WHERE mi.is_active = TRUE
        ${categoryName ? 'AND mc.category_name = ?' : ''}
        ORDER BY mi.created_at DESC
        LIMIT ?
      `;
      
      if (categoryName) {
        params = [categoryName, limit];
      } else {
        params = [limit];
      }
    }
    
    const [results] = await connection.execute(sqlQuery, params);
    
    return NextResponse.json({
      success: true,
      data: results
    });
    
  } catch (error) {
    console.error('Manual API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch manuals'
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}