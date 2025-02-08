import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const client = await clientPromise;
    const db = client.db("Cumma");

    // Get the service provider ID from the session
    const serviceProvider = await db.collection("Service Provider").findOne({
      userId: new ObjectId(session.user.id)
    });

    if (!serviceProvider) {
      return NextResponse.json(
        { error: "Service provider not found" },
        { status: 404 }
      );
    }

    const facility = {
      _id: new ObjectId(),
      serviceProviderId: serviceProvider._id,
      facilityType: data.facilityType,
      status: "pending",
      details: data.details,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("Facilities").insertOne(facility);

    return NextResponse.json(
      { message: "Facility created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating facility:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 