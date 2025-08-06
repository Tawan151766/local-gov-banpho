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

// GET /api/waste-collection-requests - ดึงรายการคำร้องขอรับบริการจัดเก็บขยะ
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
      whereClause += ' AND (requester_name LIKE ? OR collection_details LIKE ? OR requester_id_card = ?)';
      params.push(`%${search}%`, `%${search}%`, search);
    }

    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    // Get waste collection requests
    const [requests] = await connection.execute(
      `SELECT * FROM waste_collection_requests ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Get total count
    const [countResult] = await connection.execute(
      `SELECT COUNT(*) as total FROM waste_collection_requests ${whereClause}`,
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
    console.error('Error fetching waste collection requests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch waste collection requests', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// POST /api/waste-collection-requests - สร้างคำร้องขอรับบริการจัดเก็บขยะใหม่
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
      requester_house_number,
      requester_village,
      requester_subdistrict = 'ตำบลบ้านโพธิ์',
      requester_district = 'อำเภอบ้านโพธิ์',
      requester_province = 'จังหวัดฉะเชิงเทรา',
      requester_phone,
      waste_type_household = false,
      waste_type_rental = false,
      waste_type_shop = false,
      waste_type_factory = false,
      other_waste_type,
      collection_details,
      reason_for_request,
      captcha_answer,
      ip_address,
      user_agent
    } = body;

    // Validation
    if (!requester_title || !requester_name || !requester_age || !requester_house_number || !requester_village || !collection_details || !reason_for_request) {
      return NextResponse.json(
        { success: false, error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    // Check if at least one waste type is selected
    if (!waste_type_household && !waste_type_rental && !waste_type_shop && !waste_type_factory) {
      return NextResponse.json(
        { success: false, error: 'Please select at least one waste type' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Insert waste collection request
    const [result] = await connection.execute(
      `INSERT INTO waste_collection_requests (
        request_date, requester_title, requester_name, requester_id_card, requester_age,
        requester_house_number, requester_village, requester_subdistrict,
        requester_district, requester_province, requester_phone,
        waste_type_household, waste_type_rental, waste_type_shop, waste_type_factory,
        other_waste_type, collection_details, reason_for_request,
        captcha_answer, ip_address, user_agent, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        request_date || new Date().toISOString().split('T')[0],
        requester_title,
        requester_name,
        requester_id_card,
        requester_age,
        requester_house_number,
        requester_village,
        requester_subdistrict,
        requester_district,
        requester_province,
        requester_phone,
        waste_type_household,
        waste_type_rental,
        waste_type_shop,
        waste_type_factory,
        other_waste_type,
        collection_details,
        reason_for_request,
        captcha_answer,
        ip_address,
        user_agent
      ]
    );

    // Get the created request
    const [createdRequest] = await connection.execute(
      'SELECT * FROM waste_collection_requests WHERE id = ?',
      [result.insertId]
    );

    return NextResponse.json({
      success: true,
      data: createdRequest[0],
      message: 'Waste collection request submitted successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating waste collection request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create waste collection request', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// PATCH /api/waste-collection-requests - อัปเดตสถานะคำร้องขอรับบริการจัดเก็บขยะ
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
      "UPDATE waste_collection_requests SET status = ?, updated_at = NOW() WHERE id = ?",
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
      "SELECT * FROM waste_collection_requests WHERE id = ?",
      [id]
    );

    return NextResponse.json({
      success: true,
      data: updatedRequest[0],
      message: "Request status updated successfully",
    });
  } catch (error) {
    console.error("Error updating waste collection request status:", error);
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