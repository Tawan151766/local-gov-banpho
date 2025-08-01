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

// POST /api/corruption-complaints - สร้างคำร้องเรียนใหม่
export async function POST(request) {
  let connection;
  
  try {
    const body = await request.json();
    const {
      day, month, year,
      complainantName, complainantIdCard, complainantAddress, complainantAge, complainantPhone,
      accusedName, accusedPosition, accusedAgency, accusedProvince,
      complaintDetails,
      attachments = []
    } = body;

    // Validate required fields
    if (!complainantName || !complainantIdCard || !complainantAddress || !complainantAge || !complainantPhone ||
        !accusedName || !accusedPosition || !accusedAgency || !accusedProvince || !complaintDetails) {
      return NextResponse.json(
        { success: false, error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // Convert Thai date to MySQL date format
    const thaiMonths = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    
    const monthIndex = thaiMonths.indexOf(month) + 1;
    const gregorianYear = parseInt(year) - 543; // Convert Buddhist year to Gregorian
    const complaintDate = `${gregorianYear}-${monthIndex.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    // Get client IP and user agent
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    connection = await mysql.createConnection(dbConfig);

    // Start transaction
    await connection.beginTransaction();

    try {
      // Insert complaint
      const [result] = await connection.execute(`
        INSERT INTO corruption_complaints (
          complaint_date,
          complainant_name,
          complainant_id_card,
          complainant_address,
          complainant_age,
          complainant_phone,
          accused_name,
          accused_position,
          accused_agency,
          accused_province,
          complaint_details,
          attachments,
          status,
          ip_address,
          user_agent
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
      `, [
        complaintDate,
        complainantName,
        complainantIdCard,
        complainantAddress,
        parseInt(complainantAge),
        complainantPhone,
        accusedName,
        accusedPosition,
        accusedAgency,
        accusedProvince,
        complaintDetails,
        JSON.stringify(attachments),
        ip,
        userAgent
      ]);

      const complaintId = result.insertId;

      // Commit transaction
      await connection.commit();

      return NextResponse.json({
        success: true,
        message: 'ส่งคำร้องเรียนเรียบร้อยแล้ว',
        data: {
          complaintId,
          referenceNumber: `CC${complaintId.toString().padStart(6, '0')}`,
          status: 'pending'
        }
      }, { status: 201 });

    } catch (error) {
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Error creating corruption complaint:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการส่งคำร้องเรียน', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// GET /api/corruption-complaints - ดึงรายการคำร้องเรียน (สำหรับ admin)
export async function GET(request) {
  let connection;
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    // Build WHERE clause
    let whereClause = 'WHERE 1=1';
    let queryParams = [];

    if (status && status !== 'all') {
      whereClause += ' AND status = ?';
      queryParams.push(status);
    }

    if (search) {
      whereClause += ' AND (complainant_name LIKE ? OR accused_name LIKE ? OR accused_agency LIKE ?)';
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    // Get total count
    const [countResult] = await connection.execute(`
      SELECT COUNT(*) as total FROM corruption_complaints ${whereClause}
    `, queryParams);

    const total = countResult[0].total;

    // Get complaints with pagination
    const [complaints] = await connection.execute(`
      SELECT 
        id,
        complaint_date,
        complainant_name,
        complainant_phone,
        accused_name,
        accused_position,
        accused_agency,
        accused_province,
        LEFT(complaint_details, 100) as complaint_summary,
        status,
        created_at,
        updated_at
      FROM corruption_complaints 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [...queryParams, limit, offset]);

    // Get status summary
    const [statusSummary] = await connection.execute(`
      SELECT status, COUNT(*) as count
      FROM corruption_complaints
      GROUP BY status
    `);

    const statusCounts = {};
    statusSummary.forEach(row => {
      statusCounts[row.status] = row.count;
    });

    return NextResponse.json({
      success: true,
      data: {
        complaints: complaints.map(complaint => ({
          ...complaint,
          referenceNumber: `CC${complaint.id.toString().padStart(6, '0')}`
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        },
        statusSummary: statusCounts
      }
    });

  } catch (error) {
    console.error('Error fetching corruption complaints:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการดึงข้อมูล', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}