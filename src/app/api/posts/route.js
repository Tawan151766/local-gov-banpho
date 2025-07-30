import { NextResponse } from 'next/server';

// Mock data for testing - replace this with your actual database connection
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

    // Filter by type if specified
    let filteredPosts = mockActivities;
    if (type) {
      filteredPosts = mockActivities.filter(post => post.type === type);
    }

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