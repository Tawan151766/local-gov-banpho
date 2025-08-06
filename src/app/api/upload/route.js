import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type - allow images, PDFs, and documents
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only images, PDF, and Office documents are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max for documents, 5MB for images)
    const maxSize = file.type.startsWith('image/') ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      const maxSizeMB = file.type.startsWith('image/') ? '5MB' : '10MB';
      return NextResponse.json(
        { success: false, error: `File size too large. Maximum ${maxSizeMB} allowed.` },
        { status: 400 }
      );
    }

    // Determine upload directory based on file type
    let uploadSubDir = 'documents';
    if (file.type.startsWith('image/')) {
      uploadSubDir = 'images';
    } else if (file.type === 'application/pdf') {
      uploadSubDir = 'pdfs';
    }

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'e-service', uploadSubDir);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const fileExtension = path.extname(file.name);
    const uniqueFilename = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Return the public URL
    const publicUrl = `/uploads/e-service/${uploadSubDir}/${uniqueFilename}`;

    return NextResponse.json({
      success: true,
      data: {
        filename: uniqueFilename,
        url: publicUrl,
        path: publicUrl, // For backward compatibility
        size: file.size,
        type: file.type,
        originalName: file.name
      },
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload file', details: error.message },
      { status: 500 }
    );
  }
}