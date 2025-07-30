import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const post = await prisma.post_details.findUnique({
      where: {
        id: BigInt(id)
      },
      include: {
        post_types: true,
        post_pdfs: true,
        post_photos: true,
        post_videos: true
      }
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Convert BigInt to string for JSON serialization
    const serializedPost = {
      ...post,
      id: post.id.toString(),
      post_type_id: post.post_type_id?.toString(),
      post_pdfs: post.post_pdfs.map(pdf => ({
        ...pdf,
        id: pdf.id.toString(),
        post_detail_id: pdf.post_detail_id.toString()
      })),
      post_photos: post.post_photos.map(photo => ({
        ...photo,
        id: photo.id.toString(),
        post_detail_id: photo.post_detail_id.toString()
      })),
      post_videos: post.post_videos.map(video => ({
        ...video,
        id: video.id.toString(),
        post_detail_id: video.post_detail_id.toString()
      }))
    };

    return NextResponse.json({
      success: true,
      data: serializedPost
    });

  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch post' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const { title_name, topic_name, details, date, post_type_id } = body;

    const updatedPost = await prisma.post_details.update({
      where: {
        id: BigInt(id)
      },
      data: {
        title_name,
        topic_name,
        details,
        date: date ? new Date(date) : null,
        post_type_id: post_type_id ? BigInt(post_type_id) : null
      },
      include: {
        post_types: true,
        post_pdfs: true,
        post_photos: true
      }
    });

    // Convert BigInt to string for JSON serialization
    const serializedPost = {
      ...updatedPost,
      id: updatedPost.id.toString(),
      post_type_id: updatedPost.post_type_id?.toString()
    };

    return NextResponse.json({
      success: true,
      data: serializedPost
    });

  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update post' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await prisma.post_details.delete({
      where: {
        id: BigInt(id)
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete post' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}