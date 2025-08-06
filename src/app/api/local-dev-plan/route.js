// API route สำหรับจัดการ local_dev_plan
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
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    // Build WHERE clause
    let whereClause = '';
    const params = [];
    if (search) {
      whereClause = 'WHERE t.type_name LIKE ?';
      params.push(`%${search}%`);
    }

    // Get types with file details
    const [rows] = await connection.execute(
      `SELECT 
        t.id, 
        t.type_name, 
        t.created_at, 
        t.updated_at,
        COUNT(DISTINCT f.id) as files_count
       FROM local_dev_plan_types t
       LEFT JOIN local_dev_plan_files f ON f.type_id = t.id
       ${whereClause}
       GROUP BY t.id, t.type_name, t.created_at, t.updated_at
       ORDER BY t.id DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Get total count for pagination
    const [countResult] = await connection.execute(
      `SELECT COUNT(DISTINCT t.id) as total FROM local_dev_plan_types t ${whereClause}`,
      params
    );
    const total = countResult[0]?.total || 0;

    // Add recent files preview to each type
    const typesWithDetails = await Promise.all(
      rows.map(async (type) => {
        const [recentFiles] = await connection.execute(
          `SELECT 
            id,
            files_path,
            files_type,
            original_name,
            file_size,
            created_at
           FROM local_dev_plan_files 
           WHERE type_id = ? 
           ORDER BY created_at DESC 
           LIMIT 3`,
          [type.id]
        );

        return {
          ...type,
          files_count: parseInt(type.files_count) || 0,
          recent_files: recentFiles
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: typesWithDetails,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching local dev plan:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch local dev plan', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// TODO: เพิ่ม POST, PUT, DELETE สำหรับการจัดการข้อมูล
