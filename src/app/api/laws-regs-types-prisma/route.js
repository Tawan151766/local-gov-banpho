import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Build where condition
    let whereCondition = {};

    // Search in type_name
    if (search) {
      whereCondition.type_name = {
        contains: search,
        mode: 'insensitive'
      };
    }

    // Get total count
    const total = await prisma.laws_regs_types.count({
      where: whereCondition,
    });

    // Get types
    const types = await prisma.laws_regs_types.findMany({
      where: whereCondition,
      orderBy: {
        created_at: "desc",
      },
      skip,
      take: limit,
    });

    // Transform data to match expected format
    const transformedTypes = types.map(type => ({
      id: Number(type.id),
      type_name: type.type_name,
      created_at: type.created_at,
      updated_at: type.updated_at,
    }));

    return NextResponse.json({
      success: true,
      data: transformedTypes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching laws regulations types:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch laws regulations types",
        details: error.message,
      },
      { status: 500 }
    );
  }
}