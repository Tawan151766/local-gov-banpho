import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// GET /api/external-works-contents
export async function GET(request) {
  let connection;
  try {
    const { searchParams } = new URL(request.url);
    const externalWorkId = searchParams.get("externalWorkId");
    const limit = parseInt(searchParams.get("limit")) || 100;
    connection = await mysql.createConnection(dbConfig);
    let whereClause = "WHERE deleted_at IS NULL";
    const params = [];
    if (externalWorkId) {
      whereClause += " AND external_work_id = ?";
      params.push(parseInt(externalWorkId));
    }
    const [contents] = await connection.execute(
      `SELECT * FROM external_works_contents ${whereClause} ORDER BY created_at ASC LIMIT ?`,
      [...params, limit]
    );
    return NextResponse.json({ success: true, data: contents });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

// POST /api/external-works-contents
export async function POST(request) {
  let connection;
  try {
    const body = await request.json();
    const { url, description, external_work_id } = body;
    if (!url || !external_work_id) {
      return NextResponse.json({ success: false, error: "URL and external_work_id are required" }, { status: 400 });
    }
    connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "INSERT INTO external_works_contents (url, description, external_work_id, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
      [url, description || "", external_work_id]
    );
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
