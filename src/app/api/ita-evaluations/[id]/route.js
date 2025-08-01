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

// GET /api/ita-evaluations/[id] - ดึงข้อมูล evaluation เดียว
export async function GET(request, { params }) {
  let connection;

  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const withContents = searchParams.get("withContents") === "true";

    connection = await mysql.createConnection(dbConfig);

    // Get evaluation
    const [evaluations] = await connection.execute(
      "SELECT * FROM ita_evaluations WHERE id = ? AND deleted_at IS NULL",
      [parseInt(id)]
    );

    if (evaluations.length === 0) {
      return NextResponse.json(
        { success: false, error: "Evaluation not found" },
        { status: 404 }
      );
    }

    let evaluation = evaluations[0];

    // If withContents is true, get contents
    if (withContents) {
      const [contents] = await connection.execute(
        "SELECT * FROM ita_contents WHERE evaluation_id = ? AND deleted_at IS NULL ORDER BY created_at ASC",
        [parseInt(id)]
      );
      evaluation.contents = contents;
    }

    return NextResponse.json({
      success: true,
      data: evaluation,
    });
  } catch (error) {
    console.error("Error fetching evaluation:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch evaluation",
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

// PUT /api/ita-evaluations/[id] - อัปเดต evaluation
export async function PUT(request, { params }) {
  let connection;

  try {
    const { id } = params;
    const body = await request.json();
    const { name, description, ita_date } = body;

    // Validation
    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Update evaluation
    const [result] = await connection.execute(
      "UPDATE ita_evaluations SET name = ?, description = ?, ita_date = ?, updated_at = NOW() WHERE id = ? AND deleted_at IS NULL",
      [name, description || null, ita_date || null, parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Evaluation not found" },
        { status: 404 }
      );
    }

    // Get updated evaluation
    const [updatedEvaluation] = await connection.execute(
      "SELECT * FROM ita_evaluations WHERE id = ? AND deleted_at IS NULL",
      [parseInt(id)]
    );

    return NextResponse.json({
      success: true,
      data: updatedEvaluation[0],
      message: "Evaluation updated successfully",
    });
  } catch (error) {
    console.error("Error updating evaluation:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update evaluation",
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

// DELETE /api/ita-evaluations/[id] - ลบ evaluation (soft delete)
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
        "UPDATE ita_contents SET deleted_at = NOW() WHERE evaluation_id = ? AND deleted_at IS NULL",
        [parseInt(id)]
      );

      // Soft delete evaluation
      const [result] = await connection.execute(
        "UPDATE ita_evaluations SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL",
        [parseInt(id)]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        return NextResponse.json(
          { success: false, error: "Evaluation not found" },
          { status: 404 }
        );
      }

      // Commit transaction
      await connection.commit();

      return NextResponse.json({
        success: true,
        message: "Evaluation deleted successfully",
      });
    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error deleting evaluation:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete evaluation",
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
