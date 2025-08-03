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

// GET - ค้นหาคู่มือ
export async function GET(request) {
  let connection;
  
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';
    const limit = parseInt(url.searchParams.get('limit')) || 10;
    const categoryId = url.searchParams.get('categoryId');
    
    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No search query provided'
      });
    }
    
    connection = await mysql.createConnection(dbConfig);
    
    let whereClause = 'WHERE mi.is_active = TRUE';
    const params = [];
    
    // Add search conditions
    whereClause += ' AND (mi.title LIKE ? OR mi.description LIKE ? OR mi.content LIKE ? OR mi.tags LIKE ?)';
    const searchTerm = `%${query.trim()}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    
    // Add category filter if provided
    if (categoryId) {
      whereClause += ' AND mi.category_id = ?';
      params.push(categoryId);
    }
    
    // Search with relevance scoring
    const [results] = await connection.execute(`
      SELECT 
        mi.*,
        mc.category_name,
        (SELECT COUNT(*) FROM manual_files mf WHERE mf.manual_id = mi.id AND mf.is_active = TRUE) as files_count,
        (
          CASE 
            WHEN mi.title LIKE ? THEN 4
            WHEN mi.description LIKE ? THEN 3
            WHEN mi.tags LIKE ? THEN 2
            WHEN mi.content LIKE ? THEN 1
            ELSE 0
          END
        ) as relevance_score
      FROM manual_items mi
      LEFT JOIN manual_categories mc ON mi.category_id = mc.id
      ${whereClause}
      ORDER BY relevance_score DESC, mi.is_featured DESC, mi.view_count DESC, mi.created_at DESC
      LIMIT ?
    `, [searchTerm, searchTerm, searchTerm, searchTerm, ...params, limit]);
    
    // Highlight search terms in results
    const highlightedResults = results.map(item => ({
      ...item,
      title_highlighted: highlightSearchTerm(item.title, query),
      description_highlighted: highlightSearchTerm(item.description, query)
    }));
    
    return NextResponse.json({
      success: true,
      data: highlightedResults,
      searchQuery: query,
      totalResults: results.length
    });

  } catch (error) {
    console.error('Manual search error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to search manuals',
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

// Helper function to highlight search terms
function highlightSearchTerm(text, searchTerm) {
  if (!text || !searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}