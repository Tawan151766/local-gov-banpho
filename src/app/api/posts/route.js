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

// GET - ดึงรายการโพสต์
export async function GET(request) {
  let connection;

  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit"));
    const search = url.searchParams.get("search") || "";
    const postType = url.searchParams.get("type");

    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    // Build WHERE clause
    let whereClause = "";
    const params = [];

    if (postType) {
      whereClause += "WHERE pt.type_name = ?";
      params.push(postType);
    }

    if (search) {
      whereClause +=
        (whereClause ? " AND" : "WHERE") +
        " (pd.title_name LIKE ? OR pd.topic_name LIKE ? OR pd.details LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Get posts with file counts
    const [items] = await connection.execute(
      `
      SELECT 
        pd.*,
        pt.type_name,
        (SELECT COUNT(*) FROM post_photos WHERE post_detail_id = pd.id) as photos_count,
        (SELECT COUNT(*) FROM post_videos WHERE post_detail_id = pd.id) as videos_count,
        (SELECT COUNT(*) FROM post_pdfs WHERE post_detail_id = pd.id) as pdfs_count
      FROM post_details pd
      LEFT JOIN post_types pt ON pd.post_type_id = pt.id
      ${whereClause}
      ORDER BY pd.date DESC, pd.created_at DESC
      LIMIT ? OFFSET ?
    `,
      [...params, limit, offset]
    );

    // Get total count
    const [countResult] = await connection.execute(
      `
      SELECT COUNT(*) as total
      FROM post_details pd
      LEFT JOIN post_types pt ON pd.post_type_id = pt.id
      ${whereClause}
    `,
      params
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get posts error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get posts",
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

// POST - สร้างโพสต์ใหม่
export async function POST(request) {
  let connection;

  try {
    const body = await request.json();
    const { title_name, topic_name, details, post_type, date, file_path } =
      body;

    if (!title_name?.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    if (!post_type?.trim()) {
      return NextResponse.json(
        { success: false, error: "Post type is required" },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);
    await connection.beginTransaction();

    try {
      // Get or create post_type
      let [postTypes] = await connection.execute(
        "SELECT id FROM post_types WHERE type_name = ?",
        [post_type.trim()]
      );

      let postTypeId;
      if (postTypes.length === 0) {
        // Create new post type
        const [typeResult] = await connection.execute(
          "INSERT INTO post_types (type_name) VALUES (?)",
          [post_type.trim()]
        );
        postTypeId = typeResult.insertId;
      } else {
        postTypeId = postTypes[0].id;
      }

      // Insert post detail
      const [result] = await connection.execute(
        `
        INSERT INTO post_details (
          post_type_id,
          date,
          title_name,
          topic_name,
          details
        ) VALUES (?, ?, ?, ?, ?)
      `,
        [
          postTypeId,
          date || new Date().toISOString().split("T")[0],
          title_name.trim(),
          topic_name || null,
          details || null,
        ]
      );

      const postDetailId = result.insertId;

      // Add PDF file if provided
      if (file_path) {
        await connection.execute(
          `
          INSERT INTO post_pdfs (post_detail_id, post_pdf_file) VALUES (?, ?)
        `,
          [postDetailId, file_path]
        );
      }

      await connection.commit();

      // Get created post with type info
      const [newPost] = await connection.execute(
        `
        SELECT 
          pd.*,
          pt.type_name,
          (SELECT COUNT(*) FROM post_photos WHERE post_detail_id = pd.id) as photos_count,
          (SELECT COUNT(*) FROM post_videos WHERE post_detail_id = pd.id) as videos_count,
          (SELECT COUNT(*) FROM post_pdfs WHERE post_detail_id = pd.id) as pdfs_count
        FROM post_details pd
        LEFT JOIN post_types pt ON pd.post_type_id = pt.id
        WHERE pd.id = ?
      `,
        [postDetailId]
      );

      return NextResponse.json({
        success: true,
        data: newPost[0],
        message: "Post created successfully",
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create post",
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
