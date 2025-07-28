import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Database connection
const dbConfig = {
  host: "103.80.48.25",
  port: 3306,
  user: "gmsky_banphokorat",
  password: "banphokorat56789",
  database: "gmsky_banphokorat",
};

// GET /api/perf-results-types - ดึงรายการประเภทผลการดำเนินงานทั้งหมด
export async function GET(request) {
  let connection;

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const withSections = searchParams.get("withSections") === "true";

    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    // Build WHERE clause
    let whereClause = "WHERE 1=1";
    const params = [];

    if (search) {
      whereClause += " AND type_name LIKE ?";
      params.push(`%${search}%`);
    }

    // Get performance results types
    const [types] = await connection.execute(
      `SELECT * FROM perf_results_types ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Get total count
    const [countResult] = await connection.execute(
      `SELECT COUNT(*) as total FROM perf_results_types ${whereClause}`,
      params
    );

    const total = countResult[0]?.total || 0;

    // If withSections is true, get sections for each type
    let typesWithSections = types;
    if (withSections && types.length > 0) {
      const typeIds = types.map((type) => type.id);
      const placeholders = typeIds.map(() => "?").join(",");

      const [sections] = await connection.execute(
        `SELECT * FROM perf_results_sections WHERE type_id IN (${placeholders}) ORDER BY created_at ASC`,
        typeIds
      );

      // Group sections by type_id
      const sectionsByType = sections.reduce((acc, section) => {
        if (!acc[section.type_id]) {
          acc[section.type_id] = [];
        }
        acc[section.type_id].push(section);
        return acc;
      }, {});

      // Add sections to each type
      typesWithSections = types.map((type) => ({
        ...type,
        sections: sectionsByType[type.id] || [],
      }));
    }

    return NextResponse.json({
      success: true,
      data: typesWithSections,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching performance results types:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch performance results types",
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

// POST /api/perf-results-types - สร้างประเภทผลการดำเนินงานใหม่
export async function POST(request) {
  let connection;

  try {
    const body = await request.json();
    const { type_name, sections = [] } = body;

    console.log("Received performance results type data:", {
      type_name,
      sections,
    });

    // Check if tables exist
    try {
      await connection.execute("SELECT 1 FROM perf_results_types LIMIT 1");
    } catch (tableError) {
      return NextResponse.json(
        {
          success: false,
          error: "Tables not found. Please run migration first.",
        },
        { status: 500 }
      );
    }

    // Validation
    if (!type_name) {
      return NextResponse.json(
        { success: false, error: "Type name is required" },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Start transaction
    await connection.beginTransaction();

    try {
      // Insert performance results type
      const [result] = await connection.execute(
        "INSERT INTO perf_results_types (type_name, created_at, updated_at) VALUES (?, NOW(), NOW())",
        [type_name]
      );

      const typeId = result.insertId;

      // Insert sections if provided
      if (sections && sections.length > 0) {
        for (const section of sections) {
          if (section.section_name) {
            await connection.execute(
              "INSERT INTO perf_results_sections (type_id, section_name, date, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
              [typeId, section.section_name, section.date || null]
            );
          }
        }
      }

      // Commit transaction
      await connection.commit();

      // Get the created type with sections
      const [createdType] = await connection.execute(
        "SELECT * FROM perf_results_types WHERE id = ?",
        [typeId]
      );

      const [createdSections] = await connection.execute(
        "SELECT * FROM perf_results_sections WHERE type_id = ?",
        [typeId]
      );

      const typeWithSections = {
        ...createdType[0],
        sections: createdSections,
      };

      return NextResponse.json(
        {
          success: true,
          data: typeWithSections,
          message: "Performance results type created successfully",
        },
        { status: 201 }
      );
    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error creating performance results type:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create performance results type",
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
