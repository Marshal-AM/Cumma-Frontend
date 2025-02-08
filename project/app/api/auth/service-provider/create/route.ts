import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { user, serviceProvider } = await request.json();

    const client = await clientPromise;
    const db = client.db("Cumma");

    // Check if user already exists
    const existingUser = await db.collection("Users").findOne({ email: user.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(user.password, 12);

    // Generate ObjectId for local auth
    const hash = crypto.createHash('md5').update(user.email).digest('hex');
    const userId = new ObjectId(hash.substring(0, 24));

    // Create user
    const userDoc = {
      _id: userId,
      email: user.email,
      password: hashedPassword,
      userType: "Service Provider",
      authProvider: user.authProvider,
      authProviderId: userId.toString(),
      isEmailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create service provider document
    const serviceProviderDoc = {
      userId,
      ...serviceProvider,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Start a session for the transaction
    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        // Insert user
        await db.collection("Users").insertOne(userDoc, { session });
        
        // Insert service provider
        await db.collection("Service Provider").insertOne(serviceProviderDoc, { session });
      });

      await session.endSession();

      return NextResponse.json(
        { message: "Account created successfully" },
        { status: 201 }
      );
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw error;
    }
  } catch (error) {
    console.error("Account creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}