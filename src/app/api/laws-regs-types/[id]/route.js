// app/api/laws-regs-types/[id]/route.js
import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Database connection
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// GET /api/laws-regs-types/[id] - ดึงข้อมูล laws regs type เดียวพร้อม sections และ files
export async function GET(request, { params }) {
  let connection;

  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const withSections = searchParams.get("withSections") === "true";

    connection = await mysql.createConnection(dbConfig);

    // Get laws regs type
    const [types] = await connection.execute(
      "SELECT * FROM laws_regs_types WHERE id = ?",
      [parseInt(id)]
    );

    if (types.length === 0) {
      return NextResponse.json(
        { success: false, error: "Laws regs type not found" },
        { status: 404 }
      );
    }

    let type = types[0];

    // If withSections is true, get sections with files
    if (withSections) {
      // Get sections with their files using LEFT JOIN
      const [sectionsWithFiles] = await connection.execute(
        `SELECT 
          lrs.id,
          lrs.type_id,
          lrs.section_name,
          lrs.created_at,
          lrs.updated_at,
          lrf.id as file_id,
          lrf.section_id,
          lrf.files_path,
          lrf.files_type,
          lrf.created_at as file_created_at,
          lrf.updated_at as file_updated_at
         FROM laws_regs_sections lrs
         LEFT JOIN laws_regs_files lrf ON lrs.id = lrf.section_id
         WHERE lrs.type_id = ?
         ORDER BY lrs.created_at ASC, lrf.created_at DESC`,
        [parseInt(id)]
      );

      // Group the results by section
      const sectionsMap = new Map();
      
      sectionsWithFiles.forEach(row => {
        const sectionId = row.id;
        
        // If section doesn't exist in map, create it
        if (!sectionsMap.has(sectionId)) {
          sectionsMap.set(sectionId, {
            id: row.id,
            type_id: row.type_id,
            section_name: row.section_name,
            created_at: row.created_at,
            updated_at: row.updated_at,
            files: []
          });
        }
        
        // Add file if it exists (file_id will be null if no files)
        if (row.file_id) {
          sectionsMap.get(sectionId).files.push({
            id: row.file_id,
            section_id: row.section_id,
            files_path: row.files_path,
            files_type: row.files_type,
            created_at: row.file_created_at,
            updated_at: row.file_updated_at
          });
        }
      });

      // Convert Map to Array
      type.sections = Array.from(sectionsMap.values());
    }

    return NextResponse.json({
      success: true,
      data: type,
    });
  } catch (error) {
    console.error("Error fetching laws regs type:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch laws regs type",
        details: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Alternative approach: Single query with JOIN (more efficient for large datasets)
export async function GET_ALTERNATIVE(request, { params }) {
  let connection;

  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const withSections = searchParams.get("withSections") === "true";

    connection = await mysql.createConnection(dbConfig);

    // Get laws regs type
    const [types] = await connection.execute(
      "SELECT * FROM laws_regs_types WHERE id = ?",
      [parseInt(id)]
    );

    if (types.length === 0) {
      return NextResponse.json(
        { success: false, error: "Laws regs type not found" },
        { status: 404 }
      );
    }

    let type = types[0];

    if (withSections) {
      // Check if new columns exist in the files table
      const [columns] = await connection.execute(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'laws_regs_files'
      `, [process.env.DB_NAME || 'gmsky_banphokorat']);

      const existingColumns = columns.map(col => col.COLUMN_NAME);
      const hasNewColumns = existingColumns.includes('original_name') && 
                           existingColumns.includes('file_size') && 
                           existingColumns.includes('description');

      // Build SELECT clause for files based on available columns
      const filesSelectClause = hasNewColumns ? 
        'lrf.id as file_id, lrf.section_id, lrf.files_path, lrf.files_type, lrf.original_name, lrf.file_size, lrf.description, lrf.created_at as file_created_at, lrf.updated_at as file_updated_at' :
        'lrf.id as file_id, lrf.section_id, lrf.files_path, lrf.files_type, lrf.created_at as file_created_at, lrf.updated_at as file_updated_at';

      // Single query to get all sections with their files
      const [sectionsWithFiles] = await connection.execute(
        `SELECT 
          lrs.*,
          ${filesSelectClause}
         FROM laws_regs_sections lrs
         LEFT JOIN laws_regs_files lrf ON lrs.id = lrf.section_id
         WHERE lrs.type_id = ?
         ORDER BY lrs.created_at ASC, lrf.created_at DESC`,
        [parseInt(id)]
      );

      // Group the results by section
      const sectionsMap = new Map();
      
      sectionsWithFiles.forEach(row => {
        const sectionId = row.id;
        
        if (!sectionsMap.has(sectionId)) {
          sectionsMap.set(sectionId, {
            id: row.id,
            type_id: row.type_id,
            section_name: row.section_name,
            description: row.description,
            created_at: row.created_at,
            updated_at: row.updated_at,
            files: []
          });
        }
        
        // Add file if it exists
        if (row.file_id) {
          const fileData = {
            id: row.file_id,
            section_id: row.section_id,
            files_path: row.files_path,
            files_type: row.files_type,
            created_at: row.file_created_at,
            updated_at: row.file_updated_at
          };

          // Add new columns if they exist
          if (hasNewColumns) {
            fileData.original_name = row.original_name;
            fileData.file_size = row.file_size;
            fileData.description = row.description;
          }

          sectionsMap.get(sectionId).files.push(fileData);
        }
      });

      type.sections = Array.from(sectionsMap.values());
    }

    return NextResponse.json({
      success: true,
      data: type,
    });
  } catch (error) {
    console.error("Error fetching laws regs type:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch laws regs type",
        details: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// PUT /api/laws-regs-types/[id] - อัปเดต laws regs type
export async function PUT(request, { params }) {
  let connection;

  try {
    const { id } = params;
    const body = await request.json();
    const { type_name } = body;

    // Validation
    if (!type_name) {
      return NextResponse.json(
        { success: false, error: "Type name is required" },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // Check if type name already exists (excluding current record)
    const [existingType] = await connection.execute(
      "SELECT id FROM laws_regs_types WHERE type_name = ? AND id != ?",
      [type_name, parseInt(id)]
    );

    if (existingType.length > 0) {
      return NextResponse.json(
        { success: false, error: "Type name already exists" },
        { status: 409 }
      );
    }

    // Update laws regs type
    const [result] = await connection.execute(
      "UPDATE laws_regs_types SET type_name = ?, updated_at = NOW() WHERE id = ?",
      [type_name, parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "Laws regs type not found" },
        { status: 404 }
      );
    }

    // Get updated type
    const [updatedType] = await connection.execute(
      "SELECT * FROM laws_regs_types WHERE id = ?",
      [parseInt(id)]
    );

    return NextResponse.json({
      success: true,
      data: updatedType[0],
      message: "Laws regs type updated successfully",
    });
  } catch (error) {
    console.error("Error updating laws regs type:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update laws regs type",
        details: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// DELETE /api/laws-regs-types/[id] - ลบ laws regs type
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
        `DELETE lrf FROM laws_regs_files lrf 
         INNER JOIN laws_regs_sections lrs ON lrf.section_id = lrs.id 
         WHERE lrs.type_id = ?`,
        [parseInt(id)]
      );

      // Delete sections
      await connection.execute(
        "DELETE FROM laws_regs_sections WHERE type_id = ?",
        [parseInt(id)]
      );

      // Delete laws regs type
      const [result] = await connection.execute(
        "DELETE FROM laws_regs_types WHERE id = ?",
        [parseInt(id)]
      );

      if (result.affectedRows === 0) {
        await connection.rollback();
        return NextResponse.json(
          { success: false, error: "Laws regs type not found" },
          { status: 404 }
        );
      }

      // Commit transaction
      await connection.commit();

      return NextResponse.json({
        success: true,
        message: "Laws regs type deleted successfully",
      });
    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error deleting laws regs type:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete laws regs type",
        details: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}