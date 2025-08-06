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

// GET /api/laws-regs-sections/[id] - ดึงข้อมูล laws regs section เดียว
export async function GET(request, { params }) {
  let connection;
  
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const withFiles = searchParams.get('withFiles') === 'true';

    connection = await mysql.createConnection(dbConfig);

    // Get laws regs section with type info
    const [sections] = await connection.execute(
      `SELECT lrs.*, lrt.type_name 
       FROM laws_regs_sections lrs 
       LEFT JOIN laws_regs_types lrt ON lrs.type_id = lrt.id 
       WHERE lrs.id = ?`,
      [parseInt(id)]
    );

    if (sections.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Laws regs section not found' },
        { status: 404 }
      );
    }

    let section = sections[0];

    // If withFiles is true, get files
    if (withFiles) {
      const [files] = await connection.execute(
        'SELECT * FROM laws_regs_files WHERE section_id = ? ORDER BY created_at ASC',
        [parseInt(id)]
      );
      section.files = files;
    }

    return NextResponse.json({
      success: true,
      data: section
    });

  } catch (error) {
    console.error('Error fetching laws regs section:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch laws regs section', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// PUT /api/laws-regs-sections/[id] - อัปเดต laws regs section
export async function PUT(request, { params }) {
  let connection;
  
  try {
    const { id } = params;
    const body = await request.json();
    const { section_name } = body;

    // Validation
    if (!section_name) {
      return NextResponse.json(
        { success: false, error: 'Section name is required' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Update laws regs section
    const [result] = await connection.execute(
      'UPDATE laws_regs_sections SET section_name = ?, updated_at = NOW() WHERE id = ?',
      [section_name, parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Laws regs section not found' },
        { status: 404 }
      );
    }

    // Get updated section
    const [updatedSection] = await connection.execute(
      `SELECT lrs.*, lrt.type_name 
       FROM laws_regs_sections lrs 
       LEFT JOIN laws_regs_types lrt ON lrs.type_id = lrt.id 
       WHERE lrs.id = ?`,
      [parseInt(id)]
    );

    return NextResponse.json({
      success: true,
      data: updatedSection[0],
      message: 'Laws regs section updated successfully'
    });

  } catch (error) {
    console.error('Error updating laws regs section:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update laws regs section', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// DELETE /api/laws-regs-sections/[id] - ลบ laws regs section
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
        'DELETE FROM laws_regs_files WHERE section_id = ?',
        [parseInt(id)]
      );

      // Delete laws regs section
      const [result] = await connection.execute(
        'DELETE FROM laws_regs_sections WHERE id = ?',
        [parseInt(id)]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        return NextResponse.json(
          { success: false, error: 'Laws regs section not found' },
          { status: 404 }
        );
      }

      // Commit transaction
      await connection.commit();

      return NextResponse.json({
        success: true,
        message: 'Laws regs section deleted successfully'
      });

    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Error deleting laws regs section:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete laws regs section', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}