import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 4;
    const type = searchParams.get('type') || 'procurement';

    // Get procurement-related posts
    const posts = await prisma.post_details.findMany({
      include: {
        post_types: true,
        post_pdfs: true,
        post_photos: true
      },
      where: {
        post_types: {
          type_name: {
            contains: type
          }
        }
      },
      orderBy: {
        date: 'desc'
      },
      take: limit
    });

    return NextResponse.json({
      success: true,
      data: posts
    });

  } catch (error) {
    console.error('Error fetching procurement posts:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch procurement posts' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}