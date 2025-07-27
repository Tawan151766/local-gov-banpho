import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Get user count
    const userCount = await prisma.user.count();
    
    // Get first few users (without password)
    const users = await prisma.user.findMany({
      take: 3,
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true
      },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        userCount,
        sampleUsers: users,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        details: error.message 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}