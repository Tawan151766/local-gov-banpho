import { NextResponse } from "next/server";

// POST - เพิ่มจำนวนการดูเอกสาร
export async function POST(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "กรุณาระบุ ID ของเอกสาร" },
        { status: 400 }
      );
    }

    // For now, just return success since view tracking might not be implemented in posts API
    // This can be enhanced later when view tracking is added to the posts system
    return NextResponse.json({
      success: true,
      data: {
        view_count: 1
      }
    });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}