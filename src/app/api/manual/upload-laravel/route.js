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

// Laravel API configuration
const LARAVEL_API_URL = "https://banpho.sosmartsolution.com/api/upload-file";
const LARAVEL_BASE_URL = "https://banpho.sosmartsolution.com";

export async function POST(request) {
  let connection;

  try {
    console.log('🚀 API /manual/upload-laravel called at:', new Date().toISOString());
    
    const formData = await request.formData();
    const file = formData.get("file");
    const manualId = formData.get("manual_id");
    const description = formData.get("description") || "";

    console.log('📁 File details:', {
      name: file?.name,
      size: file?.size,
      type: file?.type,
      manualId,
      description
    });

    // Validation
    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Connect to database
    connection = await mysql.createConnection(dbConfig);

    // If manualId is provided, verify it exists
    if (manualId) {
      const [manualExists] = await connection.execute(
        "SELECT id, title FROM manual_items WHERE id = ?",
        [manualId]
      );

      if (manualExists.length === 0) {
        return NextResponse.json(
          { success: false, error: "Invalid manual ID" },
          { status: 400 }
        );
      }
    }

    // Prepare FormData for Laravel API
    const laravelFormData = new FormData();
    laravelFormData.append("file", file);

    // Upload file to Laravel API
    console.log("Uploading to Laravel API:", LARAVEL_API_URL);

    const laravelResponse = await fetch(LARAVEL_API_URL, {
      method: "POST",
      body: laravelFormData,
    });

    const laravelResult = await laravelResponse.json();
    console.log("Laravel API Response:", laravelResult);

    if (!laravelResponse.ok || !laravelResult.success) {
      throw new Error(laravelResult.message || "Laravel upload failed");
    }

    // Extract path from Laravel URL
    let filePath = "";
    let laravelUrl = "";

    if (laravelResult.url) {
      laravelUrl = laravelResult.url;
      // Extract path from URL and remove /storage
      const urlObj = new URL(laravelResult.url);
  filePath = decodeURIComponent(urlObj.pathname.replace('/storage', ''));
      console.log("Laravel URL:", laravelUrl);
      console.log("Extracted file path:", filePath);
    } else {
      throw new Error("No URL returned from Laravel API");
    }

    // Determine file type from Laravel generated filename
    const getFileType = (fileName) => {
      const extension = fileName.split(".").pop().toLowerCase();
      switch (extension) {
        case "pdf": return "pdf";
        case "doc": return "doc";
        case "docx": return "docx";
        case "xls": return "xls";
        case "xlsx": return "xlsx";
        case "ppt": return "ppt";
        case "pptx": return "pptx";
        case "txt": return "txt";
        case "jpg":
        case "jpeg": return "jpg";
        case "png": return "png";
        case "gif": return "gif";
        case "webp": return "webp";
        default: return "other";
      }
    };

    const fileType = getFileType(laravelResult.filename);

    // If manualId is provided, save to manual_files table
    let fileId = null;
    if (manualId) {
      console.log('💾 Saving to manual_files table:', {
        manualId,
        filePath,
        fileType,
        originalName: laravelResult.filename,
        fileSize: file.size,
        description
      });
      
      const [result] = await connection.execute(
        `INSERT INTO manual_files 
         (manual_id, files_path, files_type, original_name, file_size, description) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          manualId,
          filePath,
          fileType,
          laravelResult.filename,
          file.size,
          description,
        ]
      );
      
      fileId = result.insertId;
      console.log('✅ Database insert successful, ID:', fileId);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: fileId,
        original_name: laravelResult.filename,
        filename: laravelResult.filename,
        file_path: filePath,
        full_url: laravelUrl,
        size: file.size,
        file_type: fileType,
        description: description,
        manual_id: manualId,
        laravel_response: {
          success: laravelResult.success,
          filename: laravelResult.filename,
          url: laravelResult.url,
        },
      },
      message: "File uploaded to Laravel successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload file",
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