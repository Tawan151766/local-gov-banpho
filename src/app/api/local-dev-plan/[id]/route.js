// app/api/local-dev-plan/[id]/route.js
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

export async function GET(request, { params }) {
  let connection;

  try {
    const { id } = params;

    // ตรวจสอบว่ามี ID หรือไม่
    if (!id) {
      return NextResponse.json({
        success: false,
        message: "กรุณาระบุ ID แผนพัฒนาท้องถิ่น"
      }, { status: 400 });
    }

    // สร้างการเชื่อมต่อฐานข้อมูล
    connection = await mysql.createConnection(dbConfig);

    // ดึงข้อมูลแผนพัฒนาท้องถิ่นตาม ID พร้อมนับจำนวนไฟล์
    const planQuery = `
      SELECT 
        ldt.id,
        ldt.type_name,
        ldt.created_at,
        ldt.updated_at,
        COUNT(ldf.id) as files_count
      FROM local_dev_plan_types ldt
      LEFT JOIN local_dev_plan_files ldf ON ldt.id = ldf.type_id
      WHERE ldt.id = ?
      GROUP BY ldt.id, ldt.type_name, ldt.created_at, ldt.updated_at
    `;

    // ดึงข้อมูลไฟล์ที่เกี่ยวข้อง
    const filesQuery = `
      SELECT 
        id,
        type_id,
        files_path,
        files_type,
        original_name,
        file_size,
        description,
        created_at,
        updated_at
      FROM local_dev_plan_files 
      WHERE type_id = ?
      ORDER BY created_at DESC
    `;

    // Execute queries
    const [planResult] = await connection.execute(planQuery, [id]);
    const [filesResult] = await connection.execute(filesQuery, [id]);

    if (planResult.length === 0) {
      return NextResponse.json({
        success: false,
        message: "ไม่พบข้อมูลแผนพัฒนาท้องถิ่น"
      }, { status: 404 });
    }

    // จัดรูปแบบข้อมูลผลลัพธ์
    const planData = {
      id: planResult[0].id,
      type_name: planResult[0].type_name,
      created_at: planResult[0].created_at,
      updated_at: planResult[0].updated_at,
      files_count: parseInt(planResult[0].files_count) || 0,
      files: filesResult.map(file => ({
        id: file.id,
        type_id: file.type_id,
        files_path: file.files_path,
        files_type: file.files_type,
        original_name: file.original_name,
        file_size: file.file_size,
        description: file.description,
        created_at: file.created_at,
        updated_at: file.updated_at
      }))
    };

    return NextResponse.json({
      success: true,
      message: "ดึงข้อมูลแผนพัฒนาท้องถิ่นสำเร็จ",
      data: planData
    });

  } catch (error) {
    console.error('Error fetching local development plan detail:', error);
    return NextResponse.json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลแผนพัฒนาท้องถิ่น",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

