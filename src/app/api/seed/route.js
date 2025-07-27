import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@banpho.local' }
    });

    if (existingAdmin) {
      return NextResponse.json({
        success: false,
        message: 'Admin user already exists'
      }, { status: 400 });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const adminUser = await prisma.user.create({
      data: {
        name: 'ผู้ดูแลระบบ',
        email: 'admin@banpho.local',
        password: hashedPassword,
        email_verified_at: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      data: adminUser
    }, { status: 201 });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}