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

export async function POST() {
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    // Create local_dev_plan_types table
    const createLocalDevPlanTypesTable = `
      CREATE TABLE IF NOT EXISTS local_dev_plan_types (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        type_name VARCHAR(255) NOT NULL COMMENT 'ชื่อประเภทแผนพัฒนาท้องถิ่น',
        
        -- Timestamps
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        -- Indexes
        INDEX idx_type_name (type_name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางประเภทแผนพัฒนาท้องถิ่น';
    `;

    // Create local_dev_plan_files table
    const createLocalDevPlanFilesTable = `
      CREATE TABLE IF NOT EXISTS local_dev_plan_files (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        type_id BIGINT UNSIGNED NOT NULL COMMENT 'รหัสประเภทแผนพัฒนา',
        files_path VARCHAR(255) NOT NULL COMMENT 'เส้นทางไฟล์',
        files_type VARCHAR(255) NOT NULL COMMENT 'ประเภทไฟล์',
        original_name VARCHAR(255) COMMENT 'ชื่อไฟล์เดิม',
        file_size BIGINT COMMENT 'ขนาดไฟล์ (bytes)',
        description TEXT COMMENT 'คำอธิบายไฟล์',
        
        -- Timestamps
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        -- Foreign Key
        FOREIGN KEY (type_id) REFERENCES local_dev_plan_types(id) 
        ON DELETE CASCADE ON UPDATE RESTRICT,
        
        -- Indexes
        INDEX idx_type_id (type_id),
        INDEX idx_files_type (files_type),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางไฟล์แผนพัฒนาท้องถิ่น';
    `;

    // Execute table creation
    await connection.execute(createLocalDevPlanTypesTable);
    await connection.execute(createLocalDevPlanFilesTable);

    // Insert sample data for local_dev_plan_types
    const insertSampleTypes = `
      INSERT IGNORE INTO local_dev_plan_types (id, type_name) VALUES
      (1, 'แผนพัฒนาท้องถิ่น 5 ปี'),
      (2, 'แผนปฏิบัติการประจำปี'),
      (3, 'แผนยุทธศาสตร์การพัฒนา'),
      (4, 'แผนชุมชน'),
      (5, 'แผนพัฒนาโครงสร้างพื้นฐาน'),
      (6, 'แผนพัฒนาเศรษฐกิจท้องถิ่น'),
      (7, 'แผนพัฒนาสังคมและคุณภาพชีวิต'),
      (8, 'แผนอนุรักษ์ทรัพยากรธรรมชาติและสิ่งแวดล้อม'),
      (9, 'แผนพัฒนาการศึกษาและการเรียนรู้'),
      (10, 'แผนป้องกันและบรรเทาสาธารณภัย');
    `;

    await connection.execute(insertSampleTypes);

    return NextResponse.json({
      success: true,
      message: 'Local development plan tables created successfully',
      tables: ['local_dev_plan_types', 'local_dev_plan_files'],
      sampleData: 'Sample types inserted successfully'
    });

  } catch (error) {
    console.error('Error creating local development plan tables:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create local development plan tables',
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