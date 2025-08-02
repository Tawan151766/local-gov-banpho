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

// หมวดหมู่คำถามสำหรับเทศบาลตำบล
const qaCategories = [
  {
    category_name: 'บริการทั่วไป',
    description: 'คำถามเกี่ยวกับบริการทั่วไปของเทศบาล เวลาทำการ การติดต่อ',
    icon: 'InfoCircleOutlined',
    color: '#1890ff',
    display_order: 1
  },
  {
    category_name: 'เอกสารราชการ',
    description: 'ใบรับรอง หนังสือรับรอง เอกสารต่างๆ ที่ออกโดยเทศบาล',
    icon: 'FileTextOutlined',
    color: '#52c41a',
    display_order: 2
  },
  {
    category_name: 'ภาษีและค่าธรรมเนียม',
    description: 'การชำระภาษี ค่าธรรมเนียมต่างๆ การขอผ่อนผัน',
    icon: 'DollarOutlined',
    color: '#faad14',
    display_order: 3
  },
  {
    category_name: 'สาธารณูปโภค',
    description: 'น้ำประปา ไฟฟ้า ถนน ท่อระบายน้ำ',
    icon: 'HomeOutlined',
    color: '#722ed1',
    display_order: 4
  },
  {
    category_name: 'สวัสดิการสังคม',
    description: 'เบี้ยยังชีพ เบี้ยผู้สูงอายุ เบี้ยผู้พิการ สวัสดิการต่างๆ',
    icon: 'HeartOutlined',
    color: '#eb2f96',
    display_order: 5
  },
  {
    category_name: 'การศึกษา',
    description: 'โรงเรียน ทุนการศึกษา กิจกรรมการเรียนการสอน',
    icon: 'BookOutlined',
    color: '#13c2c2',
    display_order: 6
  },
  {
    category_name: 'สาธารณสุข',
    description: 'โรงพยาบาล สุขภาพ การป้องกันโรค วัคซีน',
    icon: 'MedicineBoxOutlined',
    color: '#f5222d',
    display_order: 7
  },
  {
    category_name: 'สิ่งแวดล้อม',
    description: 'การจัดการขยะ มลพิษ การอนุรักษ์สิ่งแวดล้อม',
    icon: 'GlobalOutlined',
    color: '#52c41a',
    display_order: 8
  },
  {
    category_name: 'การขออนุญาต',
    description: 'ใบอนุญาตต่างๆ การประกอบกิจการ การก่อสร้าง',
    icon: 'SafetyCertificateOutlined',
    color: '#fa8c16',
    display_order: 9
  },
  {
    category_name: 'การจราจร',
    description: 'ป้ายจราจร ไฟจราจร ที่จอดรถ การขนส่ง',
    icon: 'CarOutlined',
    color: '#2f54eb',
    display_order: 10
  },
  {
    category_name: 'การร้องเรียน',
    description: 'การร้องเรียนปัญหาต่างๆ การแจ้งเหตุเดือดร้อน',
    icon: 'ExclamationCircleOutlined',
    color: '#ff4d4f',
    display_order: 11
  },
  {
    category_name: 'กิจกรรมและงานประเพณี',
    description: 'งานประเพณี เทศกาล กิจกรรมของเทศบาล',
    icon: 'CalendarOutlined',
    color: '#fa541c',
    display_order: 12
  }
];

export async function POST(request) {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    
    // ตรวจสอบว่ามีข้อมูลอยู่แล้วหรือไม่
    const [existingCategories] = await connection.execute(
      'SELECT COUNT(*) as count FROM qa_categories'
    );
    
    if (existingCategories[0].count > 0) {
      return NextResponse.json({
        success: false,
        message: 'Categories already exist. Use force=true to recreate.',
        existing_count: existingCategories[0].count
      });
    }
    
    // เริ่ม transaction
    await connection.beginTransaction();
    
    const insertedCategories = [];
    
    // Insert หมวดหมู่ทีละรายการ
    for (const category of qaCategories) {
      const [result] = await connection.execute(`
        INSERT INTO qa_categories (
          category_name, 
          description, 
          icon, 
          color, 
          display_order, 
          is_active,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        category.category_name,
        category.description,
        category.icon,
        category.color,
        category.display_order,
        true
      ]);
      
      insertedCategories.push({
        id: result.insertId,
        ...category,
        is_active: true
      });
    }
    
    // Commit transaction
    await connection.commit();
    
    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${insertedCategories.length} categories`,
      data: insertedCategories,
      summary: {
        total_inserted: insertedCategories.length,
        categories: insertedCategories.map(cat => ({
          id: cat.id,
          name: cat.category_name,
          order: cat.display_order
        }))
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
    
    console.error('Seed categories error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to seed categories',
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

// DELETE - ลบหมวดหมู่ทั้งหมดและ seed ใหม่
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
    
    // ลบหมวดหมู่ทั้งหมด
    await connection.execute('DELETE FROM qa_categories');
    
    // Reset AUTO_INCREMENT
    await connection.execute('ALTER TABLE qa_categories AUTO_INCREMENT = 1');
    
    const insertedCategories = [];
    
    // Insert หมวดหมู่ใหม่
    for (const category of qaCategories) {
      const [result] = await connection.execute(`
        INSERT INTO qa_categories (
          category_name, 
          description, 
          icon, 
          color, 
          display_order, 
          is_active,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        category.category_name,
        category.description,
        category.icon,
        category.color,
        category.display_order,
        true
      ]);
      
      insertedCategories.push({
        id: result.insertId,
        ...category,
        is_active: true
      });
    }
    
    // Commit transaction
    await connection.commit();
    
    return NextResponse.json({
      success: true,
      message: `Successfully re-seeded ${insertedCategories.length} categories`,
      data: insertedCategories,
      summary: {
        total_inserted: insertedCategories.length,
        categories: insertedCategories.map(cat => ({
          id: cat.id,
          name: cat.category_name,
          order: cat.display_order
        }))
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
    
    console.error('Re-seed categories error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to re-seed categories',
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

// GET - ดูข้อมูลหมวดหมู่ที่มีอยู่
export async function GET(request) {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    
    const [categories] = await connection.execute(`
      SELECT 
        id,
        category_name,
        description,
        icon,
        color,
        display_order,
        is_active,
        created_at,
        updated_at,
        (SELECT COUNT(*) FROM qa_items WHERE category_id = qa_categories.id) as items_count
      FROM qa_categories 
      ORDER BY display_order ASC, category_name ASC
    `);
    
    return NextResponse.json({
      success: true,
      data: categories,
      summary: {
        total_categories: categories.length,
        active_categories: categories.filter(cat => cat.is_active).length,
        inactive_categories: categories.filter(cat => !cat.is_active).length
      }
    });

  } catch (error) {
    console.error('Get categories error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get categories',
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