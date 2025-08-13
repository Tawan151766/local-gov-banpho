import { NextResponse } from "next/server";
import { GET as getPostAPI } from "../../posts/[id]/route.js";

// GET - ดึงข้อมูลเอกสารเผยแพร่เดียว
export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "กรุณาระบุ ID ของเอกสาร" },
        { status: 400 }
      );
    }

    // Call posts API directly
    const response = await getPostAPI(request, { params });
    const data = await response.json();
    
    if (!data.success) {
      return NextResponse.json(
        { success: false, error: data.error || "ไม่พบเอกสารที่ต้องการ" },
        { status: 404 }
      );
    }

    // Check if it's the correct post type
    if (data.data.type_name !== 'เอกสารเผยแพร่') {
      return NextResponse.json(
        { success: false, error: "ไม่พบเอกสารที่ต้องการ" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("Get public document error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}