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
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam) : null; // ถ้าไม่มี limit จะเป็น null
    const search = url.searchParams.get("search") || "";
    const fileSearch = url.searchParams.get("fileSearch") || "";
    const searchType = url.searchParams.get("searchType") || "content";
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");
    const sortBy = url.searchParams.get("sortBy") || "created_at";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";
    const postType = url.searchParams.get("type");

    connection = await mysql.createConnection(dbConfig);

    // Build WHERE clause
    let whereClause = "";
    let joinClause = "";
    const params = [];

    if (postType) {
      whereClause += "WHERE pt.type_name = ?";
      params.push(postType);
    }

    // Handle different search types
    if (searchType === "files" && fileSearch) {
      // Search in PDF files
      joinClause += " INNER JOIN post_pdfs ppdf ON pd.id = ppdf.post_detail_id";
      whereClause +=
        (whereClause ? " AND" : "WHERE") + " ppdf.post_pdf_file LIKE ?";
      params.push(`%${fileSearch}%`);
    } else if (searchType === "content" && search) {
      // Search in content
      whereClause +=
        (whereClause ? " AND" : "WHERE") +
        " (pd.title_name LIKE ? OR pd.topic_name LIKE ? OR pd.details LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Date range filter
    if (startDate && endDate) {
      whereClause +=
        (whereClause ? " AND" : "WHERE") + " pd.date BETWEEN ? AND ?";
      params.push(startDate, endDate);
    }

    // Build ORDER BY clause
    let orderByClause = "";
    const validSortFields = ["created_at", "date", "title_name", "topic_name"];
    const validSortOrders = ["asc", "desc"];

    if (
      validSortFields.includes(sortBy) &&
      validSortOrders.includes(sortOrder.toLowerCase())
    ) {
      orderByClause = `ORDER BY pd.${sortBy} ${sortOrder.toUpperCase()}`;
    } else {
      orderByClause = "ORDER BY pd.date DESC, pd.created_at DESC";
    }

    // Build LIMIT clause
    let limitClause = "";
    const queryParams = [...params];

    if (limit !== null) {
      const offset = (page - 1) * limit;
      limitClause = "LIMIT ? OFFSET ?";
      queryParams.push(limit, offset);
    }

    // Get posts with file counts and matched files for file search
    let selectClause = `
      SELECT DISTINCT
        pd.*,
        pt.type_name,
        (SELECT COUNT(*) FROM post_photos WHERE post_detail_id = pd.id) as photos_count,
        (SELECT JSON_ARRAYAGG(JSON_OBJECT('post_photo_file', post_photo_file)) FROM post_photos WHERE post_detail_id = pd.id) as photos,
        (SELECT COUNT(*) FROM post_videos WHERE post_detail_id = pd.id) as videos_count,
        (SELECT COUNT(*) FROM post_pdfs WHERE post_detail_id = pd.id) as pdfs_count
    `;

    // Add matched files for file search
    if (searchType === "files" && fileSearch) {
      selectClause += `,
        (SELECT JSON_ARRAYAGG(post_pdf_file) 
         FROM post_pdfs 
         WHERE post_detail_id = pd.id 
         AND post_pdf_file LIKE ?) as matched_files
      `;
      queryParams.unshift(`%${fileSearch}%`); // Add at beginning for the subquery
    }

    const [items] = await connection.execute(
      `
      ${selectClause}
      FROM post_details pd
      LEFT JOIN post_types pt ON pd.post_type_id = pt.id
      ${joinClause}
      ${whereClause}
      ${orderByClause}
      ${limitClause}
      `,
      queryParams
    );

    // Get total count
    const [countResult] = await connection.execute(
      `
      SELECT COUNT(DISTINCT pd.id) as total
      FROM post_details pd
      LEFT JOIN post_types pt ON pd.post_type_id = pt.id
      ${joinClause}
      ${whereClause}
      `,
      params
    );

    const total = countResult[0].total;

    // Process matched_files JSON for file search results
    const processedItems = items.map((item) => {
      if (item.matched_files && typeof item.matched_files === "string") {
        try {
          item.matched_files = JSON.parse(item.matched_files);
        } catch (e) {
          item.matched_files = [];
        }
      }
      if (item.photos && typeof item.photos === "string") {
        try {
          item.photos = JSON.parse(item.photos);
        } catch (e) {
          item.photos = [];
        }
      }
      return item;
    });

    // Pagination info (only if limit is specified)
    let pagination = null;
    if (limit !== null) {
      const totalPages = Math.ceil(total / limit);
      pagination = {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      };
    }

    return NextResponse.json({
      success: true,
      data: processedItems,
      total: total, // เพิ่มจำนวนทั้งหมดไว้ด้วย
      pagination: pagination, // จะเป็น null ถ้าไม่มี limit
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
