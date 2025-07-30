import { NextResponse } from 'next/server';

// Mock data for testing - replace this with your actual database connection
const mockNews = [
  {
    id: 101,
    title: "ประกาศรับสมัครงานเทศบาลตำบลบ้านโพธิ์",
    content: "เทศบาลตำบลบ้านโพธิ์ ประกาศรับสมัครบุคคลเพื่อบรรจุและแต่งตั้งเป็นพนักงานเทศบาล ตำแหน่งนักวิชาการสาธารณสุข จำนวน 2 อัตรา โดยมีคุณสมบัติเฉพาะตำแหน่ง ได้แก่ วุฒิปริญญาตรีสาขาสาธารณสุขศาสตร์ หรือสาขาที่เกี่ยวข้อง",
    image: "/image/Boat.jpg",
    created_at: "2024-07-29T10:00:00Z",
    type: "ข่าวประชาสัมพันธ์"
  },
  {
    id: 102,
    title: "ประชาสัมพันธ์การจัดเก็บภาษีโรงเรือนและที่ดิน",
    content: "เทศบาลตำบลบ้านโพธิ์ ขอประชาสัมพันธ์การจัดเก็บภาษีโรงเรือนและที่ดิน ประจำปี 2567 โดยผู้มีหน้าที่เสียภาษีสามารถมาชำระได้ที่สำนักงานเทศบาล ตั้งแต่วันที่ 1 สิงหาคม - 30 กันยายน 2567",
    image: "/image/Boat.jpg",
    created_at: "2024-07-28T14:30:00Z",
    type: "ข่าวประชาสัมพันธ์"
  },
  {
    id: 103,
    title: "ขอเชิญร่วมงานประเพณีแห่เทียนพรรษา",
    content: "เทศบาลตำบลบ้านโพธิ์ ขอเชิญชาวบ้านร่วมงานประเพณีแห่เทียนพรรษา ประจำปี 2567 ในวันที่ 21 กรกฎาคม 2567 เวลา 16.00 น. ณ วัดบ้านโพธิ์ พร้อมกิจกรรมการแสดงพื้นบ้านและอาหารเพื่อการกุศล",
    image: "/image/Boat.jpg",
    created_at: "2024-07-27T09:15:00Z",
    type: "ข่าวประชาสัมพันธ์"
  },
  {
    id: 104,
    title: "ประกาศปิดถนนชั่วคราวเพื่อซ่อมแซม",
    content: "เทศบาลตำบลบ้านโพธิ์ ประกาศปิดการจราจรบนถนนสายหลัก (หน้าตลาดบ้านโพธิ์) เพื่อทำการซ่อมแซมท่อประปาหลัก ระหว่างวันที่ 30 กรกฎาคม - 2 สิงหาคม 2567 ขออภัยในความไม่สะดวก",
    image: "/image/Boat.jpg",
    created_at: "2024-07-26T11:45:00Z",
    type: "ข่าวประชาสัมพันธ์"
  },
  {
    id: 105,
    title: "เปิดรับสมัครโครงการอบรมคอมพิวเตอร์ฟรี",
    content: "เทศบาลตำบลบ้านโพธิ์ เปิดรับสมัครโครงการอบรมคอมพิวเตอร์เบื้องต้นฟรี สำหรับประชาชนทุกเพศทุกวัย จำนวน 30 คน รับสมัครตั้งแต่วันที่ 1-15 สิงหาคม 2567 ที่สำนักงานเทศบาล",
    image: "/image/Boat.jpg",
    created_at: "2024-07-25T13:20:00Z",
    type: "ข่าวประชาสัมพันธ์"
  },
  {
    id: 106,
    title: "ประชาสัมพันธ์บริการฉีดวัคซีนสัตว์เลี้ยงฟรี",
    content: "เทศบาลตำบลบ้านโพธิ์ จัดบริการฉีดวัคซีนป้องกันโรคพิษสุนัขบ้าและโรคต่างๆ ให้สัตว์เลี้ยงฟรี ในวันที่ 5 สิงหาคม 2567 เวลา 09.00-16.00 น. ณ ลานอเนกประสงค์เทศบาล",
    image: "/image/Boat.jpg",
    created_at: "2024-07-24T08:30:00Z",
    type: "ข่าวประชาสัมพันธ์"
  },
  {
    id: 107,
    title: "ขอความร่วมมือประหยัดน้ำในช่วงฤดูแล้ง",
    content: "เทศบาลตำบลบ้านโพธิ์ ขอความร่วมมือจากประชาชนในการประหยัดน้ำใช้ในช่วงฤดูแล้ง เนื่องจากระดับน้ำในแหล่งน้ำดิบลดลง เพื่อให้มีน้ำใช้อย่างเพียงพอตลอดฤดูแล้ง",
    image: "/image/Boat.jpg",
    created_at: "2024-07-23T15:10:00Z",
    type: "ข่าวประชาสัมพันธ์"
  },
  {
    id: 108,
    title: "ประกาศผลการสอบคัดเลือกพนักงานจ้าง",
    content: "เทศบาลตำบลบ้านโพธิ์ ประกาศผลการสอบคัดเลือกบุคคลเพื่อจ้างเป็นพนักงานจ้างตามภารกิจ ตำแหน่งผู้ช่วยเจ้าหน้าที่ธุรการ ผู้ผ่านการคัดเลือกสามารถตรวจสอบได้ที่บอร์ดประกาศหน้าสำนักงานเทศบาล",
    image: "/image/Boat.jpg",
    created_at: "2024-07-22T12:00:00Z",
    type: "ข่าวประชาสัมพันธ์"
  }
];

