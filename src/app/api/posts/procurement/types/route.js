import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get all post types related to procurement
    const procurementTypes = await prisma.post_types.findMany({
      where: {
        OR: [
          { type_name: { contains: 'จัดซื้อ' } },
          { type_name: { contains: 'จัดจ้าง' } },
          { type_name: { contains: 'ประกาศ' } },
          { type_name: { contains: 'EGP' } }
        ]
      },
      include: {
        _count: {
          select: {
            post_details: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: procurementTypes
    });

  } catch (error) {
    console.error('Error fetching procurement types:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch procurement types' 
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
    const { type_name } = body;

    if (!type_name) {
      return NextResponse.json(
        { success: false, error: 'Type name is required' },
        { status: 400 }
      );
    }

    const newType = await prisma.post_types.create({
      data: {
        type_name
      }
    });

    return NextResponse.json({
      success: true,
      data: newType
    });

  } catch (error) {
    console.error('Error creating procurement type:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create procurement type' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}