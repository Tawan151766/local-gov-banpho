import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department");
    const includeEmpty = searchParams.get("includeEmpty") === "true";
    const roleType = searchParams.get("role_type");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const adminMode = searchParams.get("admin") === "true";

    let whereCondition = {};

    // For admin mode, show all records including inactive ones
    if (!adminMode) {
      whereCondition.is_active = true;
    }

    if (department) {
      whereCondition.department = department;
    }

    if (roleType) {
      whereCondition.role_type = roleType;
    }

    if (!includeEmpty && !adminMode) {
      whereCondition.is_empty = false;
    }

    // For admin mode, return flat list with pagination
    if (adminMode) {
      const skip = (page - 1) * limit;
      
      const [people, total] = await Promise.all([
        prisma.peopleManagement.findMany({
          where: whereCondition,
          orderBy: [{ level: "asc" }, { sort_order: "asc" }, { id: "asc" }],
          skip,
          take: limit,
        }),
        prisma.peopleManagement.count({ where: whereCondition }),
      ]);

      // Convert BigInt to string for JSON serialization
      const serializedPeople = people.map((person) => ({
        ...person,
        id: person.id.toString(),
      }));

      return NextResponse.json({
        success: true,
        data: serializedPeople,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    }

    // Original structured response for frontend
    const people = await prisma.peopleManagement.findMany({
      where: whereCondition,
      orderBy: [{ level: "asc" }, { sort_order: "asc" }, { id: "asc" }],
    });

    // Convert BigInt to string for JSON serialization
    const serializedPeople = people.map((person) => ({
      ...person,
      id: person.id.toString(),
    }));

    // Group by department and structure the data
    const structuredData = {
      executives: serializedPeople.filter((p) => p.department === "executive"),
      council: {
        leadership: serializedPeople.filter(
          (p) =>
            p.department === "council" &&
            (p.position.includes("ประธาน") || p.position.includes("รองประธาน"))
        ),
        district1: serializedPeople.filter(
          (p) => p.department === "council" && p.district === "เขต 1"
        ),
        district2: serializedPeople.filter(
          (p) => p.department === "council" && p.district === "เขต 2"
        ),
      },
      departments: {
        clerk: {
          title: "สำนักปลัดเทศบาล",
          color: "from-blue-500 to-blue-600",
          head: serializedPeople.find(
            (p) => p.department === "clerk" && p.role_type === "head"
          ),
          staff: serializedPeople.filter(
            (p) => p.department === "clerk" && p.role_type !== "head"
          ),
        },
        finance: {
          title: "กองคลัง",
          color: "from-green-500 to-green-600",
          head: serializedPeople.find(
            (p) => p.department === "finance" && p.role_type === "head"
          ),
          staff: serializedPeople.filter(
            (p) => p.department === "finance" && p.role_type !== "head"
          ),
        },
        engineering: {
          title: "กองช่าง",
          color: "from-orange-500 to-orange-600",
          head: serializedPeople.find(
            (p) => p.department === "engineering" && p.role_type === "head"
          ),
          staff: serializedPeople.filter(
            (p) => p.department === "engineering" && p.role_type !== "head"
          ),
        },
        education: {
          title: "กองการศึกษาฯ",
          color: "from-purple-500 to-purple-600",
          head: serializedPeople.find(
            (p) => p.department === "education" && p.role_type === "head"
          ),
          staff: serializedPeople.filter(
            (p) => p.department === "education" && p.role_type !== "head"
          ),
        },
      },
      audit: serializedPeople.filter((p) => p.department === "audit"),
    };

    return NextResponse.json({
      success: true,
      data: structuredData,
    });
  } catch (error) {
    console.error("Error fetching people management:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch people management data",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      full_name,
      position,
      phone,
      email,
      department,
      sub_department,
      role_type,
      level,
      sort_order,
      district,
      img,
      is_empty,
    } = body;

    // Validation
    if (!full_name || !position || !department) {
      return NextResponse.json(
        {
          success: false,
          error: "Full name, position, and department are required",
        },
        { status: 400 }
      );
    }

    const person = await prisma.peopleManagement.create({
      data: {
        full_name,
        position,
        phone,
        email,
        department,
        sub_department,
        role_type: role_type || "staff",
        level: level || 0,
        sort_order: sort_order || 0,
        district,
        img,
        is_empty: is_empty || false,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...person,
        id: person.id.toString(),
      },
      message: "Person created successfully",
    });
  } catch (error) {
    console.error("Error creating person:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create person",
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

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Person ID is required" },
        { status: 400 }
      );
    }

    const person = await prisma.peopleManagement.update({
      where: { id: BigInt(id) },
      data: {
        ...body,
        updated_at: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...person,
        id: person.id.toString(),
      },
      message: "Person updated successfully",
    });
  } catch (error) {
    console.error("Error updating person:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update person",
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
        { success: false, error: "Person ID is required" },
        { status: 400 }
      );
    }

    await prisma.peopleManagement.delete({
      where: { id: BigInt(id) },
    });

    return NextResponse.json({
      success: true,
      message: "Person deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting person:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete person",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
