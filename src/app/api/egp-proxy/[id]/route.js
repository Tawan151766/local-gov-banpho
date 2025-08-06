import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Database connection configuration
const dbConfig = {
  host: "103.80.48.25",
  port: 3306,
  user: "gmsky_egp",
  password: "6Ll*65iu6",
  database: "gmsky_egp",
};

export async function GET(request, { params }) {
  let connection;

  try {
    const { id } = params;
    console.log(`Starting EGP API request with ID: ${id}`);

    // Validate ID parameter
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "ID parameter is required",
          data: []
        },
        { status: 400 }
      );
    }

    // Create database connection
    connection = await mysql.createConnection(dbConfig);

    // Get announcements data from egp_announcements table with specific deptsub_id
    const [announcements] = await connection.execute(
      `SELECT 
        id,
        deptsub_id,
        announce_type,
        link,
        title,
        description,
        pub_date,
        created_at
      FROM egp_announcements 
      WHERE deptsub_id = ?
      ORDER BY pub_date DESC, created_at DESC`,
      [id]
    );

    console.log(
      `Successfully fetched ${announcements.length} EGP announcements for ID: ${id}`
    );

    // Transform data to match expected format
    const transformedData = announcements.map((record) => ({
      id: record.id,
      deptsub_id: record.deptsub_id,
      announce_type: record.announce_type,
      link: record.link,
      title: record.title,
      description: record.description,
      pub_date: record.pub_date
        ? new Date(record.pub_date).toISOString().split("T")[0]
        : null,
      created_at: record.created_at
        ? new Date(record.created_at).toISOString()
        : null,
      type_name: "ประกาศ EGP", // Add type_name for consistency
    }));

    // Return data in the expected format
    return NextResponse.json(
      {
        success: true,
        data: transformedData,
        count: transformedData.length,
        message: `Found ${transformedData.length} EGP announcements for ID: ${id}`
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    console.error(`EGP API proxy error for ID ${params?.id}:`, error.message);

    // Return fallback data when database connection fails
    const fallbackData = {
      success: true,
      data: [
        {
          id: 1,
          deptsub_id: params?.id || "1509900857",
          announce_type: "15",
          title: "ประกวดราคาจ้างก่อสร้างโครงการก่อสร้างอาคารสำนักงานเทศบาลตำบลบ้านโพธิ์ ด้วยวิธีประกวดราคาอิเล็กทรอนิกส์ (e-bidding)",
          link: "https://process5.gprocurement.go.th/egp-upload-service/v1/downloadFileTest?fileId=85ee437146634121aa32686ccf7df250",
          pub_date: "2025-08-04",
          type_name: "ประกาศ EGP",
        },
        {
          id: 2,
          deptsub_id: params?.id || "1509900857",
          announce_type: "D0",
          title: "ผลประกาศจ้างก่อสร้างโครงการก่อสร้างอาคารสำนักงานเทศบาลตำบลบ้านโพธิ์",
          link: "https://process5.gprocurement.go.th/egp-template-service/dwnt/view-pdf-file?templateId=db7c27d6-0e09-4bad-8406-e6261687771b",
          pub_date: "2025-08-04",
          type_name: "ประกาศ EGP",
        },
        {
          id: 3,
          deptsub_id: params?.id || "1509900857",
          announce_type: "W1",
          title: "จ้างเหมารถยนต์โดยสารปรับอากาศแบบมาตรฐาน ม๔(ข) ขนาดไม่น้อยกว่า ๔๔ ที่นั่ง จำนวน ๑ คัน โดยวิธีเฉพาะเจาะจง",
          link: "http://process.gprocurement.go.th/egp2procmainWeb/jsp/procsearch.sch?servlet=gojsp&proc_id=ShowHTMLFile&processFlows=Procure&projectId=68079475717&templateType=W2&temp_Announ=D&temp_itemNo=1&seqNo=2",
          pub_date: "2025-07-31",
          type_name: "ประกาศ EGP",
        }
      ],
      count: 3,
      message: `Fallback data for ID: ${params?.id || "1509900857"} (Database connection failed)`
    };

    console.log(`Database connection failed, returning fallback data for ID: ${params?.id}`);
    return NextResponse.json(fallbackData, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
