import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import crypto from "crypto";


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      serviceName,
      contactNumber,
      userType,
      authProvider,
    } = body;

    const client = await clientPromise;
    const db = client.db("Cumma");

    // Check if user already exists
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
    const hash = crypto.createHash('md5').update(email).digest('hex');
    const userId = new ObjectId(hash.substring(0, 24));

    // Create user
    const user = await db.collection("Users").insertOne({
      _id: userId,
      email,
      password: hashedPassword,
      userType: "Service Provider",
      authProvider,
      authProviderId: userId.toString(),
      isEmailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create initial service provider profile
    await db.collection("Service Provider").insertOne({
      userId: user.insertedId,
      serviceProviderType: null,
      serviceName,
      address: null,
      city: null,
      stateProvince: null,
      zipPostalCode: null,
      primaryContact1Name: null,
      primaryContact1Designation: null,
      contact2Name: null,
      contact2Designation: null,
      primaryContactNumber: contactNumber,
      alternateContactNumber: null,
      primaryEmailId: email,
      alternateEmailId: null,
      logoUrl: null,
      websiteUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}