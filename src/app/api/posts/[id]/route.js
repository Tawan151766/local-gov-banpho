import { NextResponse } from 'next/server';

// Mock news data
const mockNews = [
  {
    id: 101,
    title: "ประกาศรับสมัครงานเทศบาลตำบลบ้านโพธิ์",
    content: `เทศบาลตำบลบ้านโพธิ์ ประกาศรับสมัครบุคคลเพื่อบรรจุและแต่งตั้งเป็นพนักงานเทศบาล ตำแหน่งนักวิชาการสาธารณสุข จำนวน 2 อัตรา

คุณสมบัติเฉพาะตำแหน่ง:
- วุฒิปริญญาตรีสาขาสาธารณสุขศาสตร์ หรือสาขาที่เกี่ยวข้อง
- มีใบประกอบวิชาชีพที่ถูกต้องตามกฎหมาย
- มีประสบการณ์การทำงานไม่น้อยกว่า 1 ปี

วิธีการสมัคร:
- ยื่นใบสมัครด้วยตนเองที่สำนักงานเทศบาล
- ระยะเวลารับสมัคร: 1-15 สิงหาคม 2567
- เวลา: 08.30-16.30 น. (วันจันทร์-ศุกร์)

เอกสารประกอบการสมัคร:
- ใบสมัครงาน (รับได้ที่เทศบาล)
- สำเนาบัตรประชาชน
- สำเนาทะเบียนบ้าน
- สำเนาวุฒิการศึกษา
- สำเนาใบประกอบวิชาชีพ`,
    image: "/image/Boat.jpg",
    created_at: "2024-07-29T10:00:00Z",
    type: "ข่าวประชาสัมพันธ์",
    location: "สำนักงานเทศบาลตำบลบ้านโพธิ์",
    organizer: "เทศบาลตำบลบ้านโพธิ์"
  },
  {
    id: 102,
    title: "ประชาสัมพันธ์การจัดเก็บภาษีโรงเรือนและที่ดิน",
    content: `เทศบาลตำบลบ้านโพธิ์ ขอประชาสัมพันธ์การจัดเก็บภาษีโรงเรือนและที่ดิน ประจำปี 2567

รายละเอียดการชำระ:
- ระยะเวลาชำระ: 1 สิงหาคม - 30 กันยายน 2567
- สถานที่ชำระ: สำนักงานเทศบาลตำบลบ้านโพธิ์
- เวลาทำการ: 08.30-16.30 น. (วันจันทร์-ศุกร์)

เอกสารที่ต้องนำมา:
- บัตรประชาชน
- ใบแจ้งภาษี (ถ้ามี)
- หลักฐานกรรมสิทธิ์ที่ดิน

สิทธิประโยชน์:
- ชำระภายในเดือนสิงหาคม ลดหย่อน 10%
- ชำระภายในเดือนกันยายน ลดหย่อน 5%

สอบถามเพิ่มเติม: โทร 038-123456`,
    image: "/image/Boat.jpg",
    created_at: "2024-07-28T14:30:00Z",
    type: "ข่าวประชาสัมพันธ์",
    location: "สำนักงานเทศบาลตำบลบ้านโพธิ์",
    organizer: "เทศบาลตำบลบ้านโพธิ์"
  }
];

// Mock activities data
const mockActivities = [
  {
    id: 1,
    title: "กิจกรรมปลูกป่าชุมชน",
    content: `เทศบาลตำบลบ้านโพธิ์ จัดกิจกรรมปลูกป่าชุมชน เพื่อสร้างจิตสำนึกในการอนุรักษ์สิ่งแวดล้อม และเพิ่มพื้นที่สีเขียวให้กับชุมชน

กิจกรรมนี้เป็นส่วนหนึ่งของโครงการอนุรักษ์สิ่งแวดล้อมของเทศบาล โดยมีการเชิญชวนประชาชนในพื้นที่ร่วมกันปลูกต้นไม้ในบริเวณที่เหมาะสม

ผลที่คาดหวัง:
- เพิ่มพื้นที่สีเขียวในชุมชน
- สร้างจิตสำนึกด้านสิ่งแวดล้อม
- ส่งเสริมการมีส่วนร่วมของประชาชน
- ปรับปรุงคุณภาพอากาศในพื้นที่`,
    image: "/image/Boat.jpg",
    created_at: "2024-01-15T10:00:00Z",
    type: "กิจกรรม",
    location: "บริเวณสวนสาธารณะตำบลบ้านโพธิ์",
    organizer: "เทศบาลตำบลบ้านโพธิ์"
  },
  {
    id: 2,
    title: "งานประเพณีสงกรานต์",
    content: `จัดงานประเพณีสงกรานต์ประจำปี พร้อมกิจกรรมสรงน้ำพระพุทธรูป รดน้ำดำหัวผู้สูงอายุ และกิจกรรมสันทนาการต่างๆ

งานประเพณีสงกรานต์เป็นงานประจำปีที่สำคัญของชุมชน เป็นการสืบทอดประเพณีไทยและเสริมสร้างความสามัคคีในชุมชน

กิจกรรมภายในงาน:
- พิธีสรงน้ำพระพุทธรูป
- พิธีรดน้ำดำหัวผู้สูงอายุ
- การแสดงพื้นบ้าน
- กิจกรรมเล่นน้ำแบบประเพณี
- จำหน่ายอาหารและของที่ระลึก`,
    image: "/image/Boat.jpg",
    created_at: "2024-04-13T09:00:00Z",
    type: "กิจกรรม",
    location: "ลานอเนกประสงค์เทศบาลตำบลบ้านโพธิ์",
    organizer: "เทศบาลตำบลบ้านโพธิ์ ร่วมกับชุมชน"
  }
];

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Combine all posts and find by ID
    const allPosts = [...mockNews, ...mockActivities];
    const post = allPosts.find(item => item.id === parseInt(id));
    
    if (!post) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Post not found',
          post: null
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      post: post
    });

  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch post',
        post: null
      },
      { status: 500 }
    );
  }
}

// TODO: Replace mock data with actual database queries
// Example with a database:
/*
import { connectToDatabase } from '@/lib/mongodb'; // or your database connection

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { db } = await connectToDatabase();
    
    const post = await db
      .collection('posts')
      .findOne({ _id: new ObjectId(id) });

    if (!post) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Post not found',
          post: null
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      post: post
    });

  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch post',
        post: null
      },
      { status: 500 }
    );
  }
}
*/