import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import crypto from "crypto";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      startupName,
      contactNumber,
      contactName,
      userType,
      authProvider,
    } = body;

    const client = await clientPromise;
    const db = client.db("Cumma");

    // Check if user already exists by email
    const existingUser = await db.collection("Users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate ObjectId for local auth
    let userId;
    if (authProvider === 'local') {
      // Create a hash of the email
      const hash = crypto.createHash('md5').update(email).digest('hex');
      // Use the first 24 characters of the hash for the ObjectId
      userId = new ObjectId(hash.substring(0, 24));
    }

    // Create user with custom _id for local auth
    const user = await db.collection("Users").insertOne({
      ...(authProvider === 'local' && { _id: userId }), // Only set _id for local auth
      email,
      password: hashedPassword,
      userType,
      authProvider,
      authProviderId: userId?.toString() || null, // Use the ObjectId string as authProviderId
      isEmailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create startup profile only if the userType is "startup"
    if (userType === "startup") {
      await db.collection("Startups").insertOne({
        userId: user.insertedId,  // Reference the user's ObjectId
        startupName,
        contactName,
        contactNumber,
        address: null,
        logoUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);

    // Handle specific MongoDB duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "User already exists with this authentication method" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}