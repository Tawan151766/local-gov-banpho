import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// GET /api/publish-docs
export async function GET(request) {
  let connection;
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const withContents = searchParams.get("withContents") === "true";
    const offset = (page - 1) * limit;
    connection = await mysql.createConnection(dbConfig);
    let whereClause = "WHERE deleted_at IS NULL";
    const params = [];
    if (search) {
      whereClause += " AND (name LIKE ? OR description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }
    const [docs] = await connection.execute(
      `SELECT * FROM publish_docs ${whereClause} ORDER BY publish_date DESC, created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    const [countResult] = await connection.execute(
      `SELECT COUNT(*) as total FROM publish_docs ${whereClause}`,
      params
    );
    const total = countResult[0]?.total || 0;
    let docsWithContents = docs;
    if (withContents && docs.length > 0) {
      const docIds = docs.map((doc) => doc.id);
      const placeholders = docIds.map(() => "?").join(",");
      const [contents] = await connection.execute(
        `SELECT * FROM publish_docs_contents WHERE publish_doc_id IN (${placeholders}) AND deleted_at IS NULL ORDER BY created_at ASC`,
        docIds
      );
      const contentsByDoc = contents.reduce((acc, content) => {
        if (!acc[content.publish_doc_id]) acc[content.publish_doc_id] = [];
        acc[content.publish_doc_id].push(content);
        return acc;
      }, {});
      docsWithContents = docs.map((doc) => ({
        ...doc,
        contents: contentsByDoc[doc.id] || [],
      }));
    }
    return NextResponse.json({
      success: true,
      data: docsWithContents,
      pagination: { page, pageSize: limit, total },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}

// POST /api/publish-docs
export async function POST(request) {
  let connection;
  try {
    const body = await request.json();
    const { name, description, publish_date } = body;
    if (!name) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }
    connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "INSERT INTO publish_docs (name, description, publish_date, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
      [name, description || "", publish_date || null]
    );
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}
