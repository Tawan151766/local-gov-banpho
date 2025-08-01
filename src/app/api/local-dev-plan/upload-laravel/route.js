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
      'SELECT id, type_name FROM local_dev_plan_types WHERE id = ?',
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
    // Laravel returns: {"success": true, "filename": "timestamp_test.jpg", "url": "http://<server>/storage/uploads/filename"}
    let filePath = '';
    let laravelUrl = '';
    
    if (laravelResult.url) {
      laravelUrl = laravelResult.url;
      
      // Extract path from URL
      // Example: http://<server>/storage/uploads/filename -> /storage/uploads/filename
      const urlObj = new URL(laravelResult.url);
      filePath = urlObj.pathname;
      
      console.log('Laravel URL:', laravelUrl);
      console.log('Extracted file path:', filePath);
    } else {
      throw new Error('No URL returned from Laravel API');
    }

    // Determine file type from Laravel generated filename (ใช้ชื่อไฟล์ใหม่)
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

    // ใช้ชื่อไฟล์ใหม่จาก Laravel (filename) แทนชื่อเดิม (file.name)
    const fileType = getFileType(laravelResult.filename);

    // Save file information to database - บันทึกแค่ครั้งเดียว
    const [result] = await connection.execute(
      `INSERT INTO local_dev_plan_files 
       (type_id, files_path, files_type, original_name, file_size, description) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        typeId, 
        filePath,                        // /storage/uploads/timestamp_filename
        fileType,                        // ประเภทไฟล์จากชื่อไฟล์ใหม่
        laravelResult.filename,          // ชื่อไฟล์ใหม่จาก Laravel (timestamp_filename)
        file.size,                       // ขนาดไฟล์
        description
      ]
    );

    return NextResponse.json({
      success: true,
      data: {
        id: result.insertId,
        original_name: laravelResult.filename,    // ชื่อไฟล์ใหม่ที่ Laravel generate
        filename: laravelResult.filename,         // ชื่อไฟล์ที่ Laravel generate
        file_path: filePath,                      // path ที่บันทึกใน DB
        full_url: laravelUrl,                     // URL เต็มจาก Laravel
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
       FROM local_dev_plan_files f
       LEFT JOIN local_dev_plan_types t ON f.type_id = t.id
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
        file_path: file.files_path,        // path ที่เก็บใน DB เช่น /pdf/sssss.pdf
        full_url: fullUrl,                 // URL เต็มสำหรับเข้าถึง
        download_url: fullUrl,             // URL สำหรับดาวน์โหลด
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