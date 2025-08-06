import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { post_detail_id, post_photo_file, post_photo_status = 'active' } = await request.json();

    console.log('Received photo data:', { post_detail_id, post_photo_file, post_photo_status });

    // Validate required fields
    if (!post_detail_id || !post_photo_file) {
      return NextResponse.json(
        { 
          success: false, 
          error: "post_detail_id และ post_photo_file จำเป็นต้องระบุ" 
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

    // Create new post_photo record
    const postPhoto = await prisma.post_photos.create({
      data: {
        post_detail_id: parseInt(post_detail_id),
        post_photo_file: post_photo_file,
        post_photo_status: post_photo_status?.toString() || "1", // Convert to string
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    console.log('Created post_photo:', postPhoto);

    return NextResponse.json({
      success: true,
      message: "เพิ่มรูปภาพสำเร็จ",
      data: {
        id: Number(postPhoto.id),
        post_detail_id: Number(postPhoto.post_detail_id),
        post_photo_file: postPhoto.post_photo_file,
        post_photo_status: postPhoto.post_photo_status,
        created_at: postPhoto.created_at,
        updated_at: postPhoto.updated_at
      }
    });

  } catch (error) {
    console.error("Post photo creation error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: `เกิดข้อผิดพลาดในการสร้างรูปภาพ: ${error.message}` 
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

    // Get all photo files for a specific post
    const postPhotos = await prisma.post_photos.findMany({
      where: {
        post_detail_id: parseInt(postDetailId)
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // Convert BigInt to Number for JSON serialization
    const serializedPostPhotos = postPhotos.map(photo => ({
      id: Number(photo.id),
      post_detail_id: Number(photo.post_detail_id),
      post_photo_file: photo.post_photo_file,
      post_photo_status: photo.post_photo_status,
      created_at: photo.created_at,
      updated_at: photo.updated_at
    }));

    return NextResponse.json({
      success: true,
      data: serializedPostPhotos,
      count: postPhotos.length
    });

  } catch (error) {
    console.error("Get post photos error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: `เกิดข้อผิดพลาดในการดึงข้อมูลรูปภาพ: ${error.message}` 
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

    // Check if post_photo exists
    const postPhoto = await prisma.post_photos.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!postPhoto) {
      return NextResponse.json(
        { 
          success: false, 
          error: "ไม่พบรูปภาพที่ระบุ" 
        },
        { status: 404 }
      );
    }

    // Delete the post_photo record
    await prisma.post_photos.delete({
      where: {
        id: parseInt(id)
      }
    });

    return NextResponse.json({
      success: true,
      message: "ลบรูปภาพสำเร็จ",
      data: {
        id: Number(postPhoto.id),
        post_photo_file: postPhoto.post_photo_file
      }
    });

  } catch (error) {
    console.error("Delete post photo error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: `เกิดข้อผิดพลาดในการลบรูปภาพ: ${error.message}` 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const { post_photo_status } = await request.json();

    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: "id จำเป็นต้องระบุ" 
        },
        { status: 400 }
      );
    }

    // Check if post_photo exists
    const existingPhoto = await prisma.post_photos.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!existingPhoto) {
      return NextResponse.json(
        { 
          success: false, 
          error: "ไม่พบรูปภาพที่ระบุ" 
        },
        { status: 404 }
      );
    }

    // Update post_photo status
    const updatedPhoto = await prisma.post_photos.update({
      where: {
        id: parseInt(id)
      },
      data: {
        post_photo_status: (post_photo_status || existingPhoto.post_photo_status)?.toString(),
        updated_at: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: "อัพเดทรูปภาพสำเร็จ",
      data: {
        id: Number(updatedPhoto.id),
        post_detail_id: Number(updatedPhoto.post_detail_id),
        post_photo_file: updatedPhoto.post_photo_file,
        post_photo_status: updatedPhoto.post_photo_status,
        created_at: updatedPhoto.created_at,
        updated_at: updatedPhoto.updated_at
      }
    });

  } catch (error) {
    console.error("Update post photo error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: `เกิดข้อผิดพลาดในการอัพเดทรูปภาพ: ${error.message}` 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
