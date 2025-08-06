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

// POST - Add missing columns to laws_regs_files table
export async function POST(request) {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);

    // Check if columns exist first
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'laws_regs_files'
    `, [process.env.DB_NAME || 'gmsky_banphokorat']);

    const existingColumns = columns.map(col => col.COLUMN_NAME);
    const columnsToAdd = [];

    // Check which columns need to be added
    if (!existingColumns.includes('original_name')) {
      columnsToAdd.push('ADD COLUMN original_name VARCHAR(255) NULL');
    }
    if (!existingColumns.includes('file_size')) {
      columnsToAdd.push('ADD COLUMN file_size BIGINT NULL');
    }
    if (!existingColumns.includes('description')) {
      columnsToAdd.push('ADD COLUMN description TEXT NULL');
    }

    if (columnsToAdd.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All columns already exist',
        existingColumns
      });
    }

    // Add missing columns
    const alterQuery = `ALTER TABLE laws_regs_files ${columnsToAdd.join(', ')}`;
    console.log('Executing ALTER TABLE:', alterQuery);
    
    await connection.execute(alterQuery);

    // Verify columns were added
    const [newColumns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'laws_regs_files'
    `, [process.env.DB_NAME || 'gmsky_banphokorat']);

    return NextResponse.json({
      success: true,
      message: 'Columns added successfully',
      addedColumns: columnsToAdd,
      allColumns: newColumns.map(col => col.COLUMN_NAME)
    });

  } catch (error) {
    console.error('Error adding columns:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to add columns',
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
export async function GET(request) {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);

    // Get current table structure
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'laws_regs_files'
      ORDER BY ORDINAL_POSITION
    `, [process.env.DB_NAME || 'gmsky_banphokorat']);

    return NextResponse.json({
      success: true,
      tableName: 'laws_regs_files',
      columns: columns
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