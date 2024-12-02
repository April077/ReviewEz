import prisma from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, SpaceId } = await req.json();

    // Validate the input
    if (!email || !SpaceId) {
      return NextResponse.json(
        { message: "Email and SpaceId are required" },
        { status: 400 }
      );
    }

    console.log("Received email:", email);
    console.log("Received SpaceId:", SpaceId);

    const duplicateReview = await prisma.review.findFirst({
      where: { email, SpaceId },
    });

    if (duplicateReview) {
      console.log("Duplicate review found:", duplicateReview);
      return NextResponse.json(
        { message: "Duplicate Review" },
        { status: 409 }
      );
    } else {
      console.log("No duplicate review found, creating new review.");
      return NextResponse.json({ message: "New Review" }, { status: 200 });
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json("Server error", { status: 500 });
  }
}
