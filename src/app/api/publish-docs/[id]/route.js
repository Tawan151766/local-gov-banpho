// GET /api/publish-docs/[id]
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};
export async function GET(request, { params }) {
  let connection;
  try {
    const { id } = params;
    connection = await mysql.createConnection(dbConfig);
    const [docs] = await connection.execute(
      "SELECT * FROM publish_docs WHERE id = ? AND deleted_at IS NULL",
      [parseInt(id)]
    );
    if (docs.length === 0) {
      return NextResponse.json(
        { success: false, error: "Document not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: docs[0] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
}

// PUT /api/publish-docs/[id]
export async function PUT(request, { params }) {
  let connection;
  try {
    const { id } = params;
    const body = await request.json();
    const { name, description, publish_date } = body;
    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }
    connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "UPDATE publish_docs SET name = ?, description = ?, publish_date = ?, updated_at = NOW() WHERE id = ? AND deleted_at IS NULL",
      [name, description || "", publish_date || null, parseInt(id)]
    );
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Document not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/publish-docs/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
}

// DELETE /api/publish-docs/[id]
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
        "UPDATE publish_docs_contents SET deleted_at = NOW() WHERE publish_doc_id = ? AND deleted_at IS NULL",
        [parseInt(id)]
      );
      // Soft delete document
      const [result] = await connection.execute(
        "UPDATE publish_docs SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL",
        [parseInt(id)]
      );
      if (result.affectedRows === 0) {
        await connection.rollback();
        return NextResponse.json(
          { success: false, error: "Document not found" },
          { status: 404 }
        );
      }
      await connection.commit();
      return NextResponse.json({
        success: true,
        message: "Document deleted successfully",
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
}
