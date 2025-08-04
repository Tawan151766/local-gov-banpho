import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// GET /api/child-development-centers/[id]
export async function GET(request, { params }) {
  let connection;
  try {
    const { id } = params;
    connection = await mysql.createConnection(dbConfig);
    const [centers] = await connection.execute(
      "SELECT * FROM child_development_centers WHERE id = ? AND deleted_at IS NULL",
      [parseInt(id)]
    );
    if (centers.length === 0) {
      return NextResponse.json({ success: false, error: "Center not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: centers[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

// PUT /api/child-development-centers/[id]
export async function PUT(request, { params }) {
  let connection;
  try {
    const { id } = params;
    const body = await request.json();
    const { name, description, center_date } = body;
    if (!name) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }
    connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "UPDATE child_development_centers SET name = ?, description = ?, center_date = ?, updated_at = NOW() WHERE id = ? AND deleted_at IS NULL",
      [name, description || "", center_date || null, parseInt(id)]
    );
    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: "Center not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

// DELETE /api/child-development-centers/[id]
export async function DELETE(request, { params }) {
  let connection;
  try {
    const { id } = params;
    connection = await mysql.createConnection(dbConfig);
    // Start transaction
    await connection.beginTransaction();
    try {
      // Soft delete contents first
      await connection.execute(
        "UPDATE child_development_centers_contents SET deleted_at = NOW() WHERE child_center_id = ? AND deleted_at IS NULL",
        [parseInt(id)]
      );
      // Soft delete center
      const [result] = await connection.execute(
        "UPDATE child_development_centers SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL",
        [parseInt(id)]
      );
      if (result.affectedRows === 0) {
        await connection.rollback();
        return NextResponse.json({ success: false, error: "Center not found" }, { status: 404 });
      }
      await connection.commit();
      return NextResponse.json({ success: true, message: "Center deleted successfully" });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
