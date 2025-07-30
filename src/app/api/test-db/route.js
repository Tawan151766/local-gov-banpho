import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count();
    const postTypesCount = await prisma.post_types.count();
    const postsCount = await prisma.post_details.count();

    // Get sample data
    const samplePostTypes = await prisma.post_types.findMany({
      take: 5,
      include: {
        _count: {
          select: {
            post_details: true
          }
        }
      }
    });

    const samplePosts = await prisma.post_details.findMany({
      take: 3,
      include: {
        post_types: true,
        post_pdfs: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      stats: {
        users: userCount,
        postTypes: postTypesCount,
        posts: postsCount
      },
      sampleData: {
        postTypes: samplePostTypes,
        posts: samplePosts.map(post => ({
          ...post,
          id: post.id.toString(),
          post_type_id: post.post_type_id?.toString()
        }))
      }
    });

  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        details: 'Failed to connect to database'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST() {
  try {
    // Create sample procurement data
    const procurementTypes = [
      'ประกาศจัดซื้อจัดจ้าง',
      'ผลประกาศจัดซื้อจัดจ้าง', 
      'รายงานผลจัดซื้อจัดจ้าง',
      'ประกาศเชิญชวน'
    ];

    // Create post types if they don't exist
    const createdTypes = [];
    for (const typeName of procurementTypes) {
      const existingType = await prisma.post_types.findFirst({
        where: { type_name: typeName }
      });

      if (!existingType) {
        const newType = await prisma.post_types.create({
          data: { type_name: typeName }
        });
        createdTypes.push(newType);
      }
    }

    // Get all procurement types
    const allTypes = await prisma.post_types.findMany({
      where: {
        type_name: {
          in: procurementTypes
        }
      }
    });

    // Create sample posts
    const samplePosts = [
      {
        title_name: 'ประกาศจัดซื้อวัสดุสำนักงาน ประจำปี 2568',
        topic_name: 'จัดซื้อวัสดุสำนักงาน',
        details: 'องค์การบริหารส่วนตำบลบ้านโพธิ์ ประกาศจัดซื้อวัสดุสำนักงานต่างๆ เพื่อใช้ในการปฏิบัติงานประจำปี พ.ศ. 2568',
        date: new Date('2025-01-15'),
        post_type_id: allTypes.find(t => t.type_name === 'ประกาศจัดซื้อจัดจ้าง')?.id
      },
      {
        title_name: 'ผลการจัดจ้างก่อสร้างถนนคอนกรีต',
        topic_name: 'ก่อสร้างถนนคอนกรีต',
        details: 'ประกาศผลการจัดจ้างก่อสร้างถนนคอนกรีตเสริมเหล็ก หมู่ที่ 3 บ้านโพธิ์',
        date: new Date('2025-01-10'),
        post_type_id: allTypes.find(t => t.type_name === 'ผลประกาศจัดซื้อจัดจ้าง')?.id
      }
    ];

    const createdPosts = [];
    for (const postData of samplePosts) {
      if (postData.post_type_id) {
        const existingPost = await prisma.post_details.findFirst({
          where: { title_name: postData.title_name }
        });

        if (!existingPost) {
          const newPost = await prisma.post_details.create({
            data: postData,
            include: {
              post_types: true
            }
          });
          createdPosts.push(newPost);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Sample data created successfully',
      created: {
        types: createdTypes.length,
        posts: createdPosts.length
      },
      data: {
        types: allTypes,
        posts: createdPosts.map(post => ({
          ...post,
          id: post.id.toString(),
          post_type_id: post.post_type_id?.toString()
        }))
      }
    });

  } catch (error) {
    console.error('Error creating sample data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}