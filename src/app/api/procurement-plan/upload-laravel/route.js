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

// Laravel API configuration
const LARAVEL_API_URL = 'https://banpho.sosmartsolution.com/api/upload-file';
const LARAVEL_BASE_URL = 'https://banpho.sosmartsolution.com';

export async function POST(request) {
  let connection;
  
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const typeId = formData.get('type_id');
    const description = formData.get('description') || '';

    // Validation
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    if (!typeId) {
      return NextResponse.json(
        { success: false, error: 'Type ID is required' },
        { status: 400 }
      );
    }

    // Connect to database and verify type exists
    connection = await mysql.createConnection(dbConfig);
    
    const [typeExists] = await connection.execute(
      'SELECT id, type_name FROM procurement_plan_types WHERE id = ?',
      [typeId]
    );

    if (typeExists.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid type ID' },
        { status: 400 }
      );
    }

    // Prepare FormData for Laravel API
    const laravelFormData = new FormData();
    laravelFormData.append('file', file);

    // Upload file to Laravel API
    console.log('Uploading to Laravel API:', LARAVEL_API_URL);
    
    const laravelResponse = await fetch(LARAVEL_API_URL, {
      method: 'POST',
      body: laravelFormData,
    });

    const laravelResult = await laravelResponse.json();
    console.log('Laravel API Response:', laravelResult);

    if (!laravelResponse.ok || !laravelResult.success) {
      throw new Error(laravelResult.message || 'Laravel upload failed');
    }

    // Extract path from Laravel URL
    let filePath = '';
    let laravelUrl = '';
    
    if (laravelResult.url) {
      laravelUrl = laravelResult.url;
      
      // Extract path from URL
      const urlObj = new URL(laravelResult.url);
      filePath = urlObj.pathname;
      
      console.log('Laravel URL:', laravelUrl);
      console.log('Extracted file path:', filePath);
    } else {
      throw new Error('No URL returned from Laravel API');
    }

    // Determine file type from Laravel generated filename
    const getFileType = (fileName) => {
      const extension = fileName.split('.').pop().toLowerCase();
      
      switch (extension) {
        case 'pdf': return 'pdf';
        case 'doc': return 'doc';
        case 'docx': return 'docx';
        case 'xls': return 'xls';
        case 'xlsx': return 'xlsx';
        case 'txt': return 'txt';
        case 'jpg':
        case 'jpeg': return 'jpg';
        case 'png': return 'png';
        case 'gif': return 'gif';
        case 'webp': return 'webp';
        case 'mp4': return 'mp4';
        default: return 'other';
      }
    };

    const fileType = getFileType(laravelResult.filename);

    // Check if new columns exist in the table
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'procurement_plan_files'
    `, [process.env.DB_NAME || 'gmsky_banphokorat']);

    const existingColumns = columns.map(col => col.COLUMN_NAME);
    const hasNewColumns = existingColumns.includes('original_name') && 
                         existingColumns.includes('file_size') && 
                         existingColumns.includes('description');

    let result;
    if (hasNewColumns) {
      // Use new schema with all columns
      [result] = await connection.execute(
        `INSERT INTO procurement_plan_files 
         (type_id, files_path, files_type, original_name, file_size, description) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          typeId, 
          filePath,
          fileType,
          laravelResult.filename,
          file.size,
          description
        ]
      );
    } else {
      // Use old schema without new columns
      [result] = await connection.execute(
        `INSERT INTO procurement_plan_files 
         (type_id, files_path, files_type) 
         VALUES (?, ?, ?)`,
        [
          typeId, 
          filePath,
          fileType
        ]
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: result.insertId,
        original_name: laravelResult.filename,
        filename: laravelResult.filename,
        file_path: filePath,
        full_url: laravelUrl,
        size: file.size,
        file_type: fileType,
        type_name: typeExists[0].type_name,
        description: description,
        laravel_response: {
          success: laravelResult.success,
          filename: laravelResult.filename,
          url: laravelResult.url
        }
      },
      message: 'File uploaded to Laravel and saved to database successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to upload file',
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

// GET - ดึงข้อมูลไฟล์และสร้าง full URL สำหรับดาวน์โหลด
export async function GET(request) {
  let connection;
  
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('id');

    if (!fileId) {
      return NextResponse.json(
        { success: false, error: 'File ID is required' },
        { status: 400 }
      );
    }

    // Get file information from database
    connection = await mysql.createConnection(dbConfig);
    
    const [fileRecord] = await connection.execute(
      `SELECT 
         f.*,
         t.type_name
       FROM procurement_plan_files f
       LEFT JOIN procurement_plan_types t ON f.type_id = t.id
       WHERE f.id = ?`,
      [fileId]
    );

    if (fileRecord.length === 0) {
      return NextResponse.json(
        { success: false, error: 'File not found' },
        { status: 404 }
      );
    }

    const file = fileRecord[0];
    
    let fullUrl = '';
    if (file.files_path.startsWith('/storage/')) {
      // Laravel storage URL format
      fullUrl = file.files_path.replace('/storage/', `${LARAVEL_BASE_URL}/storage/`);
    } else if (file.files_path.startsWith('http')) {
      // Already full URL
      fullUrl = file.files_path;
    } else {
      // Fallback
      fullUrl = `${LARAVEL_BASE_URL}${file.files_path}`;
    }
    
    return NextResponse.json({
      success: true,
      data: {
        id: file.id,
        file_path: file.files_path,
        full_url: fullUrl,
        download_url: fullUrl,
        original_name: file.original_name,
        file_type: file.files_type,
        file_size: file.file_size,
        type_name: file.type_name,
        description: file.description,
        created_at: file.created_at
      }
    });

  } catch (error) {
    console.error('Get file error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get file information',
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