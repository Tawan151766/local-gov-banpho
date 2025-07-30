const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedProcurementData() {
  try {
    console.log('🌱 Seeding procurement data...');

    // Create post types for procurement
    const procurementTypes = await Promise.all([
      prisma.post_types.upsert({
        where: { type_name: 'ประกาศจัดซื้อจัดจ้าง' },
        update: {},
        create: { type_name: 'ประกาศจัดซื้อจัดจ้าง' }
      }),
      prisma.post_types.upsert({
        where: { type_name: 'ผลประกาศจัดซื้อจัดจ้าง' },
        update: {},
        create: { type_name: 'ผลประกาศจัดซื้อจัดจ้าง' }
      }),
      prisma.post_types.upsert({
        where: { type_name: 'รายงานผลจัดซื้อจัดจ้าง' },
        update: {},
        create: { type_name: 'รายงานผลจัดซื้อจัดจ้าง' }
      }),
      prisma.post_types.upsert({
        where: { type_name: 'ประกาศเชิญชวน' },
        update: {},
        create: { type_name: 'ประกาศเชิญชวน' }
      })
    ]);

    console.log('✅ Created post types:', procurementTypes.map(t => t.type_name));

    // Create sample procurement posts
    const samplePosts = [
      {
        title_name: 'ประกาศจัดซื้อวัสดุสำนักงาน ประจำปี 2568',
        topic_name: 'จัดซื้อวัสดุสำนักงาน',
        details: 'องค์การบริหารส่วนตำบลบ้านโพธิ์ ประกาศจัดซื้อวัสดุสำนักงานต่างๆ เพื่อใช้ในการปฏิบัติงานประจำปี พ.ศ. 2568 ตามรายการที่กำหนด',
        date: new Date('2025-01-15'),
        post_type_id: procurementTypes[0].id
      },
      {
        title_name: 'ผลการจัดจ้างก่อสร้างถนนคอนกรีต',
        topic_name: 'ก่อสร้างถนนคอนกรีต',
        details: 'ประกาศผลการจัดจ้างก่อสร้างถนนคอนกรีตเสริมเหล็ก หมู่ที่ 3 บ้านโพธิ์ ผู้ชนะการเสนอราคา คือ บริษัท ABC จำกัด',
        date: new Date('2025-01-10'),
        post_type_id: procurementTypes[1].id
      },
      {
        title_name: 'รายงานผลการจัดซื้อครุภัณฑ์คอมพิวเตอร์',
        topic_name: 'จัดซื้อครุภัณฑ์คอมพิวเตอร์',
        details: 'รายงานผลการจัดซื้อครุภัณฑ์คอมพิวเตอร์ จำนวน 10 เครื่อง เพื่อใช้ในสำนักงาน ราคารวม 350,000 บาท',
        date: new Date('2025-01-05'),
        post_type_id: procurementTypes[2].id
      },
      {
        title_name: 'ประกาศเชิญชวนเสนอราคาจ้างทำความสะอาด',
        topic_name: 'จ้างทำความสะอาด',
        details: 'เชิญชวนผู้ประกอบการที่มีคุณสมบัติเสนอราคาจ้างทำความสะอาดอาคารสำนักงาน อบต.บ้านโพธิ์ ระยะเวลา 1 ปี',
        date: new Date('2025-01-20'),
        post_type_id: procurementTypes[3].id
      }
    ];

    const createdPosts = await Promise.all(
      samplePosts.map(post => 
        prisma.post_details.create({
          data: post,
          include: {
            post_types: true
          }
        })
      )
    );

    console.log('✅ Created sample posts:', createdPosts.length);

    // Add some sample PDF files
    const samplePdfs = [
      {
        post_detail_id: createdPosts[0].id,
        post_pdf_file: '/uploads/procurement/announcement_2568.pdf'
      },
      {
        post_detail_id: createdPosts[1].id,
        post_pdf_file: '/uploads/procurement/road_construction_result.pdf'
      }
    ];

    await Promise.all(
      samplePdfs.map(pdf => 
        prisma.post_pdfs.create({ data: pdf })
      )
    );

    console.log('✅ Added sample PDF files');
    console.log('🎉 Procurement data seeding completed!');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedProcurementData();