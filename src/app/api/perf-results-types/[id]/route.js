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

// GET /api/perf-results-types/[id] - ดึงข้อมูลประเภทผลการดำเนินงานตาม ID
export async function GET(request, { params }) {
  let connection;
  
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const withSections = searchParams.get('withSections') === 'true';
    
    connection = await mysql.createConnection(dbConfig);

    const [types] = await connection.execute(
      'SELECT * FROM perf_results_types WHERE id = ?',
      [parseInt(id)]
    );

    if (!types || types.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Performance results type not found' },
        { status: 404 }
      );
    }

    let typeData = types[0];

    // Get sections if requested
    if (withSections) {
      const [sections] = await connection.execute(
        'SELECT * FROM perf_results_sections WHERE perf_results_type_id = ? ORDER BY created_at ASC',
        [parseInt(id)]
      );

      typeData = {
        ...typeData,
        sections: sections
      };
    }

    return NextResponse.json({
      success: true,
      data: typeData
    });

  } catch (error) {
    console.error('Error fetching performance results type:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch performance results type', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// PUT /api/perf-results-types/[id] - อัปเดตข้อมูลประเภทผลการดำเนินงาน
export async function PUT(request, { params }) {
  let connection;
  
  try {
    const { id } = params;
    const body = await request.json();
    const { type_name, sections = [] } = body;

    // Validation
    if (!type_name) {
      return NextResponse.json(
        { success: false, error: 'Type name is required' },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Check if type exists
    const [existing] = await connection.execute(
      'SELECT id FROM perf_results_types WHERE id = ?',
      [parseInt(id)]
    );

    if (!existing || existing.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Performance results type not found' },
        { status: 404 }
      );
    }

    // Start transaction
    await connection.beginTransaction();

    try {
      // Update performance results type
      await connection.execute(
        'UPDATE perf_results_types SET type_name = ?, updated_at = NOW() WHERE id = ?',
        [type_name, parseInt(id)]
      );

      // Delete existing sections
      await connection.execute(
        'DELETE FROM perf_results_sections WHERE perf_results_type_id = ?',
        [parseInt(id)]
      );

      // Insert new sections if provided
      if (sections && sections.length > 0) {
        for (const section of sections) {
          if (section.section_name) {
            await connection.execute(
              'INSERT INTO perf_results_sections (perf_results_type_id, section_name, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
              [parseInt(id), section.section_name]
            );
          }
        }
      }

      // Commit transaction
      await connection.commit();

      // Get updated type with sections
      const [updatedType] = await connection.execute(
        'SELECT * FROM perf_results_types WHERE id = ?',
        [parseInt(id)]
      );

      const [updatedSections] = await connection.execute(
        'SELECT * FROM perf_results_sections WHERE perf_results_type_id = ?',
        [parseInt(id)]
      );

      const typeWithSections = {
        ...updatedType[0],
        sections: updatedSections
      };

      return NextResponse.json({
        success: true,
        data: typeWithSections,
        message: 'Performance results type updated successfully'
      });

    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Error updating performance results type:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update performance results type', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// DELETE /api/perf-results-types/[id] - ลบประเภทผลการดำเนินงาน
export async function DELETE(request, { params }) {
  let connection;
  
  try {
    const { id } = params;

    connection = await mysql.createConnection(dbConfig);

    // Check if type exists
    const [existing] = await connection.execute(
      'SELECT id FROM perf_results_types WHERE id = ?',
      [parseInt(id)]
    );

    if (!existing || existing.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Performance results type not found' },
        { status: 404 }
      );
    }

    // Delete type (sections will be deleted automatically due to CASCADE)
    await connection.execute(
      'DELETE FROM perf_results_types WHERE id = ?',
      [parseInt(id)]
    );

    return NextResponse.json({
      success: true,
      message: 'Performance results type deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting performance results type:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete performance results type', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}