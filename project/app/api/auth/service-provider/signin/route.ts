import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const client = await clientPromise;
    const db = client.db("Cumma");

    // Find user
    const user = await db.collection("Users").findOne({ 
      email,
      userType: "Service Provider"
    });

    if (!user) {
      return NextResponse.json(
        { error: "Only Service Provider accounts can log in here" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if profile is complete
    const serviceProvider = await db.collection("Service Provider").findOne({
      userId: user._id
    });

    const requiresDetails = !serviceProvider || Object.values(serviceProvider).some(
      value => value === null || value === undefined
    );

    return NextResponse.json({
      message: "Signed in successfully",
      requiresDetails
    }, { status: 200 });
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}