import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Database connection
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// ข้อมูลตัวอย่าง Q&A
const sampleQAItems = [
  {
    category_name: 'เอกสารราชการ',
    question: 'ขอใบรับรองการไม่มีหนี้สินต้องเตรียมเอกสารอะไรบ้าง?',
    answer: `สำหรับการขอใบรับรองการไม่มีหนี้สินต่อเทศบาล ท่านต้องเตรียมเอกสารดังนี้:

📋 เอกสารที่ต้องเตรียม:
1. บัตรประชาชน (ฉบับจริง + สำเนา)
2. ทะเบียนบ้าน (ฉบับจริง + สำเนา)
3. หนังสือมอบอำนาจ (กรณีมาแทน) พร้อมบัตรประชาชนผู้รับมอบอำนาจ
4. ค่าธรรมเนียม 20 บาท

⏰ เวลาทำการ:
วันจันทร์-วันศุกร์ เวลา 08:30-16:30 น. (หยุดพักเที่ยง 12:00-13:00 น.)

📞 ติดต่อสอบถาม:
โทร. 038-123456 หรือมาที่เคาน์เตอร์บริการชั้น 1

⚡ ใช้เวลาประมาณ 15-30 นาที`,
    tags: 'ใบรับรอง, เอกสาร, หนี้สิน',
    is_featured: true,
    display_order: 1
  },
  {
    category_name: 'บริการทั่วไป',
    question: 'เทศบาลตำบลบ้านโพธิ์เปิดทำการวันไหนบ้าง?',
    answer: `🕐 เวลาทำการของเทศบาลตำบลบ้านโพธิ์:

📅 วันจันทร์ - วันศุกร์
⏰ เวลา 08:30 - 16:30 น.
🍽️ พักเที่ยง 12:00 - 13:00 น.

❌ วันหยุด:
- วันเสาร์ - วันอาทิตย์
- วันหยุดราชการ
- วันหยุดนักขัตฤกษ์

📞 ติดต่อนอกเวลา:
กรณีเร่งด่วน โทร. 038-123456 ต่อ 0`,
    tags: 'เวลาทำการ, วันหยุด, ติดต่อ',
    is_featured: true,
    display_order: 2
  },
  {
    category_name: 'ภาษีและค่าธรรมเนียม',
    question: 'ชำระภาษีที่ดินและสิ่งปลูกสร้างได้ที่ไหนบ้าง?',
    answer: `💰 ช่องทางการชำระภาษีที่ดินและสิ่งปลูกสร้าง:

🏢 ที่เทศบาลตำบลบ้านโพธิ์:
- เคาน์เตอร์บริการชั้น 1
- วันจันทร์-วันศุกร์ เวลา 08:30-16:30 น.

🏦 ธนาคารที่ร่วมบริการ:
- ธนาคารกรุงไทย
- ธนาคารไทยพาณิชย์
- ธนาคารกสิกรไทย

💳 ช่องทางออนไลน์:
- แอปพลิเคชัน Mobile Banking
- Internet Banking
- เคาน์เตอร์เซอร์วิส (7-Eleven)

📋 เอกสารที่ต้องนำมา:
- ใบแจ้งภาษี
- บัตรประชาชน`,
    tags: 'ภาษี, ที่ดิน, ชำระเงิน',
    is_featured: false,
    display_order: 3
  },
  {
    category_name: 'สาธารณูปโภค',
    question: 'น้ำประปาไม่ไหลหรือไฟฟ้าดับต้องแจ้งที่ไหน?',
    answer: `⚡ การแจ้งปัญหาสาธารณูปโภค:

💧 น้ำประปา:
📞 โทร. 038-123456 ต่อ 201
📱 Line Official: @banpho-water
⏰ 24 ชั่วโมง (กรณีเร่งด่วน)

⚡ ไฟฟ้า:
📞 การไฟฟ้าส่วนภูมิภาค: 1129
📞 เทศบาล (ไฟฟ้าสาธารณะ): 038-123456 ต่อ 202

🛣️ ถนน/ท่อระบายน้ำ:
📞 โทร. 038-123456 ต่อ 203
📧 อีเมล: public@banpho.go.th

📋 ข้อมูลที่ต้องแจ้ง:
- ที่อยู่ที่เกิดปัญหา
- ลักษณะปัญหา
- เบอร์ติดต่อกลับ`,
    tags: 'น้ำประปา, ไฟฟ้า, ถนน, แจ้งปัญหา',
    is_featured: false,
    display_order: 4
  },
  {
    category_name: 'สวัสดิการสังคม',
    question: 'สมัครเบี้ยยังชีพผู้สูงอายุต้องทำอย่างไร?',
    answer: `👴👵 การสมัครเบี้ยยังชีพผู้สูงอายุ:

✅ คุณสมบัติ:
- อายุ 60 ปีบริบูรณ์ขึ้นไป
- มีสัญชาติไทย
- มีภูมิลำเนาในเขตเทศบาล
- รายได้ไม่เกิน 100,000 บาท/ปี

📋 เอกสารที่ต้องเตรียม:
1. บัตรประชาชน (ฉบับจริง + สำเนา)
2. ทะเบียนบ้าน (ฉบับจริง + สำเนา)
3. สมุดบัญชีธนาคาร (หน้าแรก)
4. รูปถ่าย 1 นิ้ว จำนวน 2 รูป

📍 สถานที่สมัคร:
เทศบาลตำบลบ้านโพธิ์ ชั้น 2 ฝ่ายสวัสดิการสังคม

💰 จำนวนเงิน:
- อายุ 60-69 ปี: 600 บาท/เดือน
- อายุ 70-79 ปี: 700 บาท/เดือน
- อายุ 80-89 ปี: 800 บาท/เดือน
- อายุ 90 ปีขึ้นไป: 1,000 บาท/เดือน`,
    tags: 'เบี้ยยังชีพ, ผู้สูงอายุ, สวัสดิการ',
    is_featured: true,
    display_order: 5
  },
  {
    category_name: 'การศึกษา',
    question: 'มีทุนการศึกษาสำหรับเด็กนักเรียนหรือไม่?',
    answer: `🎓 ทุนการศึกษาเทศบาลตำบลบ้านโพธิ์:

💰 ประเภททุน:
1. ทุนเด็กดี (ป.1-ม.6): 2,000 บาท/ปี
2. ทุนเด็กเก่ง (เกรดเฉลี่ย 3.50 ขึ้นไป): 3,000 บาท/ปี
3. ทุนเด็กยากจน: 5,000 บาท/ปี
4. ทุนระดับอุดมศึกษา: 10,000 บาท/ปี

✅ คุณสมบัติทั่วไป:
- มีภูมิลำเนาในเขตเทศบาล
- กำลังศึกษาอยู่
- ไม่ได้รับทุนจากหน่วยงานอื่น

📋 เอกสารสมัคร:
1. ใบสมัคร (รับที่เทศบาล)
2. ทะเบียนบ้าน + บัตรประชาชน
3. ใบแสดงผลการเรียน
4. หนังสือรับรองรายได้ผู้ปกครอง
5. รูปถ่าย 1 นิ้ว จำนวน 2 รูป

📅 ช่วงเวลาสมัคร:
เดือนมีนาคม - เมษายน ของทุกปี`,
    tags: 'ทุนการศึกษา, เด็ก, นักเรียน',
    is_featured: false,
    display_order: 6
  },
  {
    category_name: 'การขออนุญาต',
    question: 'ขออนุญาตก่อสร้างบ้านต้องทำอย่างไร?',
    answer: `🏠 การขออนุญาตก่อสร้างบ้าน:

📋 เอกสารที่ต้องเตรียม:
1. แบบแปลนก่อสร้าง (โดยสถาปนิก/วิศวกร)
2. โฉนดที่ดิน หรือ น.ส.3
3. บัตรประชาชนเจ้าของที่ดิน
4. หนังสือมอบอำนาจ (ถ้ามี)
5. ใบอนุญาตประกอบวิชาชีพ (สถาปนิก/วิศวกร)

💰 ค่าธรรมเนียม:
- บ้านเดี่ยว: 500-2,000 บาท (ตามขนาด)
- อาคารพาณิชย์: 1,000-5,000 บาท

⏱️ ระยะเวลาดำเนินการ:
- ตรวจสอบเอกสาร: 7-15 วัน
- ออกใบอนุญาต: 30 วัน

📞 สอบถามข้อมูล:
ฝ่ายโยธา โทร. 038-123456 ต่อ 301

⚠️ หมายเหตุ:
ต้องเริ่มก่อสร้างภายใน 1 ปี หลังได้รับอนุญาต`,
    tags: 'ใบอนุญาต, ก่อสร้าง, บ้าน',
    is_featured: false,
    display_order: 7
  },
  {
    category_name: 'สิ่งแวดล้อม',
    question: 'วันไหนเก็บขยะ และต้องแยกขยะอย่างไร?',
    answer: `🗑️ การจัดการขยะเทศบาลตำบลบ้านโพธิ์:

📅 ตารางเก็บขยะ:
- วันจันทร์, พุธ, ศุกร์: ขยะทั่วไป
- วันอังคาร: ขยะรีไซเคิล
- วันเสาร์: ขยะอินทรีย์

🕐 เวลาเก็บขยะ:
06:00 - 10:00 น. (วางขยะก่อน 06:00 น.)

♻️ การแยกขยะ:
🟢 ขยะอินทรีย์ (ถุงสีเขียว):
- เศษอาหาร, ใบไม้, เปลือกผลไม้

🔵 ขยะรีไซเคิล (ถุงสีน้ำเงิน):
- กระดาษ, พลาสติก, แก้ว, โลหะ

🔴 ขยะทั่วไป (ถุงสีแดง):
- ขยะที่ไม่สามารถรีไซเคิลได้

⚠️ ขยะอันตราย:
- ถ่านไฟฉาย, หลอดไฟ, ยา
- นำส่งที่เทศบาลโดยตรง

📞 แจ้งปัญหา: 038-123456 ต่อ 204`,
    tags: 'ขยะ, แยกขยะ, สิ่งแวดล้อม',
    is_featured: true,
    display_order: 8
  }
];

