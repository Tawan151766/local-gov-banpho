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

    console.log('Checking current table structure...');

    // Check current table structure
    const [tableInfo] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_COMMENT 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'local_dev_plan_files'
      ORDER BY ORDINAL_POSITION
    `, [dbConfig.database]);

    console.log('Current table structure:', tableInfo);

    // Check if required columns exist
    const hasOriginalName = tableInfo.some(col => col.COLUMN_NAME === 'original_name');
    const hasFileSize = tableInfo.some(col => col.COLUMN_NAME === 'file_size');
    const hasDescription = tableInfo.some(col => col.COLUMN_NAME === 'description');

    const missingColumns = [];
    if (!hasOriginalName) missingColumns.push('original_name');
    if (!hasFileSize) missingColumns.push('file_size');
    if (!hasDescription) missingColumns.push('description');

    if (missingColumns.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All required columns already exist',
        tableStructure: tableInfo
      });
    }

    console.log('Missing columns:', missingColumns);

    // Add missing columns one by one
    const alterQueries = [];

    if (!hasOriginalName) {
      alterQueries.push({
        query: `ALTER TABLE local_dev_plan_files ADD COLUMN original_name VARCHAR(255) COMMENT 'ชื่อไฟล์เดิม' AFTER files_type`,
        description: 'Added original_name column'
      });
    }

    if (!hasFileSize) {
      alterQueries.push({
        query: `ALTER TABLE local_dev_plan_files ADD COLUMN file_size BIGINT COMMENT 'ขนาดไฟล์ (bytes)' AFTER ${hasOriginalName ? 'original_name' : 'files_type'}`,
        description: 'Added file_size column'
      });
    }

    if (!hasDescription) {
      alterQueries.push({
        query: `ALTER TABLE local_dev_plan_files ADD COLUMN description TEXT COMMENT 'คำอธิบายไฟล์' AFTER ${hasFileSize || hasOriginalName ? (hasFileSize ? 'file_size' : 'original_name') : 'files_type'}`,
        description: 'Added description column'
      });
    }

    const results = [];

    // Execute alter queries
    for (const {query, description} of alterQueries) {
      try {
        console.log('Executing:', query);
        await connection.execute(query);
        results.push({ success: true, description, query });
        console.log('Success:', description);
      } catch (error) {
        console.error('Error executing query:', error.message);
        results.push({ success: false, description, query, error: error.message });
      }
    }

    // Get final table structure
    const [finalTableInfo] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_COMMENT 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'local_dev_plan_files'
      ORDER BY ORDINAL_POSITION
    `, [dbConfig.database]);

    console.log('Final table structure:', finalTableInfo);

    return NextResponse.json({
      success: true,
      message: 'Database schema updated successfully',
      missingColumns,
      results,
      finalTableStructure: finalTableInfo
    });

  } catch (error) {
    console.error('Error updating database schema:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update database schema',
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

// GET - Check current table structure
export async function GET() {
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    // Get current table structure
    const [tableInfo] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_COMMENT 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'local_dev_plan_files'
      ORDER BY ORDINAL_POSITION
    `, [dbConfig.database]);

    // Check if required columns exist
    const hasOriginalName = tableInfo.some(col => col.COLUMN_NAME === 'original_name');
    const hasFileSize = tableInfo.some(col => col.COLUMN_NAME === 'file_size');
    const hasDescription = tableInfo.some(col => col.COLUMN_NAME === 'description');

    const status = {
      hasOriginalName,
      hasFileSize,
      hasDescription,
      allColumnsExist: hasOriginalName && hasFileSize && hasDescription
    };

    return NextResponse.json({
      success: true,
      message: 'Current table structure retrieved',
      status,
      tableStructure: tableInfo
    });

  } catch (error) {
    console.error('Error checking table structure:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check table structure',
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