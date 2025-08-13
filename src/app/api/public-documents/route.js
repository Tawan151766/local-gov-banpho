import { NextResponse } from "next/server";
import { GET as getPostsAPI } from "../posts/route.js";

// GET - ดึงรายการเอกสารเผยแพร่
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "12";
    const search = searchParams.get("search") || "";

    // Create new URL with posts API parameters
    const postsUrl = new URL(request.url);
    postsUrl.searchParams.set("type", "เอกสารเผยแพร่");
    postsUrl.searchParams.set("page", page);
    postsUrl.searchParams.set("limit", limit);

    if (search.trim()) {
      postsUrl.searchParams.set("search", search.trim());
    }

    // Create new request object for posts API
    const postsRequest = new Request(postsUrl.toString(), {
      method: "GET",
      headers: request.headers,
    });

    // Call posts API directly
    const response = await getPostsAPI(postsRequest);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Get public documents error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get public documents",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
