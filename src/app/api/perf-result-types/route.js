import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: '103.80.48.25',
  port: 3306,
  user: 'gmsky_banphokorat',
  password: 'banphokorat56789',
  database: 'gmsky_banphokorat'
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
