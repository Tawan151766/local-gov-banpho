import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    // ข้อมูลเริ่มต้นสำหรับระบบ
    const defaultSystemInfo = [
      {
        key: 'organization_name',
        value: 'เทศบาลตำบลบ้านโพธิ์',
        name: 'ชื่อหน่วยงาน',
        description: 'ชื่อเต็มของหน่วยงาน',
        created_by: 'system'
      },
      {
        key: 'phone',
        value: '038-123-456',
        name: 'เบอร์โทรศัพท์',
        description: 'เบอร์โทรศัพท์หลักของหน่วยงาน',
        created_by: 'system'
      },
      {
        key: 'email',
        value: 'contact@banpho.go.th',
        name: 'อีเมล',
        description: 'อีเมลติดต่อหลัก',
        created_by: 'system'
      },
      {
        key: 'address',
        value: '123 หมู่ 1 ตำบลบ้านโพธิ์ อำเภอบ้านโพธิ์ จังหวัดฉะเชิงเทรา 24140',
        name: 'ที่อยู่',
        description: 'ที่อยู่ของหน่วยงาน',
        created_by: 'system'
      },
      {
        key: 'fax',
        value: '038-123-457',
        name: 'โทรสาร',
        description: 'หมายเลขโทรสาร',
        created_by: 'system'
      },
      {
        key: 'website',
        value: 'https://banpho.go.th',
        name: 'เว็บไซต์',
        description: 'เว็บไซต์หลักของหน่วยงาน',
        created_by: 'system'
      },
      {
        key: 'facebook',
        value: 'https://facebook.com/banpho.official',
        name: 'Facebook',
        description: 'หน้า Facebook ของหน่วยงาน',
        created_by: 'system'
      },
      {
        key: 'line_id',
        value: '@banpho_official',
        name: 'Line ID',
        description: 'Line Official Account',
        created_by: 'system'
      },
      {
        key: 'working_hours',
        value: 'จันทร์ - ศุกร์ 08:30 - 16:30 น.',
        name: 'เวลาทำการ',
        description: 'เวลาทำการของหน่วยงาน',
        created_by: 'system'
      },
      {
        key: 'mayor_name',
        value: 'นายสมชาย ใจดี',
        name: 'ชื่อนายกเทศมนตรี',
        description: 'ชื่อนายกเทศมนตรีปัจจุบัน',
        created_by: 'system'
      }
    ];

    // ตรวจสอบและเพิ่มข้อมูลที่ยังไม่มี
    const results = [];
    for (const info of defaultSystemInfo) {
      const existing = await prisma.systemInfo.findUnique({
        where: { key: info.key }
      });

      if (!existing) {
        const created = await prisma.systemInfo.create({
          data: info
        });
        results.push({ 
          action: 'created', 
          data: {
            ...created,
            id: created.id.toString()
          }
        });
      } else {
        results.push({ action: 'skipped', key: info.key, reason: 'already exists' });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'System info seeded successfully',
      results
    });

  } catch (error) {
    console.error('Error seeding system info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed system info' },
      { status: 500 }
    );
  }
}