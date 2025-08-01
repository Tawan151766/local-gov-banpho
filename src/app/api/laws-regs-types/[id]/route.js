import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Database connection
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// GET /api/laws-regs-types/[id] - ดึงข้อมูล laws regs type เดียว
export async function GET(request, { params }) {
  let connection;

  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const withSections = searchParams.get("withSections") === "true";

    connection = await mysql.createConnection(dbConfig);

    // Get laws regs type
    const [types] = await connection.execute(
      "SELECT * FROM laws_regs_types WHERE id = ?",
      [parseInt(id)]
    );

    if (types.length === 0) {
      return NextResponse.json(
        { success: false, error: "Laws regs type not found" },
        { status: 404 }
      );
    }

    let type = types[0];

    // If withSections is true, get sections
    if (withSections) {
      const [sections] = await connection.execute(
        "SELECT * FROM laws_regs_sections WHERE type_id = ? ORDER BY created_at ASC",
        [parseInt(id)]
      );
      type.sections = sections;
    }

    return NextResponse.json({
      success: true,
      data: type,
    });
  } catch (error) {
    console.error("Error fetching laws regs type:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch laws regs type",
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

// PUT /api/laws-regs-types/[id] - อัปเดต laws regs type
export async function PUT(request, { params }) {
  let connection;

  try {
    const { id } = params;
    const body = await request.json();
    const { type_name } = body;

    // Validation
    if (!type_name) {
      return NextResponse.json(
        { success: false, error: "Type name is required" },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Check if type name already exists (excluding current record)
    const [existingType] = await connection.execute(
      "SELECT id FROM laws_regs_types WHERE type_name = ? AND id != ?",
      [type_name, parseInt(id)]
    );

    if (existingType.length > 0) {
      return NextResponse.json(
        { success: false, error: "Type name already exists" },
        { status: 409 }
      );
    }

    // Update laws regs type
    const [result] = await connection.execute(
      "UPDATE laws_regs_types SET type_name = ?, updated_at = NOW() WHERE id = ?",
      [type_name, parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Laws regs type not found" },
        { status: 404 }
      );
    }

    // Get updated type
    const [updatedType] = await connection.execute(
      "SELECT * FROM laws_regs_types WHERE id = ?",
      [parseInt(id)]
    );

    return NextResponse.json({
      success: true,
      data: updatedType[0],
      message: "Laws regs type updated successfully",
    });
  } catch (error) {
    console.error("Error updating laws regs type:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update laws regs type",
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

// DELETE /api/laws-regs-types/[id] - ลบ laws regs type
export async function DELETE(request, { params }) {
  let connection;

  try {
    const { id } = params;

    connection = await mysql.createConnection(dbConfig);

    // Start transaction
    await connection.beginTransaction();

    try {
      // Delete files first (CASCADE will handle this, but we do it explicitly)
      await connection.execute(
        `DELETE lrf FROM laws_regs_files lrf 
         INNER JOIN laws_regs_sections lrs ON lrf.section_id = lrs.id 
         WHERE lrs.type_id = ?`,
        [parseInt(id)]
      );

      // Delete sections
      await connection.execute(
        "DELETE FROM laws_regs_sections WHERE type_id = ?",
        [parseInt(id)]
      );

      // Delete laws regs type
      const [result] = await connection.execute(
        "DELETE FROM laws_regs_types WHERE id = ?",
        [parseInt(id)]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        return NextResponse.json(
          { success: false, error: "Laws regs type not found" },
          { status: 404 }
        );
      }

      // Commit transaction
      await connection.commit();

      return NextResponse.json({
        success: true,
        message: "Laws regs type deleted successfully",
      });
    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error deleting laws regs type:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete laws regs type",
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
