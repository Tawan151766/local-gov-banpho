import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Section ID is required" },
        { status: 400 }
      );
    }

    // Get section with related data
    const section = await prisma.laws_regs_sections.findUnique({
      where: {
        id: BigInt(id),
      },
      include: {
        laws_regs_types: true,
        laws_regs_files: {
          orderBy: {
            created_at: 'desc'
          }
        }
      }
    });

    if (!section) {
      return NextResponse.json(
        { success: false, error: "Section not found" },
        { status: 404 }
      );
    }

    // Transform data to match expected format
    const transformedSection = {
      id: Number(section.id),
      section_name: section.section_name,
      type_id: section.type_id ? Number(section.type_id) : null,
      type_name: section.laws_regs_types?.type_name || "ไม่ระบุประเภท",
      created_at: section.created_at,
      updated_at: section.updated_at,
      files: section.laws_regs_files.map(file => ({
        id: Number(file.id),
        files_path: file.files_path,
        files_type: file.files_type,
        original_name: file.files_path?.split('/').pop() || `ไฟล์ ${file.id}`,
        created_at: file.created_at
      }))
    };

    return NextResponse.json({
      success: true,
      data: transformedSection,
    });
  } catch (error) {
    console.error("Error fetching section detail:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch section detail",
        details: error.message,
      },
      { status: 500 }
    );
  }
}