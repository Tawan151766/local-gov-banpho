import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - ดึงข้อมูล system info ทั้งหมด หรือตาม key
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const active = searchParams.get('active');

    let whereClause = {};
    
    if (key) {
      whereClause.key = key;
    }
    
    if (active !== null) {
      whereClause.is_active = active === 'true';
    }

    const systemInfo = await prisma.systemInfo.findMany({
      where: whereClause,
      orderBy: {
        created_at: 'desc'
      }
    });

    // Convert BigInt to string for JSON serialization
    const serializedData = systemInfo.map(item => ({
      ...item,
      id: item.id.toString()
    }));

    return NextResponse.json({
      success: true,
      data: serializedData
    });

  } catch (error) {
    console.error('Error fetching system info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch system info' },
      { status: 500 }
    );
  }
}

// POST - เพิ่มข้อมูล system info ใหม่
export async function POST(request) {
  try {
    const body = await request.json();
    const { key, value, name, description, created_by } = body;

    if (!key || !value) {
      return NextResponse.json(
        { success: false, error: 'Key and value are required' },
        { status: 400 }
      );
    }

    // ตรวจสอบว่า key ซ้ำหรือไม่
    const existingInfo = await prisma.systemInfo.findUnique({
      where: { key }
    });

    if (existingInfo) {
      return NextResponse.json(
        { success: false, error: 'Key already exists' },
        { status: 400 }
      );
    }

    const systemInfo = await prisma.systemInfo.create({
      data: {
        key,
        value,
        name,
        description,
        created_by
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        ...systemInfo,
        id: systemInfo.id.toString()
      }
    });

  } catch (error) {
    console.error('Error creating system info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create system info' },
      { status: 500 }
    );
  }
}

// PUT - อัพเดทข้อมูล system info
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, key, value, name, description, is_active, updated_by } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    const updateData = {};
    if (key !== undefined) updateData.key = key;
    if (value !== undefined) updateData.value = value;
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (updated_by !== undefined) updateData.updated_by = updated_by;

    const systemInfo = await prisma.systemInfo.update({
      where: { id: BigInt(id) },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: {
        ...systemInfo,
        id: systemInfo.id.toString()
      }
    });

  } catch (error) {
    console.error('Error updating system info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update system info' },
      { status: 500 }
    );
  }
}

// DELETE - ลบข้อมูล system info
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }

    await prisma.systemInfo.delete({
      where: { id: BigInt(id) }
    });

    return NextResponse.json({
      success: true,
      message: 'System info deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting system info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete system info' },
      { status: 500 }
    );
  }
}