import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - ดึงข้อมูลตาม key เฉพาะ
export async function GET(request, { params }) {
  try {
    const { key } = params;

    const systemInfo = await prisma.systemInfo.findUnique({
      where: { key }
    });

    if (!systemInfo) {
      return NextResponse.json(
        { success: false, error: 'System info not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...systemInfo,
        id: systemInfo.id.toString()
      }
    });

  } catch (error) {
    console.error('Error fetching system info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch system info' },
      { status: 500 }
    );
  }
}

// PUT - อัพเดทข้อมูลตาม key
export async function PUT(request, { params }) {
  try {
    const { key } = params;
    const body = await request.json();
    const { value, name, description, is_active, updated_by } = body;

    const updateData = {};
    if (value !== undefined) updateData.value = value;
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (updated_by !== undefined) updateData.updated_by = updated_by;

    const systemInfo = await prisma.systemInfo.update({
      where: { key },
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

// DELETE - ลบข้อมูลตาม key
export async function DELETE(request, { params }) {
  try {
    const { key } = params;

    await prisma.systemInfo.delete({
      where: { key }
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