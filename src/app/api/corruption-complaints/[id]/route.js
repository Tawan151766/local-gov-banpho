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

// GET /api/corruption-complaints/[id] - ดึงข้อมูลคำร้องเรียนรายการเดียว
export async function GET(request, { params }) {
  let connection;
  
  try {
    const { id } = params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { success: false, error: 'Invalid complaint ID' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Get complaint details
    const [complaints] = await connection.execute(`
      SELECT * FROM corruption_complaints WHERE id = ?
    `, [parseInt(id)]);

    if (complaints.length === 0) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบคำร้องเรียนที่ระบุ' },
        { status: 404 }
      );
    }

    const complaint = complaints[0];

    return NextResponse.json({
      success: true,
      data: {
        ...complaint,
        referenceNumber: `CC${complaint.id.toString().padStart(6, '0')}`
      }
    });

  } catch (error) {
    console.error('Error fetching corruption complaint:', error);
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

// PUT /api/corruption-complaints/[id] - อัปเดตสถานะคำร้องเรียน (สำหรับ admin)
export async function PUT(request, { params }) {
  let connection;
  
  try {
    const { id } = params;
    const body = await request.json();
    const { status, statusNote, assignedTo, investigationResult, actionTaken, adminUser } = body;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { success: false, error: 'Invalid complaint ID' },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'กรุณาระบุสถานะ' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'investigating', 'completed', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'สถานะไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Start transaction
    await connection.beginTransaction();

    try {
      // Get current status
      const [currentComplaint] = await connection.execute(`
        SELECT status FROM corruption_complaints WHERE id = ?
      `, [parseInt(id)]);

      if (currentComplaint.length === 0) {
        return NextResponse.json(
          { success: false, error: 'ไม่พบคำร้องเรียนที่ระบุ' },
          { status: 404 }
        );
      }

      const oldStatus = currentComplaint[0].status;

      // Update complaint
      const updateFields = ['status = ?'];
      const updateValues = [status];

      if (statusNote !== undefined) {
        updateFields.push('status_note = ?');
        updateValues.push(statusNote);
      }

      if (assignedTo !== undefined) {
        updateFields.push('assigned_to = ?');
        updateValues.push(assignedTo);
      }

      if (investigationResult !== undefined) {
        updateFields.push('investigation_result = ?');
        updateValues.push(investigationResult);
      }

      if (actionTaken !== undefined) {
        updateFields.push('action_taken = ?');
        updateValues.push(actionTaken);
      }

      updateValues.push(parseInt(id));

      await connection.execute(`
        UPDATE corruption_complaints 
        SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, updateValues);

      // Commit transaction
      await connection.commit();

      return NextResponse.json({
        success: true,
        message: 'อัปเดตสถานะเรียบร้อยแล้ว',
        data: {
          id: parseInt(id),
          oldStatus,
          newStatus: status
        }
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Error updating corruption complaint:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการอัปเดต', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// DELETE /api/corruption-complaints/[id] - ลบคำร้องเรียน (สำหรับ admin)
export async function DELETE(request, { params }) {
  let connection;
  
  try {
    const { id } = params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { success: false, error: 'Invalid complaint ID' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Start transaction
    await connection.beginTransaction();

    try {
      // Check if complaint exists
      const [complaints] = await connection.execute(`
        SELECT id FROM corruption_complaints WHERE id = ?
      `, [parseInt(id)]);

      if (complaints.length === 0) {
        return NextResponse.json(
          { success: false, error: 'ไม่พบคำร้องเรียนที่ระบุ' },
          { status: 404 }
        );
      }

      // Delete complaint (cascade will handle related records)
      await connection.execute(`
        DELETE FROM corruption_complaints WHERE id = ?
      `, [parseInt(id)]);

      // Commit transaction
      await connection.commit();

      return NextResponse.json({
        success: true,
        message: 'ลบคำร้องเรียนเรียบร้อยแล้ว'
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Error deleting corruption complaint:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการลบ', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}