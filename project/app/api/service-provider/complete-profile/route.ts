import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const client = await clientPromise;
    const db = client.db("Cumma");

    // Update service provider profile
    const result = await db.collection("Service Provider").updateOne(
      { userId: data.userId },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Service provider profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Profile updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}