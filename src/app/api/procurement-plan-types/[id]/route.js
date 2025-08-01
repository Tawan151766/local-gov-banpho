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

// GET /api/procurement-plan-types/[id] - ดึงข้อมูล procurement plan type เดียว
export async function GET(request, { params }) {
  let connection;
  
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const withFiles = searchParams.get('withFiles') === 'true';

    connection = await mysql.createConnection(dbConfig);

    // Get procurement plan type
    const [types] = await connection.execute(
      'SELECT * FROM procurement_plan_types WHERE id = ?',
      [parseInt(id)]
    );

    if (types.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Procurement plan type not found' },
        { status: 404 }
      );
    }

    let type = types[0];

    // If withFiles is true, get files
    if (withFiles) {
      const [files] = await connection.execute(
        'SELECT * FROM procurement_plan_files WHERE type_id = ? ORDER BY created_at ASC',
        [parseInt(id)]
      );
      type.files = files;
    }

    return NextResponse.json({
      success: true,
      data: type
    });

  } catch (error) {
    console.error('Error fetching procurement plan type:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch procurement plan type', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// PUT /api/procurement-plan-types/[id] - อัปเดต procurement plan type
export async function PUT(request, { params }) {
  let connection;
  
  try {
    const { id } = params;
    const body = await request.json();
    const { type_name } = body;

    // Validation
    if (!type_name) {
      return NextResponse.json(
        { success: false, error: 'Type name is required' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Check if type name already exists (excluding current record)
    const [existingType] = await connection.execute(
      'SELECT id FROM procurement_plan_types WHERE type_name = ? AND id != ?',
      [type_name, parseInt(id)]
    );

    if (existingType.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Type name already exists' },
        { status: 409 }
      );
    }

    // Update procurement plan type
    const [result] = await connection.execute(
      'UPDATE procurement_plan_types SET type_name = ?, updated_at = NOW() WHERE id = ?',
      [type_name, parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Procurement plan type not found' },
        { status: 404 }
      );
    }

    // Get updated type
    const [updatedType] = await connection.execute(
      'SELECT * FROM procurement_plan_types WHERE id = ?',
      [parseInt(id)]
    );

    return NextResponse.json({
      success: true,
      data: updatedType[0],
      message: 'Procurement plan type updated successfully'
    });

  } catch (error) {
    console.error('Error updating procurement plan type:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update procurement plan type', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// DELETE /api/procurement-plan-types/[id] - ลบ procurement plan type
export async function DELETE(request, { params }) {
  let connection;
  
  try {
    const { id } = params;

    connection = await mysql.createConnection(dbConfig);

    // Start transaction
    await connection.beginTransaction();

    try {
      // Delete files first (CASCADE will handle this, but we do it explicitly)
      await connection.execute(
        'DELETE FROM procurement_plan_files WHERE type_id = ?',
        [parseInt(id)]
      );

      // Delete procurement plan type
      const [result] = await connection.execute(
        'DELETE FROM procurement_plan_types WHERE id = ?',
        [parseInt(id)]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        return NextResponse.json(
          { success: false, error: 'Procurement plan type not found' },
          { status: 404 }
        );
      }

      // Commit transaction
      await connection.commit();

      return NextResponse.json({
        success: true,
        message: 'Procurement plan type deleted successfully'
      });

    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Error deleting procurement plan type:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete procurement plan type', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}