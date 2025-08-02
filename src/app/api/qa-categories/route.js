import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Database connection
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// GET - ดึงรายการหมวดหมู่
export async function GET(request) {
  let connection;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 50;
    const search = searchParams.get("search") || "";
    const withItems = searchParams.get("withItems") === "true";
    const activeOnly = searchParams.get("activeOnly") !== "false"; // default true

    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    // Build WHERE clause
    let whereClause = "";
    const params = [];

    if (activeOnly) {
      whereClause += "WHERE c.is_active = TRUE";
    }

    if (search) {
      whereClause +=
        (whereClause ? " AND" : "WHERE") + " c.category_name LIKE ?";
      params.push(`%${search}%`);
    }

    // Get categories
    const [categories] = await connection.execute(
      `
      SELECT 
        c.*,
        ${withItems ? "COUNT(qi.id) as items_count" : "0 as items_count"}
      FROM qa_categories c
      ${
        withItems
          ? "LEFT JOIN qa_items qi ON c.id = qi.category_id AND qi.is_active = TRUE"
          : ""
      }
      ${whereClause}
      ${withItems ? "GROUP BY c.id" : ""}
      ORDER BY c.display_order ASC, c.category_name ASC
      LIMIT ? OFFSET ?
    `,
      [...params, limit, offset]
    );

    // Get total count
    const [countResult] = await connection.execute(
      `
      SELECT COUNT(*) as total
      FROM qa_categories c
      ${whereClause}
    `,
      params
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: categories,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Get Q&A categories error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get Q&A categories",
        details: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// POST - สร้างหมวดหมู่ใหม่
export async function POST(request) {
  let connection;

  try {
    const body = await request.json();
    const { category_name, category_description, display_order, is_active } =
      body;

    if (!category_name?.trim()) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    const [result] = await connection.execute(
      `
      INSERT INTO qa_categories 
      (category_name, category_description, display_order, is_active) 
      VALUES (?, ?, ?, ?)
    `,
      [
        category_name.trim(),
        category_description || null,
        display_order || 0,
        is_active !== false,
      ]
    );

    return NextResponse.json({
      success: true,
      data: {
        id: result.insertId,
        category_name: category_name.trim(),
        category_description,
        display_order: display_order || 0,
        is_active: is_active !== false,
      },
      message: "Category created successfully",
    });
  } catch (error) {
    console.error("Create Q&A category error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create Q&A category",
        details: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
