import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build where clause
    const where = {};
    
    if (type) {
      where.post_types = {
        is: {
          type_name: {
            contains: type
          }
        }
      };
    }

    if (search) {
      where.OR = [
        { title_name: { contains: search } },
        { topic_name: { contains: search } },
        { details: { contains: search } }
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.post_details.findMany({
        where,
        include: {
          post_types: true,
          post_pdfs: true,
          post_photos: true,
          post_videos: true
        },
        orderBy: {
          date: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.post_details.count({ where })
    ]);

    // Convert BigInt to string for JSON serialization
    const serializedPosts = posts.map(post => ({
      ...post,
      id: post.id.toString(),
      post_type_id: post.post_type_id?.toString()
    }));

    return NextResponse.json({
      success: true,
      data: serializedPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch posts' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title_name, topic_name, details, date, post_type_id } = body;

    if (!title_name || !post_type_id) {
      return NextResponse.json(
        { success: false, error: 'Title and post type are required' },
        { status: 400 }
      );
    }

    const newPost = await prisma.post_details.create({
      data: {
        title_name,
        topic_name,
        details,
        date: date ? new Date(date) : new Date(),
        post_type_id: BigInt(post_type_id)
      },
      include: {
        post_types: true
      }
    });

    // Convert BigInt to string for JSON serialization
    const serializedPost = {
      ...newPost,
      id: newPost.id.toString(),
      post_type_id: newPost.post_type_id?.toString()
    };

    return NextResponse.json({
      success: true,
      data: serializedPost
    });

  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create post' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}