export async function POST(request) {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    
    // ตรวจสอบว่ามีข้อมูลอยู่แล้วหรือไม่
    const [existingItems] = await connection.execute(
      'SELECT COUNT(*) as count FROM qa_items'
    );
    
    if (existingItems[0].count > 0) {
      return NextResponse.json({
        success: false,
        message: 'Sample Q&A items already exist. Use force=true to recreate.',
        existing_count: existingItems[0].count
      });
    }
    
    // เริ่ม transaction
    await connection.beginTransaction();
    
    const insertedItems = [];
    
    // Insert Q&A items
    for (const item of sampleQAItems) {
      // หา category_id จากชื่อหมวดหมู่
      const [categories] = await connection.execute(
        'SELECT id FROM qa_categories WHERE category_name = ?',
        [item.category_name]
      );
      
      if (categories.length === 0) {
        console.warn(`Category not found: ${item.category_name}`);
        continue;
      }
      
      const categoryId = categories[0].id;
      
      const [result] = await connection.execute(`
        INSERT INTO qa_items (
          category_id,
          question,
          answer,
          tags,
          is_active,
          is_featured,
          display_order,
          view_count,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        categoryId,
        item.question,
        item.answer,
        item.tags,
        true,
        item.is_featured,
        item.display_order,
        Math.floor(Math.random() * 100) + 10 // Random view count 10-109
      ]);
      
      insertedItems.push({
        id: result.insertId,
        category_id: categoryId,
        category_name: item.category_name,
        question: item.question,
        answer: item.answer,
        tags: item.tags,
        is_featured: item.is_featured,
        display_order: item.display_order
      });
    }
    
    // Commit transaction
    await connection.commit();
    
    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${insertedItems.length} Q&A items`,
      data: insertedItems,
      summary: {
        total_inserted: insertedItems.length,
        featured_items: insertedItems.filter(item => item.is_featured).length,
        categories_used: [...new Set(insertedItems.map(item => item.category_name))].length
      }
    });

  } catch (error) {
    // Rollback transaction on error
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error('Rollback error:', rollbackError);
      }
    }
    
    console.error('Seed Q&A items error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed Q&A items',
        details: error.message 
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// DELETE - ลบข้อมูลทั้งหมดและ seed ใหม่
export async function DELETE(request) {
  let connection;
  
  try {
    const url = new URL(request.url);
    const force = url.searchParams.get('force') === 'true';
    
    if (!force) {
      return NextResponse.json({
        success: false,
        message: 'Add ?force=true to confirm deletion and re-seeding'
      }, { status: 400 });
    }
    
    connection = await mysql.createConnection(dbConfig);
    
    // เริ่ม transaction
    await connection.beginTransaction();
    
    // ลบข้อมูลทั้งหมด
    await connection.execute('DELETE FROM qa_submitters');
    await connection.execute('DELETE FROM qa_items');
    
    // Reset AUTO_INCREMENT
    await connection.execute('ALTER TABLE qa_items AUTO_INCREMENT = 1');
    
    const insertedItems = [];
    
    // Insert Q&A items ใหม่
    for (const item of sampleQAItems) {
      // หา category_id จากชื่อหมวดหมู่
      const [categories] = await connection.execute(
        'SELECT id FROM qa_categories WHERE category_name = ?',
        [item.category_name]
      );
      
      if (categories.length === 0) {
        console.warn(`Category not found: ${item.category_name}`);
        continue;
      }
      
      const categoryId = categories[0].id;
      
      const [result] = await connection.execute(`
        INSERT INTO qa_items (
          category_id,
          question,
          answer,
          tags,
          is_active,
          is_featured,
          display_order,
          view_count,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        categoryId,
        item.question,
        item.answer,
        item.tags,
        true,
        item.is_featured,
        item.display_order,
        Math.floor(Math.random() * 100) + 10
      ]);
      
      insertedItems.push({
        id: result.insertId,
        category_id: categoryId,
        category_name: item.category_name,
        question: item.question,
        is_featured: item.is_featured
      });
    }
    
    // Commit transaction
    await connection.commit();
    
    return NextResponse.json({
      success: true,
      message: `Successfully re-seeded ${insertedItems.length} Q&A items`,
      data: insertedItems,
      summary: {
        total_inserted: insertedItems.length,
        featured_items: insertedItems.filter(item => item.is_featured).length,
        categories_used: [...new Set(insertedItems.map(item => item.category_name))].length
      }
    });

  } catch (error) {
    // Rollback transaction on error
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error('Rollback error:', rollbackError);
      }
    }
    
    console.error('Re-seed Q&A items error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to re-seed Q&A items',
        details: error.message 
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}