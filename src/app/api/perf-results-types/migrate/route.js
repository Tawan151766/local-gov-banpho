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

export async function POST() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);

    // Create perf_results_types table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS perf_results_types (
        id INT PRIMARY KEY AUTO_INCREMENT,
        type_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create perf_results_sections table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS perf_results_sections (
        id INT PRIMARY KEY AUTO_INCREMENT,
        type_id INT NOT NULL,
        section_name VARCHAR(255) NOT NULL,
        date DATETIME NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (type_id) REFERENCES perf_results_types(id) ON DELETE CASCADE
      )
    `);

    // Create perf_results_sub_topics table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS perf_results_sub_topics (
        id INT PRIMARY KEY AUTO_INCREMENT,
        section_id INT NOT NULL,
        topic_name VARCHAR(255) NOT NULL,
        date DATETIME NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (section_id) REFERENCES perf_results_sections(id) ON DELETE CASCADE
      )
    `);

    // Create perf_results_files table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS perf_results_files (
        id INT PRIMARY KEY AUTO_INCREMENT,
        sub_topic_id INT NOT NULL,
        files_path VARCHAR(500) NOT NULL,
        files_type VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (sub_topic_id) REFERENCES perf_results_sub_topics(id) ON DELETE CASCADE
      )
    `);

    return NextResponse.json({
      success: true,
      message: 'All performance results tables created successfully',
      tables: [
        'perf_results_types',
        'perf_results_sections', 
        'perf_results_sub_topics',
        'perf_results_files'
      ]
    });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create performance results tables',
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