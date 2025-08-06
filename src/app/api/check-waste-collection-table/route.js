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

export async function GET() {
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    // Check if table exists
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'waste_collection_requests'"
    );

    if (tables.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Table waste_collection_requests does not exist",
      });
    }

    // Get table structure
    const [columns] = await connection.execute(
      "DESCRIBE waste_collection_requests"
    );

    // Get table data count
    const [countResult] = await connection.execute(
      "SELECT COUNT(*) as total FROM waste_collection_requests"
    );

    // Get sample data (first 3 records)
    const [sampleData] = await connection.execute(
      "SELECT * FROM waste_collection_requests ORDER BY created_at DESC LIMIT 3"
    );

    return NextResponse.json({
      success: true,
      tableExists: true,
      totalRecords: countResult[0]?.total || 0,
      columns: columns,
      sampleData: sampleData,
    });
  } catch (error) {
    console.error("Error checking waste collection table:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check waste collection table",
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
