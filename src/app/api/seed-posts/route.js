import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Database connection
const dbConfig = {
  host: '103.80.48.25',
  port: 3306,
  user: 'gmsky_banphokorat',
  password: 'banphokorat56789',
  database: 'gmsky_banphokorat'
};

export async function POST() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    
    // Start transaction
    await connection.beginTransaction();

    try {
      // Insert sample post types
      const postTypes = [
        'ข่าวประชาสัมพันธ์',        // ID 1
        'กิจกรรม',                 // ID 2  
        'ประกาศจัดซื้อจัดจ้าง',      // ID 3
        'ประกาศสำคัญ',             // ID 4
        'ข่าวสารทั่วไป'            // ID 5
      ];

      const postTypeIds = [];
      for (const typeName of postTypes) {
        // Check if type already exists
        const [existing] = await connection.execute(
          'SELECT id FROM post_types WHERE type_name = ?',
          [typeName]
        );

        if (existing.length === 0) {
          const [result] = await connection.execute(
            'INSERT INTO post_types (type_name, created_at, updated_at) VALUES (?, NOW(), NOW())',
            [typeName]
          );
          postTypeIds.push(result.insertId);
        } else {
          postTypeIds.push(existing[0].id);
        }
      }

      // Insert sample post details
      const samplePosts = [
        {
          post_type_id: postTypeIds[0], // ข่าวประชาสัมพันธ์
          date: '2024-01-15',
          title_name: 'ประกาศรับสมัครงานประจำ ประจำปี 2567',
          topic_name: 'รับสมัครตำแหน่งเจ้าหน้าที่บริหารงานทั่วไป',
          details: 'องค์การบริหารส่วนตำบลบ้านโพธิ์ ประกาศรับสมัครบุคคลเพื่อสอบแข่งขันเป็นพนักงานส่วนตำบล ตำแหน่งเจ้าหน้าที่บริหารงานทั่วไป จำนวน 2 อัตรา\n\nคุณสมบัติผู้สมัคร:\n- วุฒิการศึกษาระดับปริญญาตรี\n- อายุไม่เกิน 35 ปี\n- มีความรู้ด้านคอมพิวเตอร์\n\nรับสมัครตั้งแต่วันที่ 15-30 มกราคม 2567'
        },
        {
          post_type_id: postTypeIds[1], // กิจกรรม
          date: '2024-01-20',
          title_name: 'กิจกรรมวันเด็กแห่งชาติ ประจำปี 2567',
          topic_name: 'ร่วมสร้างสรรค์กิจกรรมเพื่อเด็กและเยาวชน',
          details: 'องค์การบริหารส่วนตำบลบ้านโพธิ์ ขอเชิญชวนเด็กและเยาวชนในพื้นที่ร่วมกิจกรรมวันเด็กแห่งชาติ ประจำปี 2567\n\nกิจกรรมที่จัด:\n- การแสดงของเด็ก\n- เกมส์และกิจกรรมสนุกสนาน\n- แจกของขวัญและของรางวัล\n- อาหารและเครื่องดื่มฟรี\n\nวันที่: 13 มกราคม 2567\nเวลา: 08.00-12.00 น.\nสถานที่: ลานอเนกประสงค์ อบต.บ้านโพธิ์'
        },
        {
          post_type_id: postTypeIds[1], // กิจกรรม
          date: '2024-01-25',
          title_name: 'กิจกรรมปลูกป่าชุมชน เพื่อสิ่งแวดล้อม',
          topic_name: 'ร่วมกันปลูกป่าเพื่อลูกหลาน',
          details: 'องค์การบริหารส่วนตำบลบ้านโพธิ์ ขอเชิญชวนประชาชนร่วมกิจกรรมปลูกป่าชุมชน\n\nรายละเอียดกิจกรรม:\n- ปลูกต้นไผ่และไม้ยืนต้น\n- จำนวน 500 ต้น\n- พื้นที่ปลูก: ป่าชุมชนบ้านโพธิ์\n- มีอาหารและเครื่องดื่มบริการ\n\nวันที่: 25 มกราคม 2567\nเวลา: 07.00-11.00 น.\nสถานที่นัดพบ: ที่ว่าการ อบต.บ้านโพธิ์'
        },
        {
          post_type_id: postTypeIds[2], // ประกาศจัดซื้อจัดจ้าง
          date: '2024-01-30',
          title_name: 'ประกาศจัดซื้อวัสดุก่อสร้าง ประจำปี 2567',
          topic_name: 'จัดซื้อวัสดุก่อสร้างสำหรับโครงการพัฒนา',
          details: 'องค์การบริหารส่วนตำบลบ้านโพธิ์ ประกาศจัดซื้อวัสดุก่อสร้าง ประจำปี 2567\n\nรายการจัดซื้อ:\n- ปูนซีเมนต์ จำนวน 200 ถุง\n- เหล็กเส้น ขนาดต่างๆ\n- อิฐมอญ จำนวน 10,000 ก้อน\n- ทรายหยาบ 50 ลูกบาศก์เมตร\n\nวงเงินงบประมาณ: 500,000 บาท\nกำหนดยื่นซอง: 15 กุมภาพันธ์ 2567\nเปิดซอง: 16 กุมภาพันธ์ 2567 เวลา 10.00 น.'
        },
        {
          post_type_id: postTypeIds[2], // ประกาศจัดซื้อจัดจ้าง
          date: '2024-02-01',
          title_name: 'ผลประกาศจัดซื้อวัสดุสำนักงาน',
          topic_name: 'ประกาศผลการจัดซื้อวัสดุสำนักงาน ประจำปี 2567',
          details: 'องค์การบริหารส่วนตำบลบ้านโพธิ์ ขอประกาศผลการจัดซื้อวัสดุสำนักงาน ประจำปี 2567\n\nผู้ได้รับการคัดเลือก:\nบริษัท ABC จำกัด\nวงเงิน: 150,000 บาท\n\nรายการที่จัดซื้อ:\n- กระดาษ A4\n- หมึกปริ้นเตอร์\n- อุปกรณ์เครื่องเขียน\n- วัสดุทำความสะอาด\n\nกำหนดส่งมอบ: 15 กุมภาพันธ์ 2567'
        },
        {
          post_type_id: postTypeIds[3], // ประกาศสำคัญ
          date: '2024-02-05',
          title_name: 'ประกาศงดจ่ายน้ำประปา เพื่อซ่อมแซมระบบ',
          topic_name: 'การบำรุงรักษาระบบประปาหมู่บ้าน',
          details: 'เรียน ประชาชนในเขตองค์การบริหารส่วนตำบลบ้านโพธิ์\n\nด้วยองค์การบริหารส่วนตำบลบ้านโพธิ์ จำเป็นต้องดำเนินการซ่อมแซมและบำรุงรักษาระบบประปาหมู่บ้าน จึงขอแจ้งให้ทราบว่า\n\nจะงดจ่ายน้ำประปาชั่วคราว ในวันที่ 5 กุมภาพันธ์ 2567\nเวลา: 08.00-17.00 น.\nพื้นที่ที่ได้รับผลกระทบ: หมู่ที่ 1, 2, และ 4\n\nขออภัยในความไม่สะดวก และขอความร่วมมือในการเก็บน้ำไว้ใช้ล่วงหน้า'
        }
      ];

      for (const post of samplePosts) {
        await connection.execute(
          'INSERT INTO post_details (post_type_id, date, title_name, topic_name, details, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
          [post.post_type_id, post.date, post.title_name, post.topic_name, post.details]
        );
      }

      // Commit transaction
      await connection.commit();

      return NextResponse.json({
        success: true,
        message: 'Sample post data created successfully',
        data: {
          postTypesCreated: postTypes.length,
          postDetailsCreated: samplePosts.length
        }
      });

    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }

  } catch (error) {
    console.error('Error seeding post data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed post data', details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}