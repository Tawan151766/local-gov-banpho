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

// GET - ดึงข้อมูลประเภทแผนพัฒนาท้องถิ่น
export async function GET(request) {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const withFiles = searchParams.get('withFiles') === 'true';
    
    const offset = (page - 1) * limit;
    
    // Build WHERE clause for search
    let whereClause = '';
    let queryParams = [];
    
    if (search) {
      whereClause = 'WHERE type_name LIKE ?';
      queryParams.push(`%${search}%`);
    }
    
    // Get total count
    const [countResult] = await connection.execute(
      `SELECT COUNT(*) as total FROM local_dev_plan_types ${whereClause}`,
      queryParams
    );
    const total = countResult[0].total;
    
    // Get data with files count if requested
    let query;
    if (withFiles) {
      query = `
        SELECT 
          t.*,
          COUNT(f.id) as files_count
        FROM local_dev_plan_types t
        LEFT JOIN local_dev_plan_files f ON t.id = f.type_id
        ${whereClause}
        GROUP BY t.id
        ORDER BY t.id DESC
        LIMIT ? OFFSET ?
      `;
    } else {
      query = `
        SELECT * FROM local_dev_plan_types 
        ${whereClause}
        ORDER BY id DESC
        LIMIT ? OFFSET ?
      `;
    }
    
    queryParams.push(limit, offset);
    const [rows] = await connection.execute(query, queryParams);
    
    return NextResponse.json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching local dev plan types:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch local dev plan types',
        details: error.message
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// POST - สร้างประเภทแผนพัฒนาท้องถิ่นใหม่
export async function POST(request) {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    
    const { type_name } = await request.json();
    
    // Validation
    if (!type_name || type_name.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: 'ชื่อประเภทแผนพัฒนาท้องถิ่นเป็นข้อมูลที่จำเป็น'
        },
        { status: 400 }
      );
    }
    
    // Check if type name already exists
    const [existingTypes] = await connection.execute(
      'SELECT id FROM local_dev_plan_types WHERE type_name = ?',
      [type_name.trim()]
    );
    
    if (existingTypes.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'ชื่อประเภทแผนพัฒนาท้องถิ่นนี้มีอยู่แล้ว'
        },
        { status: 400 }
      );
    }
    
    // Insert new type
    const [result] = await connection.execute(
      'INSERT INTO local_dev_plan_types (type_name) VALUES (?)',
      [type_name.trim()]
    );
    
    // Get the created record
    const [newRecord] = await connection.execute(
      'SELECT * FROM local_dev_plan_types WHERE id = ?',
      [result.insertId]
    );
    
    return NextResponse.json({
      success: true,
      message: 'สร้างประเภทแผนพัฒนาท้องถิ่นใหม่สำเร็จ',
      data: newRecord[0]
    });
    
  } catch (error) {
    console.error('Error creating local dev plan type:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'เกิดข้อผิดพลาดในการสร้างประเภทแผนพัฒนาท้องถิ่น',
        details: error.message
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// PUT - อัปเดตประเภทแผนพัฒนาท้องถิ่น
export async function PUT(request) {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { type_name } = await request.json();
    
    // Validation
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'รหัสประเภทแผนพัฒนาท้องถิ่นเป็นข้อมูลที่จำเป็น'
        },
        { status: 400 }
      );
    }
    
    if (!type_name || type_name.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: 'ชื่อประเภทแผนพัฒนาท้องถิ่นเป็นข้อมูลที่จำเป็น'
        },
        { status: 400 }
      );
    }
    
    // Check if record exists
    const [existingRecord] = await connection.execute(
      'SELECT id FROM local_dev_plan_types WHERE id = ?',
      [id]
    );
    
    if (existingRecord.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'ไม่พบประเภทแผนพัฒนาท้องถิ่นที่ต้องการแก้ไข'
        },
        { status: 404 }
      );
    }
    
    // Check if type name already exists (excluding current record)
    const [duplicateTypes] = await connection.execute(
      'SELECT id FROM local_dev_plan_types WHERE type_name = ? AND id != ?',
      [type_name.trim(), id]
    );
    
    if (duplicateTypes.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'ชื่อประเภทแผนพัฒนาท้องถิ่นนี้มีอยู่แล้ว'
        },
        { status: 400 }
      );
    }
    
    // Update record
    await connection.execute(
      'UPDATE local_dev_plan_types SET type_name = ? WHERE id = ?',
      [type_name.trim(), id]
    );
    
    // Get updated record
    const [updatedRecord] = await connection.execute(
      'SELECT * FROM local_dev_plan_types WHERE id = ?',
      [id]
    );
    
    return NextResponse.json({
      success: true,
      message: 'อัปเดตประเภทแผนพัฒนาท้องถิ่นสำเร็จ',
      data: updatedRecord[0]
    });
    
  } catch (error) {
    console.error('Error updating local dev plan type:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'เกิดข้อผิดพลาดในการอัปเดตประเภทแผนพัฒนาท้องถิ่น',
        details: error.message
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// DELETE - ลบประเภทแผนพัฒนาท้องถิ่น
export async function DELETE(request) {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // Validation
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'รหัสประเภทแผนพัฒนาท้องถิ่นเป็นข้อมูลที่จำเป็น'
        },
        { status: 400 }
      );
    }
    
    // Check if record exists
    const [existingRecord] = await connection.execute(
      'SELECT id, type_name FROM local_dev_plan_types WHERE id = ?',
      [id]
    );
    
    if (existingRecord.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'ไม่พบประเภทแผนพัฒนาท้องถิ่นที่ต้องการลบ'
        },
        { status: 404 }
      );
    }
    
    // Check if there are related files
    const [relatedFiles] = await connection.execute(
      'SELECT COUNT(*) as count FROM local_dev_plan_files WHERE type_id = ?',
      [id]
    );
    
    const filesCount = relatedFiles[0].count;
    
    // Delete the record (files will be deleted automatically due to CASCADE)
    await connection.execute(
      'DELETE FROM local_dev_plan_types WHERE id = ?',
      [id]
    );
    
    return NextResponse.json({
      success: true,
      message: `ลบประเภทแผนพัฒนาท้องถิ่น "${existingRecord[0].type_name}" สำเร็จ${filesCount > 0 ? ` (รวมไฟล์ ${filesCount} ไฟล์)` : ''}`,
      deletedRecord: existingRecord[0],
      deletedFilesCount: filesCount
    });
    
  } catch (error) {
    console.error('Error deleting local dev plan type:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'เกิดข้อผิดพลาดในการลบประเภทแผนพัฒนาท้องถิ่น',
        details: error.message
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}