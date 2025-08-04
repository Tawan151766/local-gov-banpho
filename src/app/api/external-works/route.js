import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// GET /api/external-works
export async function GET(request) {
  let connection;
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const offset = (page - 1) * limit;
    connection = await mysql.createConnection(dbConfig);
    let whereClause = "WHERE deleted_at IS NULL";
    let queryParams = [];
    if (search) {
      whereClause += " AND (name LIKE ? OR description LIKE ?)";
      queryParams.push(`%${search}%`, `%${search}%`);
    }
    const [countResult] = await connection.execute(
      `SELECT COUNT(*) as total FROM external_works ${whereClause}`,
      queryParams
    );
    const total = countResult[0].total;
    const [works] = await connection.execute(
      `SELECT * FROM external_works ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...queryParams, limit, offset]
    );
    return NextResponse.json({
      success: true,
      data: works,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

// POST /api/external-works
export async function POST(request) {
  let connection;
  try {
    const body = await request.json();
    const { name, description, work_date } = body;
    if (!name) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }
    connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "INSERT INTO external_works (name, description, work_date, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
      [name, description || "", work_date || null]
    );
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
