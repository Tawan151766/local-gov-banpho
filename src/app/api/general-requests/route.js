import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Database connection
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// GET /api/general-requests - ดึงรายการคำร้องทั่วไป
export async function GET(request) {
  let connection;
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');

    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    // Build WHERE clause
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (requester_name LIKE ? OR request_subject LIKE ? OR requester_id_card = ?)';
      params.push(`%${search}%`, `%${search}%`, search);
    }

    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    // Get general requests
    const [requests] = await connection.execute(
      `SELECT * FROM general_requests ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Get total count
    const [countResult] = await connection.execute(
      `SELECT COUNT(*) as total FROM general_requests ${whereClause}`,
      params
    );

    const total = countResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: requests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching general requests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch general requests', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// POST /api/general-requests - สร้างคำร้องทั่วไปใหม่
export async function POST(request) {
  let connection;
  
  try {
    const body = await request.json();
    const {
      request_date,
      requester_title,
      requester_name,
      requester_id_card,
      requester_age,
      requester_nationality = 'ไทย',
      requester_house_number,
      requester_village,
      requester_subdistrict,
      requester_district,
      requester_province,
      requester_postal_code,
      requester_phone,
      request_subject,
      request_details,
      document_1,
      document_2,
      document_3,
      other_document_1,
      other_document_2,
      captcha_answer,
      ip_address,
      user_agent
    } = body;

    // Validation
    if (!requester_title || !requester_name || !requester_age || !request_subject || !request_details) {
      return NextResponse.json(
        { success: false, error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Insert general request
    const [result] = await connection.execute(
      `INSERT INTO general_requests (
        request_date, requester_title, requester_name, requester_id_card, requester_age, requester_nationality,
        requester_house_number, requester_village, requester_subdistrict, requester_district,
        requester_province, requester_postal_code, requester_phone, request_subject, request_details,
        document_1, document_2, document_3, other_document_1, other_document_2,
        captcha_answer, ip_address, user_agent, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        request_date || new Date().toISOString().split('T')[0],
        requester_title,
        requester_name,
        requester_id_card,
        requester_age,
        requester_nationality,
        requester_house_number,
        requester_village,
        requester_subdistrict,
        requester_district,
        requester_province,
        requester_postal_code,
        requester_phone,
        request_subject,
        request_details,
        document_1,
        document_2,
        document_3,
        other_document_1,
        other_document_2,
        captcha_answer,
        ip_address,
        user_agent
      ]
    );

    // Get the created request
    const [createdRequest] = await connection.execute(
      'SELECT * FROM general_requests WHERE id = ?',
      [result.insertId]
    );

    return NextResponse.json({
      success: true,
      data: createdRequest[0],
      message: 'General request submitted successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating general request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create general request', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// PATCH /api/general-requests - อัปเดตสถานะคำร้องทั่วไป
export async function PATCH(request) {
  let connection;

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "ID and status are required" },
        { status: 400 }
      );
    }

    // Validate status
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
      "UPDATE general_requests SET status = ?, updated_at = NOW() WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Request not found" },
        { status: 404 }
      );
    }

    // Get updated request
    const [updatedRequest] = await connection.execute(
      "SELECT * FROM general_requests WHERE id = ?",
      [id]
    );

    return NextResponse.json({
      success: true,
      data: updatedRequest[0],
      message: "Request status updated successfully",
    });
  } catch (error) {
    console.error("Error updating general request status:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update request status",
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