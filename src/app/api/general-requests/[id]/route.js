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

// GET /api/general-requests/[id] - ดึงข้อมูลคำร้องเดียว
export async function GET(_, { params }) {
  let connection;

  try {
    const { id } = params;

    connection = await mysql.createConnection(dbConfig);

    const [requests] = await connection.execute(
      "SELECT * FROM general_requests WHERE id = ?",
      [parseInt(id)]
    );

    if (requests.length === 0) {
      return NextResponse.json(
        { success: false, error: "General request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: requests[0],
    });
  } catch (error) {
    console.error("Error fetching general request:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch general request",
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

// PUT /api/general-requests/[id] - อัปเดตสถานะคำร้อง
export async function PUT(request, { params }) {
  let connection;

  try {
    const { id } = params;
    const body = await request.json();
    const { status, status_note } = body;

    // Validation
    if (!status) {
      return NextResponse.json(
        { success: false, error: "Status is required" },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "processing", "completed", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Update request status
    const [result] = await connection.execute(
      "UPDATE general_requests SET status = ?, status_note = ?, updated_at = NOW() WHERE id = ?",
      [status, status_note || null, parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "General request not found" },
        { status: 404 }
      );
    }

    // Get updated request
    const [updatedRequest] = await connection.execute(
      "SELECT * FROM general_requests WHERE id = ?",
      [parseInt(id)]
    );

    return NextResponse.json({
      success: true,
      data: updatedRequest[0],
      message: "General request updated successfully",
    });
  } catch (error) {
    console.error("Error updating general request:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update general request",
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

// DELETE /api/general-requests/[id] - ลบคำร้อง
export async function DELETE(_, { params }) {
  let connection;

  try {
    const { id } = params;

    connection = await mysql.createConnection(dbConfig);

    // Delete request
    const [result] = await connection.execute(
      "DELETE FROM general_requests WHERE id = ?",
      [parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "General request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "General request deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting general request:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete general request",
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