const mockActivities = [
  {
    id: 1,
    title: "กิจกรรมปลูกป่าชุมชน",
    content: "เทศบาลตำบลบ้านโพธิ์ จัดกิจกรรมปลูกป่าชุมชน เพื่อสร้างจิตสำนึกในการอนุรักษ์สิ่งแวดล้อม และเพิ่มพื้นที่สีเขียวให้กับชุมชน",
    image: "/image/Boat.jpg",
    created_at: "2024-01-15T10:00:00Z",
    type: "กิจกรรม"
  },
  {
    id: 2,
    title: "งานประเพณีสงกรานต์",
    content: "จัดงานประเพณีสงกรานต์ประจำปี พร้อมกิจกรรมสรงน้ำพระพุทธรูป รดน้ำดำหัวผู้สูงอายุ และกิจกรรมสันทนาการต่างๆ",
    image: "/image/Boat.jpg",
    created_at: "2024-04-13T09:00:00Z",
    type: "กิจกรรม"
  },
  {
    id: 3,
    title: "โครงการอบรมอาชีพ",
    content: "จัดอบรมอาชีพให้กับประชาชนในพื้นที่ เพื่อเพิ่มทักษะและสร้างรายได้เสริม ในหลักสูตรต่างๆ เช่น การทำขนม การเย็บผ้า",
    image: "/image/Boat.jpg",
    created_at: "2024-03-20T14:00:00Z",
    type: "กิจกรรม"
  },
  {
    id: 4,
    title: "กิจกรรมวันเด็กแห่งชาติ",
    content: "จัดงานวันเด็กแห่งชาติ พร้อมกิจกรรมสนุกสนาน ของรางวัล และการแสดงต่างๆ เพื่อส่งเสริมพัฒนาการของเด็กในชุมชน",
    image: "/image/Boat.jpg",
    created_at: "2024-01-13T08:00:00Z",
    type: "กิจกรรม"
  },
  {
    id: 5,
    title: "โครงการตรวจสุขภาพฟรี",
    content: "จัดโครงการตรวจสุขภาพฟรีให้กับประชาชน ร่วมกับโรงพยาบาลส่งเสริมสุขภาพตำบล เพื่อดูแลสุขภาพชุมชน",
    image: "/image/Boat.jpg",
    created_at: "2024-02-28T13:00:00Z",
    type: "กิจกรรม"
  },
  {
    id: 6,
    title: "กิจกรรมทำความสะอาดชุมชน",
    content: "ชาวบ้านร่วมใจทำความสะอาดชุมชน เก็บขยะ ปรับปรุงภูมิทัศน์ เพื่อให้ชุมชนน่าอยู่และสวยงาม",
    image: "/image/Boat.jpg",
    created_at: "2024-05-10T07:00:00Z",
    type: "กิจกรรม"
  }
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit')) || 10;

    // Combine all posts
    const allPosts = [...mockNews, ...mockActivities];

    // Filter by type if specified
    let filteredPosts = allPosts;
    if (type) {
      filteredPosts = allPosts.filter(post => post.type === type);
    }

    // Sort by date (newest first)
    filteredPosts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Apply limit
    const limitedPosts = filteredPosts.slice(0, limit);

    return NextResponse.json({
      success: true,
      posts: limitedPosts,
      total: filteredPosts.length
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch posts',
        posts: []
      },
      { status: 500 }
    );
  }
}

// TODO: Replace mock data with actual database queries
// Example with a database:
/*
import { connectToDatabase } from '@/lib/mongodb'; // or your database connection

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit')) || 10;

    const { db } = await connectToDatabase();
    
    let query = {};
    if (type) {
      query.type = type;
    }

    const posts = await db
      .collection('posts')
      .find(query)
      .sort({ created_at: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      posts: posts,
      total: posts.length
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch posts',
        posts: []
      },
      { status: 500 }
    );
  }
}
*/