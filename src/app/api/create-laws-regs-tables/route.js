import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Database connection
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// POST /api/create-laws-regs-tables - สร้างตาราง Laws & Regulations Management
export async function POST(request) {
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    // Start transaction
    await connection.beginTransaction();

    try {
      // Create laws_regs_types table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS laws_regs_types (
          id INT AUTO_INCREMENT PRIMARY KEY,
          type_name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_type_name (type_name)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // Create laws_regs_sections table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS laws_regs_sections (
          id INT AUTO_INCREMENT PRIMARY KEY,
          type_id INT NOT NULL,
          section_name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (type_id) REFERENCES laws_regs_types(id) ON DELETE CASCADE,
          INDEX idx_type_id (type_id),
          INDEX idx_section_name (section_name)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // Create laws_regs_files table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS laws_regs_files (
          id INT AUTO_INCREMENT PRIMARY KEY,
          section_id INT NOT NULL,
          files_path VARCHAR(500) NOT NULL,
          files_type VARCHAR(50) NOT NULL,
          original_name VARCHAR(255) NULL,
          file_size BIGINT NULL,
          description TEXT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (section_id) REFERENCES laws_regs_sections(id) ON DELETE CASCADE,
          INDEX idx_section_id (section_id),
          INDEX idx_files_type (files_type)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // Add new columns to existing table if they don't exist
      try {
        // Check if columns exist first
        const [columns] = await connection.execute(
          `
          SELECT COLUMN_NAME 
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'laws_regs_files'
        `,
          [process.env.DB_NAME || "gmsky_banphokorat"]
        );

        const existingColumns = columns.map((col) => col.COLUMN_NAME);
        const columnsToAdd = [];

        if (!existingColumns.includes("original_name")) {
          columnsToAdd.push("ADD COLUMN original_name VARCHAR(255) NULL");
        }
        if (!existingColumns.includes("file_size")) {
          columnsToAdd.push("ADD COLUMN file_size BIGINT NULL");
        }
        if (!existingColumns.includes("description")) {
          columnsToAdd.push("ADD COLUMN description TEXT NULL");
        }

        if (columnsToAdd.length > 0) {
          const alterQuery = `ALTER TABLE laws_regs_files ${columnsToAdd.join(
            ", "
          )}`;
          await connection.execute(alterQuery);
          console.log("Added columns:", columnsToAdd);
        }
      } catch (alterError) {
        console.log("Error adding columns:", alterError.message);
      }

      // Insert sample data for laws_regs_types
      await connection.execute(`
        INSERT IGNORE INTO laws_regs_types (id, type_name) VALUES
        (1, 'กฎหมายท้องถิ่น'),
        (2, 'ข้อบัญญัติท้องถิ่น'),
        (3, 'ระเบียบและคำสั่ง'),
        (4, 'ประกาศและคำสั่ง'),
        (5, 'มติคณะรัฐมนตรี'),
        (6, 'กฎกระทรวง'),
        (7, 'พระราชบัญญัติ'),
        (8, 'พระราชกำหนด')
      `);

      // Insert sample data for laws_regs_sections
      await connection.execute(`
        INSERT IGNORE INTO laws_regs_sections (id, type_id, section_name) VALUES
        (1, 1, 'กฎหมายการจัดเก็บภาษีท้องถิ่น'),
        (2, 1, 'กฎหมายการควบคุมอาคาร'),
        (3, 1, 'กฎหมายสิ่งแวดล้อม'),
        (4, 2, 'ข้อบัญญัติงบประมาณรายจ่าย'),
        (5, 2, 'ข้อบัญญัติภาษีป้าย'),
        (6, 2, 'ข้อบัญญัติค่าธรรมเนียม'),
        (7, 3, 'ระเบียบการเงินการคลัง'),
        (8, 3, 'ระเบียบงานบุคคล'),
        (9, 3, 'ระเบียบการจัดซื้อจัดจ้าง'),
        (10, 4, 'ประกาศรับสมัครงาน'),
        (11, 4, 'ประกาศผลการจัดซื้อจัดจ้าง'),
        (12, 5, 'มติคณะรัฐมนตรีเรื่องการกระจายอำนาจ'),
        (13, 6, 'กฎกระทรวงมหาดไทย'),
        (14, 7, 'พระราชบัญญัติสภาตำบลและองค์การบริหารส่วนตำบล'),
        (15, 8, 'พระราชกำหนดการบริหารราชการในสถานการณ์ฉุกเฉิน')
      `);

      // Insert sample data for laws_regs_files
      await connection.execute(`
        INSERT IGNORE INTO laws_regs_files (id, section_id, files_path, files_type) VALUES
        (1, 1, '/assets/documents/laws/local_tax_law.pdf', 'pdf'),
        (2, 1, '/assets/documents/laws/tax_collection_manual.pdf', 'pdf'),
        (3, 2, '/assets/documents/laws/building_control_act.pdf', 'pdf'),
        (4, 2, '/assets/documents/laws/building_permit_form.docx', 'docx'),
        (5, 3, '/assets/documents/laws/environmental_law.pdf', 'pdf'),
        (6, 4, '/assets/documents/laws/budget_ordinance_2567.pdf', 'pdf'),
        (7, 4, '/assets/documents/laws/budget_summary.xlsx', 'xlsx'),
        (8, 5, '/assets/documents/laws/signboard_tax_ordinance.pdf', 'pdf'),
        (9, 6, '/assets/documents/laws/fee_ordinance.pdf', 'pdf'),
        (10, 6, '/assets/documents/laws/fee_schedule.xlsx', 'xlsx'),
        (11, 7, '/assets/documents/laws/financial_regulation.pdf', 'pdf'),
        (12, 7, '/assets/documents/laws/accounting_manual.pdf', 'pdf'),
        (13, 8, '/assets/documents/laws/personnel_regulation.pdf', 'pdf'),
        (14, 9, '/assets/documents/laws/procurement_regulation.pdf', 'pdf'),
        (15, 9, '/assets/documents/laws/procurement_manual.docx', 'docx'),
        (16, 10, '/assets/documents/laws/job_announcement_2567.pdf', 'pdf'),
        (17, 11, '/assets/documents/laws/procurement_result_2567.pdf', 'pdf'),
        (18, 12, '/assets/documents/laws/cabinet_resolution_decentralization.pdf', 'pdf'),
        (19, 13, '/assets/documents/laws/ministry_interior_regulation.pdf', 'pdf'),
        (20, 14, '/assets/documents/laws/tambon_council_act.pdf', 'pdf'),
        (21, 15, '/assets/documents/laws/emergency_decree.pdf', 'pdf')
      `);

      // Commit transaction
      await connection.commit();

      return NextResponse.json(
        {
          success: true,
          message: "Laws & Regulations Management tables created successfully",
          tables: ["laws_regs_types", "laws_regs_sections", "laws_regs_files"],
        },
        { status: 201 }
      );
    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error(
      "Error creating Laws & Regulations Management tables:",
      error
    );
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create Laws & Regulations Management tables",
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

// GET /api/create-laws-regs-tables - ตรวจสอบสถานะตาราง
export async function GET(request) {
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    // Check if tables exist
    const tableNames = [
      "laws_regs_types",
      "laws_regs_sections",
      "laws_regs_files",
    ];
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

    // Get laws regs types with section and file counts
    let typesWithCounts = [];
    if (tablesExist.laws_regs_types) {
      const [types] = await connection.execute(`
        SELECT 
          lrt.*,
          (SELECT COUNT(*) FROM laws_regs_sections WHERE type_id = lrt.id) as sections_count,
          (SELECT COUNT(*) FROM laws_regs_files lrf 
           INNER JOIN laws_regs_sections lrs ON lrf.section_id = lrs.id 
           WHERE lrs.type_id = lrt.id) as files_count
        FROM laws_regs_types lrt
        ORDER BY lrt.created_at DESC
        LIMIT 10
      `);
      typesWithCounts = types;
    }

    return NextResponse.json({
      success: true,
      tablesExist,
      recordCounts,
      sampleData: typesWithCounts,
    });
  } catch (error) {
    console.error(
      "Error checking Laws & Regulations Management tables:",
      error
    );
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check Laws & Regulations Management tables",
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
