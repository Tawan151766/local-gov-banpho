// API route สำหรับจัดการ local_dev_plan
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: "103.80.48.25",
  port: 3306,
  user: "gmsky_banphokorat",
  password: "banphokorat56789",
  database: "gmsky_banphokorat",
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

    // Get types only
    const [rows] = await connection.execute(
      `SELECT id, type_name, created_at, updated_at
       FROM local_dev_plan_types
       ${whereClause}
       ORDER BY id ASC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Get total count for pagination
    const [countResult] = await connection.execute(
      `SELECT COUNT(DISTINCT t.id) as total FROM local_dev_plan_types t ${whereClause}`,
      params
    );
    const total = countResult[0]?.total || 0;

    // Add file count to each type
    const typesWithFileCount = await Promise.all(
      rows.map(async (type) => {
        const [countFiles] = await connection.execute(
          `SELECT COUNT(*) as files_count FROM local_dev_plan_files WHERE type_id = ?`,
          [type.id]
        );
        return {
          ...type,
          files_count: countFiles[0]?.files_count || 0
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: typesWithFileCount,
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
