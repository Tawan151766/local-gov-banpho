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

// GET /api/water-support-requests - ดึงรายการคำร้องขอสนับสนุนน้ำ
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
      whereClause += ' AND (requester_name LIKE ? OR water_needs LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    // Get water support requests
    const [requests] = await connection.execute(
      `SELECT * FROM water_support_requests ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Get total count
    const [countResult] = await connection.execute(
      `SELECT COUNT(*) as total FROM water_support_requests ${whereClause}`,
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
    console.error('Error fetching water support requests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch water support requests', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// POST /api/water-support-requests - สร้างคำร้องขอสนับสนุนน้ำใหม่
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
      requester_village,
      requester_subdistrict = 'ตำบลบ้านโพธิ์',
      requester_district = 'อำเภอบ้านโพธิ์',
      requester_province = 'จังหวัดฉะเชิงเทรา',
      requester_phone,
      family_members,
      water_needs,
      symptoms_description,
      captcha_answer,
      ip_address,
      user_agent
    } = body;

    // Validation
    if (!requester_title || !requester_name || !requester_house_number || !requester_village || !water_needs || !symptoms_description) {
      return NextResponse.json(
        { success: false, error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Insert water support request
    const [result] = await connection.execute(
      `INSERT INTO water_support_requests (
        request_date, requester_title, requester_name, requester_age,
        requester_house_number, requester_village, requester_subdistrict,
        requester_district, requester_province, requester_phone, family_members,
        water_needs, symptoms_description, captcha_answer, ip_address, user_agent,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        request_date || new Date().toISOString().split('T')[0],
        requester_title,
        requester_name,
        requester_age,
        requester_house_number,
        requester_village,
        requester_subdistrict,
        requester_district,
        requester_province,
        requester_phone,
        family_members,
        water_needs,
        symptoms_description,
        captcha_answer,
        ip_address,
        user_agent
      ]
    );

    // Get the created request
    const [createdRequest] = await connection.execute(
      'SELECT * FROM water_support_requests WHERE id = ?',
      [result.insertId]
    );

    return NextResponse.json({
      success: true,
      data: createdRequest[0],
      message: 'Water support request submitted successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating water support request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create water support request', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}