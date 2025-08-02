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

// GET - ค้นหา Q&A
export async function GET(request) {
  let connection;
  
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit')) || 10;
    
    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No search query provided'
      });
    }
    
    connection = await mysql.createConnection(dbConfig);
    
    // ค้นหาด้วย FULLTEXT search (ถ้าใช้ได้) หรือ LIKE
    const searchQuery = query.trim();
    
    try {
      // ลองใช้ FULLTEXT search ก่อน
      const [items] = await connection.execute(`
        SELECT 
          qi.*,
          qc.category_name,
          MATCH(qi.question, qi.answer) AGAINST(? IN NATURAL LANGUAGE MODE) as relevance
        FROM qa_items qi
        LEFT JOIN qa_categories qc ON qi.category_id = qc.id
        WHERE qi.is_active = TRUE 
          AND qc.is_active = TRUE
          AND MATCH(qi.question, qi.answer) AGAINST(? IN NATURAL LANGUAGE MODE)
        ORDER BY relevance DESC, qi.view_count DESC
        LIMIT ?
      `, [searchQuery, searchQuery, limit]);
      
      if (items.length > 0) {
        return NextResponse.json({
          success: true,
          data: items,
          searchType: 'fulltext',
          query: searchQuery
        });
      }
    } catch (fulltextError) {
      console.log('FULLTEXT search not available, using LIKE search');
    }
    
    // ถ้า FULLTEXT ไม่ได้ผล ใช้ LIKE search
    const [items] = await connection.execute(`
      SELECT 
        qi.*,
        qc.category_name,
        (
          CASE 
            WHEN qi.question LIKE ? THEN 3
            WHEN qi.answer LIKE ? THEN 2
            WHEN qi.tags LIKE ? THEN 1
            ELSE 0
          END
        ) as relevance
      FROM qa_items qi
      LEFT JOIN qa_categories qc ON qi.category_id = qc.id
      WHERE qi.is_active = TRUE 
        AND qc.is_active = TRUE
        AND (
          qi.question LIKE ? 
          OR qi.answer LIKE ? 
          OR qi.tags LIKE ?
        )
      ORDER BY relevance DESC, qi.view_count DESC
      LIMIT ?
    `, [
      `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`,
      `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`,
      limit
    ]);
    
    return NextResponse.json({
      success: true,
      data: items,
      searchType: 'like',
      query: searchQuery
    });

  } catch (error) {
    console.error('Search Q&A error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to search Q&A',
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