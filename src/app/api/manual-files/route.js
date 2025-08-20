import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// ปรับค่าตาม config จริงของคุณ
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'banpho',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
};

export async function GET(request) {
  let connection;
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('item_id') || searchParams.get('manual_id');
    if (!itemId) {
      return NextResponse.json({ success: false, error: 'ต้องระบุ item_id หรือ manual_id' }, { status: 400 });
    }
    connection = await mysql.createConnection(dbConfig);
    const [files] = await connection.execute(
      'SELECT id, manual_id, files_path, files_type, original_name, file_size, description, display_order, is_active, created_at, updated_at FROM manual_files WHERE manual_id = ? AND is_active = TRUE ORDER BY display_order, id',
      [itemId]
    );
    return NextResponse.json({ success: true, data: files });
  } catch (error) {
    console.error('manual-files API error:', error);
    return NextResponse.json({ success: false, error: 'เกิดข้อผิดพลาดในการดึงไฟล์', details: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
