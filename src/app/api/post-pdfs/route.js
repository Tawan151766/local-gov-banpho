import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { post_detail_id, post_pdf_file } = await request.json();

    console.log('Received data:', { post_detail_id, post_pdf_file });

    // Validate required fields
    if (!post_detail_id || !post_pdf_file) {
      return NextResponse.json(
        { 
          success: false, 
          error: "post_detail_id และ post_pdf_file จำเป็นต้องระบุ" 
        },
        { status: 400 }
      );
    }

    // Check if post_detail exists
    const postDetail = await prisma.post_details.findUnique({
      where: {
        id: parseInt(post_detail_id)
      }
    });

    if (!postDetail) {
      return NextResponse.json(
        { 
          success: false, 
          error: "ไม่พบโพสต์ที่ระบุ" 
        },
        { status: 404 }
      );
    }

    // Create new post_pdf record
    const postPdf = await prisma.post_pdfs.create({
      data: {
        post_detail_id: parseInt(post_detail_id),
        post_pdf_file: post_pdf_file,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    console.log('Created post_pdf:', postPdf);

    return NextResponse.json({
      success: true,
      message: "เพิ่มไฟล์ PDF สำเร็จ",
      data: {
        id: Number(postPdf.id),
        post_detail_id: Number(postPdf.post_detail_id),
        post_pdf_file: postPdf.post_pdf_file,
        created_at: postPdf.created_at,
        updated_at: postPdf.updated_at
      }
    });

  } catch (error) {
    console.error("Post PDF creation error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: `เกิดข้อผิดพลาดในการสร้างไฟล์ PDF: ${error.message}` 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const postDetailId = searchParams.get('post_detail_id');

    if (!postDetailId) {
      return NextResponse.json(
        { 
          success: false, 
          error: "post_detail_id จำเป็นต้องระบุ" 
        },
        { status: 400 }
      );
    }

    // Get all PDF files for a specific post
    const postPdfs = await prisma.post_pdfs.findMany({
      where: {
        post_detail_id: parseInt(postDetailId)
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // Convert BigInt to Number for JSON serialization
    const serializedPostPdfs = postPdfs.map(pdf => ({
      id: Number(pdf.id),
      post_detail_id: Number(pdf.post_detail_id),
      post_pdf_file: pdf.post_pdf_file,
      created_at: pdf.created_at,
      updated_at: pdf.updated_at
    }));

    return NextResponse.json({
      success: true,
      data: serializedPostPdfs,
      count: postPdfs.length
    });

  } catch (error) {
    console.error("Get post PDFs error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: `เกิดข้อผิดพลาดในการดึงข้อมูลไฟล์ PDF: ${error.message}` 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: "id จำเป็นต้องระบุ" 
        },
        { status: 400 }
      );
    }

    // Check if post_pdf exists
    const postPdf = await prisma.post_pdfs.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!postPdf) {
      return NextResponse.json(
        { 
          success: false, 
          error: "ไม่พบไฟล์ PDF ที่ระบุ" 
        },
        { status: 404 }
      );
    }

    // Delete the post_pdf record
    await prisma.post_pdfs.delete({
      where: {
        id: parseInt(id)
      }
    });

    return NextResponse.json({
      success: true,
      message: "ลบไฟล์ PDF สำเร็จ",
      data: {
        id: Number(postPdf.id),
        post_pdf_file: postPdf.post_pdf_file
      }
    });

  } catch (error) {
    console.error("Delete post PDF error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: `เกิดข้อผิดพลาดในการลบไฟล์ PDF: ${error.message}` 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
