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

// GET /api/laws-regs-files/[id] - ดึงข้อมูล laws regs file เดียว
export async function GET(request, { params }) {
  let connection;

  try {
    const { id } = params;

    connection = await mysql.createConnection(dbConfig);

    // Get laws regs file with section and type info
    const [files] = await connection.execute(
      `SELECT lrf.*, lrs.section_name, lrt.type_name 
       FROM laws_regs_files lrf 
       LEFT JOIN laws_regs_sections lrs ON lrf.section_id = lrs.id 
       LEFT JOIN laws_regs_types lrt ON lrs.type_id = lrt.id 
       WHERE lrf.id = ?`,
      [parseInt(id)]
    );

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: "Laws regs file not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: files[0],
    });
  } catch (error) {
    console.error("Error fetching laws regs file:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch laws regs file",
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

// PUT /api/laws-regs-files/[id] - อัปเดต laws regs file
export async function PUT(request, { params }) {
  let connection;

  try {
    const { id } = params;
    const body = await request.json();
    const { files_path, files_type } = body;

    // Validation
    if (!files_path || !files_type) {
      return NextResponse.json(
        { success: false, error: "File path and file type are required" },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Update laws regs file
    const [result] = await connection.execute(
      "UPDATE laws_regs_files SET files_path = ?, files_type = ?, updated_at = NOW() WHERE id = ?",
      [files_path, files_type, parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Laws regs file not found" },
        { status: 404 }
      );
    }

    // Get updated file
    const [updatedFile] = await connection.execute(
      `SELECT lrf.*, lrs.section_name, lrt.type_name 
       FROM laws_regs_files lrf 
       LEFT JOIN laws_regs_sections lrs ON lrf.section_id = lrs.id 
       LEFT JOIN laws_regs_types lrt ON lrs.type_id = lrt.id 
       WHERE lrf.id = ?`,
      [parseInt(id)]
    );

    return NextResponse.json({
      success: true,
      data: updatedFile[0],
      message: "Laws regs file updated successfully",
    });
  } catch (error) {
    console.error("Error updating laws regs file:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update laws regs file",
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

// DELETE /api/laws-regs-files/[id] - ลบ laws regs file
export async function DELETE(request, { params }) {
  let connection;

  try {
    const { id } = params;

    connection = await mysql.createConnection(dbConfig);

    // Delete laws regs file
    const [result] = await connection.execute(
      "DELETE FROM laws_regs_files WHERE id = ?",
      [parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Laws regs file not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Laws regs file deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting laws regs file:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete laws regs file",
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
