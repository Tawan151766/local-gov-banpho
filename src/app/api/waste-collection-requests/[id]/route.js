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

// GET /api/waste-collection-requests/[id] - ดึงข้อมูลคำร้องเดียว
export async function GET(_, { params }) {
  let connection;

  try {
    const { id } = params;

    connection = await mysql.createConnection(dbConfig);

    const [requests] = await connection.execute(
      "SELECT * FROM waste_collection_requests WHERE id = ?",
      [parseInt(id)]
    );

    if (requests.length === 0) {
      return NextResponse.json(
        { success: false, error: "Waste collection request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: requests[0],
    });
  } catch (error) {
    console.error("Error fetching waste collection request:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch waste collection request",
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

// PUT /api/waste-collection-requests/[id] - อัปเดตสถานะคำร้อง
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
      "UPDATE waste_collection_requests SET status = ?, status_note = ?, updated_at = NOW() WHERE id = ?",
      [status, status_note || null, parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Waste collection request not found" },
        { status: 404 }
      );
    }

    // Get updated request
    const [updatedRequest] = await connection.execute(
      "SELECT * FROM waste_collection_requests WHERE id = ?",
      [parseInt(id)]
    );

    return NextResponse.json({
      success: true,
      data: updatedRequest[0],
      message: "Waste collection request updated successfully",
    });
  } catch (error) {
    console.error("Error updating waste collection request:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update waste collection request",
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

// DELETE /api/waste-collection-requests/[id] - ลบคำร้อง
export async function DELETE(_, { params }) {
  let connection;

  try {
    const { id } = params;

    connection = await mysql.createConnection(dbConfig);

    // Delete request
    const [result] = await connection.execute(
      "DELETE FROM waste_collection_requests WHERE id = ?",
      [parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Waste collection request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Waste collection request deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting waste collection request:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete waste collection request",
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