import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Database connection
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

export async function POST() {
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    // Start transaction
    await connection.beginTransaction();

    try {
      // 1. ตรวจสอบและสร้าง post_types ที่จำเป็น
      const requiredTypes = [
        { id: 1, name: "ข่าวประชาสัมพันธ์" },
        { id: 2, name: "กิจกรรม" },
        { id: 3, name: "ประกาศจัดซื้อจัดจ้าง" },
      ];

      const createdTypes = [];
      for (const type of requiredTypes) {
        // ตรวจสอบว่ามี type นี้อยู่แล้วหรือไม่
        const [existing] = await connection.execute(
          "SELECT id FROM post_types WHERE id = ? OR type_name = ?",
          [type.id, type.name]
        );

        if (existing.length === 0) {
          await connection.execute(
            "INSERT INTO post_types (id, type_name, created_at, updated_at) VALUES (?, ?, NOW(), NOW())",
            [type.id, type.name]
          );
          createdTypes.push(type);
        }
      }

      // 2. สร้างข้อมูลตัวอย่างสำหรับแต่ละประเภท
      const sampleData = [
        // ข่าวประชาสัมพันธ์ (postTypeId = 1)
        {
          post_type_id: 1,
          date: "2024-02-01",
          title_name: "ประกาศรับสมัครงานประจำ ประจำปี 2567",
          topic_name: "รับสมัครตำแหน่งเจ้าหน้าที่บริหารงานทั่วไป",
          details:
            "องค์การบริหารส่วนตำบลบ้านโพธิ์ ประกาศรับสมัครบุคคลเพื่อสอบแข่งขันเป็นพนักงานส่วนตำบล ตำแหน่งเจ้าหน้าที่บริหารงานทั่วไป จำนวน 2 อัตรา\n\nคุณสมบัติผู้สมัคร:\n- วุฒิการศึกษาระดับปริญญาตรี\n- อายุไม่เกิน 35 ปี\n- มีความรู้ด้านคอมพิวเตอร์\n\nรับสมัครตั้งแต่วันที่ 1-15 กุมภาพันธ์ 2567",
        },
        {
          post_type_id: 1,
          date: "2024-02-05",
          title_name: "ข่าวประชาสัมพันธ์โครงการพัฒนาชุมชน",
          topic_name: "เชิญชวนประชาชนร่วมโครงการ",
          details:
            "องค์การบริหารส่วนตำบลบ้านโพธิ์ ขอเชิญชวนประชาชนร่วมโครงการพัฒนาชุมชนเพื่อยกระดับคุณภาพชีวิต\n\nกิจกรรมที่จัด:\n- อบรมอาชีพเสริม\n- พัฒนาทักษะการเกษตร\n- ส่งเสริมการท่องเที่ยวชุมชน\n\nสมัครได้ที่สำนักงาน อบต.บ้านโพธิ์",
        },
        {
          post_type_id: 1,
          date: "2024-02-10",
          title_name: "ประกาศเรื่องการจัดเก็บภาษี ประจำปี 2567",
          topic_name: "แจ้งกำหนดการชำระภาษีประจำปี",
          details:
            "องค์การบริหารส่วนตำบลบ้านโพธิ์ ขอแจ้งให้ประชาชนทราบเกี่ยวกับการจัดเก็บภาษีโรงเรือนและที่ดิน ประจำปี 2567\n\nกำหนดชำระ: 1 มกราคม - 30 เมษายน 2567\nสถานที่: สำนักงาน อบต.บ้านโพธิ์\nเวลา: 08.30-16.30 น. (วันจันทร์-ศุกร์)\n\nผู้ชำระภายในกำหนดจะได้รับส่วนลด",
        },
        {
          post_type_id: 1,
          date: "2024-02-15",
          title_name: "ข่าวประชาสัมพันธ์การให้บริการประชาชน",
          topic_name: "บริการใหม่เพื่อความสะดวกของประชาชน",
          details:
            "องค์การบริหารส่วนตำบลบ้านโพธิ์ เปิดให้บริการใหม่เพื่อความสะดวกของประชาชน\n\nบริการที่เพิ่ม:\n- รับชำระค่าน้ำ-ไฟ\n- ออกใบรับรองต่างๆ\n- บริการถ่าย เอกสาร\n- Wi-Fi ฟรีสำหรับประชาชน\n\nเปิดบริการทุกวันจันทร์-ศุกร์",
        },

        // กิจกรรม (postTypeId = 2)
        {
          post_type_id: 2,
          date: "2024-02-01",
          title_name: "กิจกรรมวันเด็กแห่งชาติ ประจำปี 2567",
          topic_name: "ร่วมสร้างสรรค์กิจกรรมเพื่อเด็กและเยาวชน",
          details:
            "องค์การบริหารส่วนตำบลบ้านโพธิ์ ขอเชิญชวนเด็กและเยาวชนในพื้นที่ร่วมกิจกรรมวันเด็กแห่งชาติ ประจำปี 2567\n\nกิจกรรมที่จัด:\n- การแสดงของเด็ก\n- เกมส์และกิจกรรมสนุกสนาน\n- แจกของขวัญและของรางวัล\n- อาหารและเครื่องดื่มฟรี\n\nวันที่: 13 มกราคม 2567\nเวลา: 08.00-12.00 น.\nสถานที่: ลานอเนกประสงค์ อบต.บ้านโพธิ์",
        },
        {
          post_type_id: 2,
          date: "2024-02-05",
          title_name: "กิจกรรมปลูกป่าชุมชน เพื่อสิ่งแวดล้อม",
          topic_name: "ร่วมกันปลูกป่าเพื่อลูกหลาน",
          details:
            "องค์การบริหารส่วนตำบลบ้านโพธิ์ ขอเชิญชวนประชาชนร่วมกิจกรรมปลูกป่าชุมชน\n\nรายละเอียดกิจกรรม:\n- ปลูกต้นไผ่และไม้ยืนต้น\n- จำนวน 500 ต้น\n- พื้นที่ปลูก: ป่าชุมชนบ้านโพธิ์\n- มีอาหารและเครื่องดื่มบริการ\n\nวันที่: 25 กุมภาพันธ์ 2567\nเวลา: 07.00-11.00 น.\nสถานที่นัดพบ: ที่ว่าการ อบต.บ้านโพธิ์",
        },
        {
          post_type_id: 2,
          date: "2024-02-10",
          title_name: "กิจกรรมแข่งขันกีฬาประจำปี",
          topic_name: "กีฬาเพื่อสุขภาพและความสามัคคี",
          details:
            "องค์การบริหารส่วนตำบลบ้านโพธิ์ จัดการแข่งขันกีฬาประจำปี 2567\n\nประเภทกีฬา:\n- ฟุตบอล\n- วอลเลย์บอล\n- ตะกร้อ\n- วิ่งมาราธอน\n\nรางวัล:\n- รางวัลชนะเลิศ 5,000 บาท\n- รางวัลรองชนะเลิศ 3,000 บาท\n\nสมัครได้ที่ อบต.บ้านโพธิ์ ถึงวันที่ 28 กุมภาพันธ์ 2567",
        },
        {
          post_type_id: 2,
          date: "2024-02-15",
          title_name: "กิจกรรมอบรมอาชีพเสริม",
          topic_name: "พัฒนาทักษะเพื่อสร้างรายได้",
          details:
            "องค์การบริหารส่วนตำบลบ้านโพธิ์ จัดอบรมอาชีพเสริมให้กับประชาชน\n\nหลักสูตรที่เปิดสอน:\n- การทำขนมไทย\n- การเลี้ยงปลาในบ่อซีเมนต์\n- การปลูกผักปลอดสารพิษ\n- การทำผลิตภัณฑ์จากผ้า\n\nค่าลงทะเบียน: ฟรี\nรับสมัคร 30 คนต่อหลักสูตร\nสมัครได้ที่สำนักงาน อบต.บ้านโพธิ์",
        },

        // ประกาศจัดซื้อจัดจ้าง (postTypeId = 3)
        {
          post_type_id: 3,
          date: "2024-02-01",
          title_name: "ประกาศจัดซื้อวัสดุก่อสร้าง ประจำปี 2567",
          topic_name: "จัดซื้อวัสดุก่อสร้างสำหรับโครงการพัฒนา",
          details:
            "องค์การบริหารส่วนตำบลบ้านโพธิ์ ประกาศจัดซื้อวัสดุก่อสร้าง ประจำปี 2567\n\nรายการจัดซื้อ:\n- ปูนซีเมนต์ จำนวน 200 ถุง\n- เหล็กเส้น ขนาดต่างๆ\n- อิฐมอญ จำนวน 10,000 ก้อน\n- ทรายหยาบ 50 ลูกบาศก์เมตร\n\nวงเงินงบประมาณ: 500,000 บาท\nกำหนดยื่นซอง: 15 กุมภาพันธ์ 2567\nเปิดซอง: 16 กุมภาพันธ์ 2567 เวลา 10.00 น.",
        },
        {
          post_type_id: 3,
          date: "2024-02-05",
          title_name: "ผลประกาศจัดซื้อวัสดุสำนักงาน",
          topic_name: "ประกาศผลการจัดซื้อวัสดุสำนักงาน ประจำปี 2567",
          details:
            "องค์การบริหารส่วนตำบลบ้านโพธิ์ ขอประกาศผลการจัดซื้อวัสดุสำนักงาน ประจำปี 2567\n\nผู้ได้รับการคัดเลือก:\nบริษัท ABC จำกัด\nวงเงิน: 150,000 บาท\n\nรายการที่จัดซื้อ:\n- กระดาษ A4\n- หมึกปริ้นเตอร์\n- อุปกรณ์เครื่องเขียน\n- วัสดุทำความสะอาด\n\nกำหนดส่งมอบ: 15 กุมภาพันธ์ 2567",
        },
        {
          post_type_id: 3,
          date: "2024-02-10",
          title_name: "ประกาศจัดจ้างก่อสร้างถนนคอนกรีต",
          topic_name: "จัดจ้างก่อสร้างถนนคอนกรีตเสริมเหล็ก หมู่ที่ 5",
          details:
            "องค์การบริหารส่วนตำบลบ้านโพธิ์ ประกาศจัดจ้างก่อสร้างถนนคอนกรีตเสริมเหล็ก\n\nรายละเอียดงาน:\n- สายทาง: บ้านดงมะไฟ หมู่ที่ 5\n- ระยะทาง: 1,200 เมตร\n- ความกว้าง: 5 เมตร\n- หนา: 0.15 เมตร\n\nวงเงินงบประมาณ: 3,600,000 บาท\nระยะเวลาก่อสร้าง: 120 วัน\nกำหนดยื่นซอง: 25 กุมภาพันธ์ 2567",
        },
        {
          post_type_id: 3,
          date: "2024-02-15",
          title_name: "รายงานผลการจัดซื้อจัดจ้าง ประจำเดือน มกราคม 2567",
          topic_name: "สรุปผลการดำเนินงานจัดซื้อจัดจ้าง",
          details:
            "องค์การบริหารส่วนตำบลบ้านโพธิ์ ขอรายงานผลการจัดซื้อจัดจ้าง ประจำเดือน มกราคม 2567\n\nสรุปผลการดำเนินงาน:\n- จำนวนโครงการที่ดำเนินการ: 8 โครงการ\n- วงเงินรวม: 2,450,000 บาท\n- โครงการที่เสร็จสิ้น: 5 โครงการ\n- โครงการที่อยู่ระหว่างดำเนินการ: 3 โครงการ\n\nรายละเอียดเพิ่มเติมสามารถดูได้ที่เว็บไซต์ หรือสอบถามที่สำนักงาน",
        },
      ];

      // ลบข้อมูลเก่าที่อาจซ้ำ
      await connection.execute(
        "DELETE FROM post_details WHERE post_type_id IN (1, 2, 3)"
      );

      // เพิ่มข้อมูลใหม่
      const createdPosts = [];
      for (const post of sampleData) {
        const [result] = await connection.execute(
          "INSERT INTO post_details (post_type_id, date, title_name, topic_name, details, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
          [
            post.post_type_id,
            post.date,
            post.title_name,
            post.topic_name,
            post.details,
          ]
        );
        createdPosts.push({ id: result.insertId, ...post });
      }

      // Commit transaction
      await connection.commit();

      // ตรวจสอบข้อมูลที่สร้างแล้ว
      const [newsCount] = await connection.execute(
        "SELECT COUNT(*) as count FROM post_details WHERE post_type_id = 1"
      );
      const [activitiesCount] = await connection.execute(
        "SELECT COUNT(*) as count FROM post_details WHERE post_type_id = 2"
      );
      const [financeCount] = await connection.execute(
        "SELECT COUNT(*) as count FROM post_details WHERE post_type_id = 3"
      );

      return NextResponse.json({
        success: true,
        message: "Production data fixed successfully!",
        data: {
          typesCreated: createdTypes.length,
          postsCreated: createdPosts.length,
          counts: {
            news: newsCount[0].count,
            activities: activitiesCount[0].count,
            finance: financeCount[0].count,
          },
        },
      });
    } catch (error) {
      // Rollback transaction on error
      await connection.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error fixing production data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fix production data",
        details: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
