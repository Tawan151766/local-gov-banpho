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

export async function GET() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    
    // Test tables exist
    const [types] = await connection.execute('SELECT COUNT(*) as count FROM perf_results_types');
    const [sections] = await connection.execute('SELECT COUNT(*) as count FROM perf_results_sections');

    return NextResponse.json({
      success: true,
      message: 'Performance results tables test successful',
      data: {
        types_count: types[0].count,
        sections_count: sections[0].count,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Performance results test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Performance results test failed',
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

export async function POST() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);

    // Simple insert test
    const [result] = await connection.execute(
      'INSERT INTO perf_results_types (type_name, created_at, updated_at) VALUES (?, NOW(), NOW())',
      ['Test Type from API']
    );

    return NextResponse.json({
      success: true,
      message: 'Test performance results type created',
      data: {
        id: result.insertId,
        type_name: 'Test Type from API'
      }
    });

  } catch (error) {
    console.error('Performance results create test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Performance results create test failed',
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