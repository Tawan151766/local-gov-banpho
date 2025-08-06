import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { post_detail_id, post_video_file } = await request.json();

    console.log('Received video data:', { post_detail_id, post_video_file });

    // Validate required fields
    if (!post_detail_id || !post_video_file) {
      return NextResponse.json(
        { 
          success: false, 
          error: "post_detail_id และ post_video_file จำเป็นต้องระบุ" 
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

    // Create new post_video record
    const postVideo = await prisma.post_videos.create({
      data: {
        post_detail_id: parseInt(post_detail_id),
        post_video_file: post_video_file,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    console.log('Created post_video:', postVideo);

    return NextResponse.json({
      success: true,
      message: "เพิ่มวิดีโอสำเร็จ",
      data: {
        id: Number(postVideo.id),
        post_detail_id: Number(postVideo.post_detail_id),
        post_video_file: postVideo.post_video_file,
        created_at: postVideo.created_at,
        updated_at: postVideo.updated_at
      }
    });

  } catch (error) {
    console.error("Post video creation error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: `เกิดข้อผิดพลาดในการสร้างวิดีโอ: ${error.message}` 
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

    // Get all video files for a specific post
    const postVideos = await prisma.post_videos.findMany({
      where: {
        post_detail_id: parseInt(postDetailId)
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // Convert BigInt to Number for JSON serialization
    const serializedPostVideos = postVideos.map(video => ({
      id: Number(video.id),
      post_detail_id: Number(video.post_detail_id),
      post_video_file: video.post_video_file,
      created_at: video.created_at,
      updated_at: video.updated_at
    }));

    return NextResponse.json({
      success: true,
      data: serializedPostVideos,
      count: postVideos.length
    });

  } catch (error) {
    console.error("Get post videos error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: `เกิดข้อผิดพลาดในการดึงข้อมูลวิดีโอ: ${error.message}` 
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

    // Check if post_video exists
    const postVideo = await prisma.post_videos.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!postVideo) {
      return NextResponse.json(
        { 
          success: false, 
          error: "ไม่พบวิดีโอที่ระบุ" 
        },
        { status: 404 }
      );
    }

    // Delete the post_video record
    await prisma.post_videos.delete({
      where: {
        id: parseInt(id)
      }
    });

    return NextResponse.json({
      success: true,
      message: "ลบวิดีโอสำเร็จ",
      data: {
        id: Number(postVideo.id),
        post_video_file: postVideo.post_video_file
      }
    });

  } catch (error) {
    console.error("Delete post video error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: `เกิดข้อผิดพลาดในการลบวิดีโอ: ${error.message}` 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
