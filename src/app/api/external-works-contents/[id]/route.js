import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// GET /api/external-works-contents/[id]
export async function GET(request, { params }) {
  let connection;
  try {
    const { id } = params;
    connection = await mysql.createConnection(dbConfig);
    const [contents] = await connection.execute(
      "SELECT * FROM external_works_contents WHERE id = ? AND deleted_at IS NULL",
      [parseInt(id)]
    );
    if (contents.length === 0) {
      return NextResponse.json({ success: false, error: "Content not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: contents[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

// PUT /api/external-works-contents/[id]
export async function PUT(request, { params }) {
  let connection;
  try {
    const { id } = params;
    const body = await request.json();
    const { url, description } = body;
    if (!url) {
      return NextResponse.json({ success: false, error: "URL is required" }, { status: 400 });
    }
    connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "UPDATE external_works_contents SET url = ?, description = ?, updated_at = NOW() WHERE id = ? AND deleted_at IS NULL",
      [url, description || "", parseInt(id)]
    );
    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: "Content not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

// DELETE /api/external-works-contents/[id]
export async function DELETE(request, { params }) {
  let connection;
  try {
    const { id } = params;
    connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "UPDATE external_works_contents SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL",
      [parseInt(id)]
    );
    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: "Content not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
