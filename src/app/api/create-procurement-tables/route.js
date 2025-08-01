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

// POST /api/create-procurement-tables - สร้างตาราง Procurement Plan Management
export async function POST(request) {
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    // Start transaction
    await connection.beginTransaction();

    try {
      // Create procurement_plan_types table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS procurement_plan_types (
          id INT AUTO_INCREMENT PRIMARY KEY,
          type_name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_type_name (type_name)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // Create procurement_plan_files table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS procurement_plan_files (
          id INT AUTO_INCREMENT PRIMARY KEY,
          type_id INT NOT NULL,
          files_path VARCHAR(500) NOT NULL,
          files_type VARCHAR(50) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (type_id) REFERENCES procurement_plan_types(id) ON DELETE CASCADE,
          INDEX idx_type_id (type_id),
          INDEX idx_files_type (files_type)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // Insert sample data for procurement_plan_types
      await connection.execute(`
        INSERT IGNORE INTO procurement_plan_types (id, type_name) VALUES
        (1, 'แผนการจัดซื้อจัดจ้างประจำปี'),
        (2, 'แผนการจัดซื้อจัดจ้างรายไตรมาส'),
        (3, 'แผนการจัดซื้อจัดจ้างเร่งด่วน'),
        (4, 'แผนการจัดซื้อจัดจ้างโครงการพิเศษ'),
        (5, 'แผนการจัดซื้อจัดจ้างวัสดุสำนักงาน'),
        (6, 'แผนการจัดซื้อจัดจ้างครุภัณฑ์'),
        (7, 'แผนการจัดซื้อจัดจ้างงานก่อสร้าง')
      `);

      // Insert sample data for procurement_plan_files
      await connection.execute(`
        INSERT IGNORE INTO procurement_plan_files (id, type_id, files_path, files_type) VALUES
        (1, 1, '/assets/documents/procurement/annual_plan_2567.pdf', 'pdf'),
        (2, 1, '/assets/documents/procurement/annual_plan_summary_2567.xlsx', 'xlsx'),
        (3, 2, '/assets/documents/procurement/q1_2567_plan.pdf', 'pdf'),
        (4, 2, '/assets/documents/procurement/q2_2567_plan.pdf', 'pdf'),
        (5, 2, '/assets/documents/procurement/q3_2567_plan.pdf', 'pdf'),
        (6, 2, '/assets/documents/procurement/q4_2567_plan.pdf', 'pdf'),
        (7, 3, '/assets/documents/procurement/urgent_procurement_2567.pdf', 'pdf'),
        (8, 4, '/assets/documents/procurement/special_project_plan.pdf', 'pdf'),
        (9, 4, '/assets/documents/procurement/special_project_budget.xlsx', 'xlsx'),
        (10, 5, '/assets/documents/procurement/office_supplies_plan.pdf', 'pdf'),
        (11, 5, '/assets/documents/procurement/office_supplies_list.xlsx', 'xlsx'),
        (12, 6, '/assets/documents/procurement/equipment_plan_2567.pdf', 'pdf'),
        (13, 6, '/assets/documents/procurement/equipment_specifications.docx', 'docx'),
        (14, 7, '/assets/documents/procurement/construction_plan_2567.pdf', 'pdf'),
        (15, 7, '/assets/documents/procurement/construction_budget.xlsx', 'xlsx'),
        (16, 7, '/assets/documents/procurement/construction_timeline.pdf', 'pdf')
      `);

      // Commit transaction
      await connection.commit();

      return NextResponse.json(
        {
          success: true,
          message: "Procurement Plan Management tables created successfully",
          tables: ["procurement_plan_types", "procurement_plan_files"],
        },
        { status: 201 }
      );
    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error creating Procurement Plan Management tables:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create Procurement Plan Management tables",
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

// GET /api/create-procurement-tables - ตรวจสอบสถานะตาราง
export async function GET(request) {
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    // Check if tables exist
    const tableNames = ["procurement_plan_types", "procurement_plan_files"];
    const tablesExist = {};
    const recordCounts = {};

    for (const tableName of tableNames) {
      const [tableCheck] = await connection.execute(
        `
        SELECT COUNT(*) as count FROM information_schema.tables 
        WHERE table_schema = 'gmsky_banphokorat' AND table_name = ?
      `,
        [tableName]
      );

      tablesExist[tableName] = tableCheck[0].count > 0;

      // Get record counts if table exists
      if (tablesExist[tableName]) {
        const [recordCount] = await connection.execute(
          `SELECT COUNT(*) as count FROM ${tableName}`
        );
        recordCounts[tableName] = recordCount[0].count;
      }
    }

    // Get procurement plan types with file counts
    let typesWithFileCounts = [];
    if (tablesExist.procurement_plan_types) {
      const [types] = await connection.execute(`
        SELECT 
          ppt.*,
          (SELECT COUNT(*) FROM procurement_plan_files WHERE type_id = ppt.id) as files_count
        FROM procurement_plan_types ppt
        ORDER BY ppt.created_at DESC
        LIMIT 10
      `);
      typesWithFileCounts = types;
    }

    return NextResponse.json({
      success: true,
      tablesExist,
      recordCounts,
      sampleData: typesWithFileCounts,
    });
  } catch (error) {
    console.error("Error checking Procurement Plan Management tables:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check Procurement Plan Management tables",
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
