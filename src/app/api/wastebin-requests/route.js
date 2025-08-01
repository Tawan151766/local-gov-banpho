import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Database connection
const dbConfig = {
  host: '103.80.48.25',
  port: 3306,
  user: 'gmsky_banphokorat',
  password: 'banphokorat56789',
  database: 'gmsky_banphokorat'
};

// GET /api/wastebin-requests - ดึงรายการคำร้องขอรับถังขยะ
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
      whereClause += ' AND (requester_name LIKE ? OR requester_village LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    // Get wastebin requests
    const [requests] = await connection.execute(
      `SELECT * FROM wastebin_requests ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Get total count
    const [countResult] = await connection.execute(
      `SELECT COUNT(*) as total FROM wastebin_requests ${whereClause}`,
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
    console.error('Error fetching wastebin requests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wastebin requests', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// POST /api/wastebin-requests - สร้างคำร้องขอรับถังขยะใหม่
export async function POST(request) {
  let connection;
  
  try {
    const body = await request.json();
    const {
      request_date,
      requester_title,
      requester_name,
      requester_age,
      requester_house_number,
      requester_street,
      requester_village,
      requester_subdistrict = 'ตำบลบ้านโพธิ์',
      requester_district = 'อำเภอบ้านโพธิ์',
      requester_province = 'จังหวัดฉะเชิงเทรา',
      bin_quantity,
      delivery_house_number,
      delivery_village,
      house_registration_doc,
      id_card_doc,
      document_1,
      document_2,
      document_3,
      captcha_answer,
      ip_address,
      user_agent
    } = body;

    // Validation
    if (!requester_title || !requester_name || !requester_age || !requester_house_number || !requester_village || !bin_quantity || !delivery_house_number || !delivery_village) {
      return NextResponse.json(
        { success: false, error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Insert wastebin request
    const [result] = await connection.execute(
      `INSERT INTO wastebin_requests (
        request_date, requester_title, requester_name, requester_age,
        requester_house_number, requester_street, requester_village,
        requester_subdistrict, requester_district, requester_province,
        bin_quantity, delivery_house_number, delivery_village,
        house_registration_doc, id_card_doc, document_1, document_2, document_3,
        captcha_answer, ip_address, user_agent, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        request_date || new Date().toISOString().split('T')[0],
        requester_title,
        requester_name,
        requester_age,
        requester_house_number,
        requester_street,
        requester_village,
        requester_subdistrict,
        requester_district,
        requester_province,
        bin_quantity,
        delivery_house_number,
        delivery_village,
        house_registration_doc,
        id_card_doc,
        document_1,
        document_2,
        document_3,
        captcha_answer,
        ip_address,
        user_agent
      ]
    );

    // Get the created request
    const [createdRequest] = await connection.execute(
      'SELECT * FROM wastebin_requests WHERE id = ?',
      [result.insertId]
    );

    return NextResponse.json({
      success: true,
      data: createdRequest[0],
      message: 'Wastebin request submitted successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating wastebin request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create wastebin request', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}