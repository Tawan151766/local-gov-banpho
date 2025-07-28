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

// POST /api/create-ita-tables - สร้างตาราง ITA
export async function POST(request) {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);

    // Start transaction
    await connection.beginTransaction();

    try {
      // Create ita_evaluations table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS ita_evaluations (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          ita_date DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          deleted_at TIMESTAMP NULL DEFAULT NULL,
          INDEX idx_name (name),
          INDEX idx_ita_date (ita_date),
          INDEX idx_deleted_at (deleted_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // Create ita_contents table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS ita_contents (
          id INT AUTO_INCREMENT PRIMARY KEY,
          url TEXT NOT NULL,
          description TEXT,
          evaluation_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          deleted_at TIMESTAMP NULL DEFAULT NULL,
          FOREIGN KEY (evaluation_id) REFERENCES ita_evaluations(id) ON DELETE CASCADE,
          INDEX idx_evaluation_id (evaluation_id),
          INDEX idx_deleted_at (deleted_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);

      // Insert sample data for ita_evaluations
      await connection.execute(`
        INSERT IGNORE INTO ita_evaluations (id, name, description, ita_date) VALUES
        (1, 'การประเมิน ITA ประจำปี 2567', 'การประเมินความโปร่งใสในการดำเนินงานของหน่วยงานภาครัฐ ประจำปี 2567', '2024-12-31'),
        (2, 'การประเมิน ITA ไตรมาส 1/2567', 'การประเมินความโปร่งใสในการดำเนินงาน ไตรมาสที่ 1 ปี 2567', '2024-03-31'),
        (3, 'การประเมิน ITA ไตรมาส 2/2567', 'การประเมินความโปร่งใสในการดำเนินงาน ไตรมาสที่ 2 ปี 2567', '2024-06-30')
      `);

      // Insert sample data for ita_contents
      await connection.execute(`
        INSERT IGNORE INTO ita_contents (id, url, description, evaluation_id) VALUES
        (1, 'https://example.com/ita-2567-report.pdf', 'รายงานผลการประเมิน ITA ประจำปี 2567', 1),
        (2, 'https://example.com/ita-2567-summary.pdf', 'สรุปผลการประเมิน ITA ประจำปี 2567', 1),
        (3, 'https://example.com/ita-q1-2567.pdf', 'รายงานผลการประเมิน ITA ไตรมาส 1/2567', 2),
        (4, 'https://example.com/ita-q2-2567.pdf', 'รายงานผลการประเมิน ITA ไตรมาส 2/2567', 3),
        (5, 'https://example.com/ita-improvement-plan.pdf', 'แผนการปรับปรุงตามผลการประเมิน ITA', 1)
      `);

      // Commit transaction
      await connection.commit();

      return NextResponse.json({
        success: true,
        message: 'ITA tables created successfully',
        tables: ['ita_evaluations', 'ita_contents']
      }, { status: 201 });

    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Error creating ITA tables:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create ITA tables', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// GET /api/create-ita-tables - ตรวจสอบสถานะตาราง
export async function GET(request) {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);

    // Check if tables exist
    const [evaluationsTable] = await connection.execute(`
      SELECT COUNT(*) as count FROM information_schema.tables 
      WHERE table_schema = 'gmsky_banphokorat' AND table_name = 'ita_evaluations'
    `);

    const [contentsTable] = await connection.execute(`
      SELECT COUNT(*) as count FROM information_schema.tables 
      WHERE table_schema = 'gmsky_banphokorat' AND table_name = 'ita_contents'
    `);

    const tablesExist = {
      ita_evaluations: evaluationsTable[0].count > 0,
      ita_contents: contentsTable[0].count > 0
    };

    // Get record counts if tables exist
    let recordCounts = {};
    if (tablesExist.ita_evaluations) {
      const [evalCount] = await connection.execute('SELECT COUNT(*) as count FROM ita_evaluations WHERE deleted_at IS NULL');
      recordCounts.ita_evaluations = evalCount[0].count;
    }

    if (tablesExist.ita_contents) {
      const [contentCount] = await connection.execute('SELECT COUNT(*) as count FROM ita_contents WHERE deleted_at IS NULL');
      recordCounts.ita_contents = contentCount[0].count;
    }

    return NextResponse.json({
      success: true,
      tablesExist,
      recordCounts
    });

  } catch (error) {
    console.error('Error checking ITA tables:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check ITA tables', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}