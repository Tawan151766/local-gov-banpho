import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

export async function GET(request) {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    // Get all types
    const [rows] = await connection.execute(
      `SELECT id, type_name, created_at, updated_at 
       FROM perf_results_types 
       ORDER BY id ASC`
    );

    return NextResponse.json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error('Error fetching perf result types:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch types', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
