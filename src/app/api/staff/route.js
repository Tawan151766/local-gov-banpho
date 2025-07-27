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

// Staff roles mapping
const STAFF_ROLES = {
  'leader': 'หัวหน้า',
  'coleader': 'รองหัวหน้า',
  'employee': 'พนักงาน',
  'employee_c1': 'พนักงาน C1',
  'employee_c2': 'พนักงาน C2',
  'employee_c3': 'พนักงาน C3',
  'employee_c4': 'พนักงาน C4',
  'employee_c5': 'พนักงาน C5',
  'employee_c6': 'พนักงาน C6',
  'employee_c7': 'พนักงาน C7',
  'employee_c8': 'พนักงาน C8',
  'employee_c9': 'พนักงาน C9',
  'employee_c10': 'พนักงาน C10',
};

// GET /api/staff-simple - ดึงรายการบุคลากรทั้งหมด
export async function GET(request) {
  let connection;
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';

    const offset = (page - 1) * limit;

    connection = await mysql.createConnection(dbConfig);

    // Build WHERE clause
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (full_name LIKE ? OR phone LIKE ? OR department LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    if (role) {
      whereClause += ' AND role = ?';
      params.push(role);
    }

    // Get staff data
    const [staff] = await connection.execute(
      `SELECT * FROM staff ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // Get total count
    const [countResult] = await connection.execute(
      `SELECT COUNT(*) as total FROM staff ${whereClause}`,
      params
    );

    const total = countResult[0]?.total || 0;

    // Add role names
    const staffWithRoleNames = staff.map(member => ({
      ...member,
      role_name: STAFF_ROLES[member.role] || member.role
    }));

    return NextResponse.json({
      success: true,
      data: staffWithRoleNames,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch staff', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// POST /api/staff-simple - สร้างบุคลากรใหม่
export async function POST(request) {
  let connection;
  
  try {
    const body = await request.json();
    const { full_name, phone, role, department, img } = body;

    console.log('Received staff data:', { full_name, phone, role, department, img });

    // Validation
    if (!full_name || !role) {
      return NextResponse.json(
        { success: false, error: 'Full name and role are required' },
        { status: 400 }
      );
    }

    // Validate role
    if (!Object.keys(STAFF_ROLES).includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Insert staff member
    const [result] = await connection.execute(
      'INSERT INTO staff (full_name, phone, role, department, img, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [full_name, phone || null, role, department || null, img || null]
    );

    // Get the created staff member
    const [staff] = await connection.execute(
      'SELECT * FROM staff WHERE id = ?',
      [result.insertId]
    );

    if (!staff || staff.length === 0) {
      throw new Error('Failed to retrieve created staff member');
    }

    const createdStaff = staff[0];

    // Add role name
    const staffWithRoleName = {
      ...createdStaff,
      role_name: STAFF_ROLES[createdStaff.role] || createdStaff.role
    };

    return NextResponse.json({
      success: true,
      data: staffWithRoleName,
      message: 'Staff member created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating staff:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create staff member', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}