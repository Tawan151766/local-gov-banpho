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

// GET - ดึงข้อมูลไฟล์แผนพัฒนาท้องถิ่น
export async function GET(request) {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    
    const { searchParams } = new URL(request.url);
    const typeId = searchParams.get('typeId');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const search = searchParams.get('search') || '';
    
    // Validation
    if (!typeId) {
      return NextResponse.json(
        {
          success: false,
          error: 'รหัสประเภทแผนพัฒนาท้องถิ่นเป็นข้อมูลที่จำเป็น'
        },
        { status: 400 }
      );
    }
    
    const offset = (page - 1) * limit;
    
    // Build WHERE clause
    let whereClause = 'WHERE f.type_id = ?';
    let queryParams = [typeId];
    
    if (search) {
      whereClause += ' AND (f.files_path LIKE ? OR f.original_name LIKE ? OR f.description LIKE ?)';
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    // Get total count
    const [countResult] = await connection.execute(
      `SELECT COUNT(*) as total FROM local_dev_plan_files f ${whereClause}`,
      queryParams
    );
    const total = countResult[0].total;
    
    // Get files with type information
    const query = `
      SELECT 
        f.*,
        t.type_name
      FROM local_dev_plan_files f
      LEFT JOIN local_dev_plan_types t ON f.type_id = t.id
      ${whereClause}
      ORDER BY f.id DESC
      LIMIT ? OFFSET ?
    `;
    
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
    console.error('Error fetching local dev plan files:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch local dev plan files',
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

// POST - สร้างไฟล์แผนพัฒนาท้องถิ่นใหม่
export async function POST(request) {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    
    const { 
      type_id, 
      files_path, 
      files_type, 
      original_name, 
      file_size, 
      description 
    } = await request.json();
    
    // Validation
    if (!type_id || !files_path || !files_type) {
      return NextResponse.json(
        {
          success: false,
          error: 'ข้อมูลประเภท เส้นทางไฟล์ และประเภทไฟล์เป็นข้อมูลที่จำเป็น'
        },
        { status: 400 }
      );
    }
    
    // Check if type exists
    const [existingType] = await connection.execute(
      'SELECT id FROM local_dev_plan_types WHERE id = ?',
      [type_id]
    );
    
    if (existingType.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'ไม่พบประเภทแผนพัฒนาท้องถิ่นที่ระบุ'
        },
        { status: 404 }
      );
    }
    
    // Insert new file
    const [result] = await connection.execute(
      `INSERT INTO local_dev_plan_files 
       (type_id, files_path, files_type, original_name, file_size, description) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [type_id, files_path, files_type, original_name || null, file_size || null, description || null]
    );
    
    // Get the created record with type information
    const [newRecord] = await connection.execute(
      `SELECT 
         f.*,
         t.type_name
       FROM local_dev_plan_files f
       LEFT JOIN local_dev_plan_types t ON f.type_id = t.id
       WHERE f.id = ?`,
      [result.insertId]
    );
    
    return NextResponse.json({
      success: true,
      message: 'เพิ่มไฟล์แผนพัฒนาท้องถิ่นใหม่สำเร็จ',
      data: newRecord[0]
    });
    
  } catch (error) {
    console.error('Error creating local dev plan file:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'เกิดข้อผิดพลาดในการเพิ่มไฟล์แผนพัฒนาท้องถิ่น',
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

// PUT - อัปเดตไฟล์แผนพัฒนาท้องถิ่น
export async function PUT(request) {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { 
      files_path, 
      files_type, 
      original_name, 
      file_size, 
      description 
    } = await request.json();
    
    // Validation
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'รหัสไฟล์เป็นข้อมูลที่จำเป็น'
        },
        { status: 400 }
      );
    }
    
    if (!files_path || !files_type) {
      return NextResponse.json(
        {
          success: false,
          error: 'เส้นทางไฟล์และประเภทไฟล์เป็นข้อมูลที่จำเป็น'
        },
        { status: 400 }
      );
    }
    
    // Check if record exists
    const [existingRecord] = await connection.execute(
      'SELECT id FROM local_dev_plan_files WHERE id = ?',
      [id]
    );
    
    if (existingRecord.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'ไม่พบไฟล์ที่ต้องการแก้ไข'
        },
        { status: 404 }
      );
    }
    
    // Update record
    await connection.execute(
      `UPDATE local_dev_plan_files 
       SET files_path = ?, files_type = ?, original_name = ?, file_size = ?, description = ?
       WHERE id = ?`,
      [files_path, files_type, original_name || null, file_size || null, description || null, id]
    );
    
    // Get updated record with type information
    const [updatedRecord] = await connection.execute(
      `SELECT 
         f.*,
         t.type_name
       FROM local_dev_plan_files f
       LEFT JOIN local_dev_plan_types t ON f.type_id = t.id
       WHERE f.id = ?`,
      [id]
    );
    
    return NextResponse.json({
      success: true,
      message: 'อัปเดตไฟล์แผนพัฒนาท้องถิ่นสำเร็จ',
      data: updatedRecord[0]
    });
    
  } catch (error) {
    console.error('Error updating local dev plan file:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'เกิดข้อผิดพลาดในการอัปเดตไฟล์แผนพัฒนาท้องถิ่น',
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

// DELETE - ลบไฟล์แผนพัฒนาท้องถิ่น
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
          error: 'รหัสไฟล์เป็นข้อมูลที่จำเป็น'
        },
        { status: 400 }
      );
    }
    
    // Get file information before deletion
    const [existingRecord] = await connection.execute(
      `SELECT 
         f.*,
         t.type_name
       FROM local_dev_plan_files f
       LEFT JOIN local_dev_plan_types t ON f.type_id = t.id
       WHERE f.id = ?`,
      [id]
    );
    
    if (existingRecord.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'ไม่พบไฟล์ที่ต้องการลบ'
        },
        { status: 404 }
      );
    }
    
    // Delete the record
    await connection.execute(
      'DELETE FROM local_dev_plan_files WHERE id = ?',
      [id]
    );
    
    return NextResponse.json({
      success: true,
      message: `ลบไฟล์ "${existingRecord[0].original_name || existingRecord[0].files_path}" สำเร็จ`,
      deletedRecord: existingRecord[0]
    });
    
  } catch (error) {
    console.error('Error deleting local dev plan file:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'เกิดข้อผิดพลาดในการลบไฟล์แผนพัฒนาท้องถิ่น',
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