import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";
    const typeId = searchParams.get("typeId") || "";
    const tab = searchParams.get("tab") || "";

    const skip = (page - 1) * limit;

    // Build where condition
    let whereCondition = {};

    // Search in section_name
    if (search) {
      whereCondition.section_name = {
        contains: search,
        mode: 'insensitive'
      };
    }

    // Filter by type_id
    if (typeId) {
      whereCondition.type_id = BigInt(typeId);
    }

    // Tab-based filtering based on actual law types
    if (tab && tab !== "all") {
      const tabKeywords = {
        "laws-regulations-ministry": ["กฎหมาย", "ระเบียบ", "ประกาศกระทรวง"],
        "royal-acts-decrees": ["พระราชบัญญัติ", "พระราชกฤษฎีกา"],
        "local-ordinances": ["ข้อบัญญัติ"]
      };

      if (tabKeywords[tab]) {
        // Use OR condition to match any of the keywords
        whereCondition.laws_regs_types = {
          OR: tabKeywords[tab].map(keyword => ({
            type_name: {
              contains: keyword,
              mode: 'insensitive'
            }
          }))
        };
      }
    }

    // Get total count
    const total = await prisma.laws_regs_sections.count({
      where: whereCondition,
    });

    // Get sections with related data
    const sections = await prisma.laws_regs_sections.findMany({
      where: whereCondition,
      include: {
        laws_regs_types: true,
        laws_regs_files: {
          take: 3,
          orderBy: {
            created_at: 'desc'
          }
        },
        _count: {
          select: {
            laws_regs_files: true
          }
        }
      },
      orderBy: {
        created_at: "desc",
      },
      skip,
      take: limit,
    });

    // Transform data to match expected format
    const transformedSections = sections.map(section => ({
      id: Number(section.id),
      section_name: section.section_name,
      type_id: section.type_id ? Number(section.type_id) : null,
      type_name: section.laws_regs_types?.type_name || "ไม่ระบุประเภท",
      created_at: section.created_at,
      updated_at: section.updated_at,
      files_count: section._count.laws_regs_files,
      recent_files: section.laws_regs_files.map(file => ({
        id: Number(file.id),
        files_path: file.files_path,
        files_type: file.files_type,
        original_name: file.files_path?.split('/').pop() || `ไฟล์ ${file.id}`,
        created_at: file.created_at
      }))
    }));

    return NextResponse.json({
      success: true,
      data: transformedSections,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching laws regulations sections:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch laws regulations sections",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { section_name, type_id } = body;

    // Validation
    if (!section_name || !type_id) {
      return NextResponse.json(
        { success: false, error: "Section name and type ID are required" },
        { status: 400 }
      );
    }

    // Create new section
    const section = await prisma.laws_regs_sections.create({
      data: {
        section_name,
        type_id: BigInt(type_id),
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        laws_regs_types: true,
      },
    });

    // Transform data
    const transformedSection = {
      id: Number(section.id),
      section_name: section.section_name,
      type_id: Number(section.type_id),
      type_name: section.laws_regs_types?.type_name || "ไม่ระบุประเภท",
      created_at: section.created_at,
      updated_at: section.updated_at,
    };

    return NextResponse.json({
      success: true,
      data: transformedSection,
      message: "Section created successfully",
    });
  } catch (error) {
    console.error("Error creating section:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create section",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const body = await request.json();
    const { section_name, type_id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Section ID is required" },
        { status: 400 }
      );
    }

    // Validation
    if (!section_name) {
      return NextResponse.json(
        { success: false, error: "Section name is required" },
        { status: 400 }
      );
    }

    // Update section
    const section = await prisma.laws_regs_sections.update({
      where: {
        id: BigInt(id),
      },
      data: {
        section_name,
        ...(type_id && { type_id: BigInt(type_id) }),
        updated_at: new Date(),
      },
      include: {
        laws_regs_types: true,
      },
    });

    // Transform data
    const transformedSection = {
      id: Number(section.id),
      section_name: section.section_name,
      type_id: Number(section.type_id),
      type_name: section.laws_regs_types?.type_name || "ไม่ระบุประเภท",
      created_at: section.created_at,
      updated_at: section.updated_at,
    };

    return NextResponse.json({
      success: true,
      data: transformedSection,
      message: "Section updated successfully",
    });
  } catch (error) {
    console.error("Error updating section:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update section",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Section ID is required" },
        { status: 400 }
      );
    }

    // Delete related files first
    await prisma.laws_regs_files.deleteMany({
      where: {
        section_id: BigInt(id),
      },
    });

    // Delete section
    await prisma.laws_regs_sections.delete({
      where: {
        id: BigInt(id),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting section:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete section",
        details: error.message,
      },
      { status: 500 }
    );
  }
}