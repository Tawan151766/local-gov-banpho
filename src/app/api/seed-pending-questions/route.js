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

// ข้อมูลตัวอย่างคำถามที่รอการตอบ
const pendingQuestions = [
  {
    category_name: 'เอกสารราชการ',
    question: 'ขอใบรับรองการไม่มีหนี้สินสำหรับการสมัครงานต้องใช้เวลานานไหม?',
    submitter_name: 'นายสมชาย ใจดี',
    submitter_email: 'somchai@email.com',
    submitter_phone: '081-234-5678',
    submitter_ip: '192.168.1.100'
  },
  {
    category_name: 'ภาษีและค่าธรรมเนียม',
    question: 'ภาษีที่ดินปีนี้เพิ่มขึ้นหรือไม่ และมีการผ่อนผันสำหรับผู้สูงอายุไหม?',
    submitter_name: 'นางสาวมาลี สวยงาม',
    submitter_email: 'malee@gmail.com',
    submitter_phone: '089-876-5432',
    submitter_ip: '192.168.1.101'
  },
  {
    category_name: 'สาธารณูปโภค',
    question: 'ถนนหน้าบ้านเป็นหลุมบ่อย จะแจ้งซ่อมได้ที่ไหน?',
    submitter_name: 'นายประยุทธ์ รักบ้าน',
    submitter_email: null,
    submitter_phone: '092-111-2222',
    submitter_ip: '192.168.1.102'
  },
  {
    category_name: 'สวัสดิการสังคม',
    question: 'เบี้ยยังชีพผู้พิการมีการปรับเพิ่มหรือไม่ และต้องมาต่ออายุทุกปีไหม?',
    submitter_name: 'นางวิไล ช่วยเหลือ',
    submitter_email: 'wilai.help@hotmail.com',
    submitter_phone: null,
    submitter_ip: '192.168.1.103'
  },
  {
    category_name: 'การศึกษา',
    question: 'ทุนการศึกษาสำหรับเด็กยากจนปีนี้เปิดรับสมัครเมื่อไหร่?',
    submitter_name: null,
    submitter_email: 'parent2024@yahoo.com',
    submitter_phone: null,
    submitter_ip: '192.168.1.104'
  },
  {
    category_name: 'การขออนุญาต',
    question: 'ขออนุญาตเปิดร้านค้าหน้าบ้านต้องใช้เอกสารอะไรบ้าง?',
    submitter_name: 'นายวิชัย ขายดี',
    submitter_email: 'vichai.shop@line.me',
    submitter_phone: '088-999-8888',
    submitter_ip: '192.168.1.105'
  },
  {
    category_name: 'สิ่งแวดล้อม',
    question: 'รถเก็บขยะไม่มาเก็บหลายวันแล้ว จะแจ้งได้ที่ไหน?',
    submitter_name: 'นางสุดา สะอาด',
    submitter_email: null,
    submitter_phone: '095-555-4444',
    submitter_ip: '192.168.1.106'
  },
  {
    category_name: 'การร้องเรียน',
    question: 'เสียงดังจากโรงงานใกล้บ้านรบกวนตอนกลางคืน จะร้องเรียนอย่างไร?',
    submitter_name: 'นายสุรชัย เงียบสงบ',
    submitter_email: 'surachai.quiet@gmail.com',
    submitter_phone: '087-333-2222',
    submitter_ip: '192.168.1.107'
  }
];

export async function POST(request) {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    
    // เริ่ม transaction
    await connection.beginTransaction();
    
    const insertedItems = [];
    
    // Insert pending questions
    for (const item of pendingQuestions) {
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
      
      // Insert Q&A item (without answer - pending)
      const [qaResult] = await connection.execute(`
        INSERT INTO qa_items (
          category_id,
          question,
          answer,
          is_active,
          is_featured,
          display_order,
          view_count,
          created_at,
          updated_at
        ) VALUES (?, ?, NULL, 0, 0, 0, 0, NOW(), NOW())
      `, [categoryId, item.question]);
      
      const qaItemId = qaResult.insertId;
      
      // Insert submitter info
      await connection.execute(`
        INSERT INTO qa_submitters (
          qa_item_id,
          submitter_name,
          submitter_email,
          submitter_phone,
          submitter_ip,
          created_at
        ) VALUES (?, ?, ?, ?, ?, NOW())
      `, [
        qaItemId,
        item.submitter_name,
        item.submitter_email,
        item.submitter_phone,
        item.submitter_ip
      ]);
      
      insertedItems.push({
        id: qaItemId,
        category_id: categoryId,
        category_name: item.category_name,
        question: item.question,
        submitter_name: item.submitter_name,
        submitter_email: item.submitter_email,
        submitter_phone: item.submitter_phone
      });
    }
    
    // Commit transaction
    await connection.commit();
    
    return NextResponse.json({
      success: true,
      message: `Successfully created ${insertedItems.length} pending questions`,
      data: insertedItems,
      summary: {
        total_inserted: insertedItems.length,
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
    
    console.error('Seed pending questions error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed pending questions',
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

// DELETE - ลบคำถามที่รอการตอบทั้งหมด
export async function DELETE(request) {
  let connection;
  
  try {
    const url = new URL(request.url);
    const force = url.searchParams.get('force') === 'true';
    
    if (!force) {
      return NextResponse.json({
        success: false,
        message: 'Add ?force=true to confirm deletion of all pending questions'
      }, { status: 400 });
    }
    
    connection = await mysql.createConnection(dbConfig);
    
    // เริ่ม transaction
    await connection.beginTransaction();
    
    // ลบคำถามที่ไม่มีคำตอบ
    await connection.execute(`
      DELETE FROM qa_submitters 
      WHERE qa_item_id IN (
        SELECT id FROM qa_items 
        WHERE answer IS NULL OR answer = '' OR is_active = 0
      )
    `);
    
    const [deleteResult] = await connection.execute(`
      DELETE FROM qa_items 
      WHERE answer IS NULL OR answer = '' OR is_active = 0
    `);
    
    // Commit transaction
    await connection.commit();
    
    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deleteResult.affectedRows} pending questions`
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
    
    console.error('Delete pending questions error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete pending questions',
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