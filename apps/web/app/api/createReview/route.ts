import prisma from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, SpaceId, ...restData } = await req.json();

    // Check for duplicate review
    const duplicateReview = await prisma.review.findFirst({
      where: { email, SpaceId },
    });

    if (duplicateReview) {
      return NextResponse.json(
        { message: "You have already submitted a review for this space." },
        { status: 409 }
      );
    }

    // Create a new review
    const review = await prisma.review.create({
      data: { email, SpaceId, ...restData },
    });

    return NextResponse.json(
      { message: "Review submitted successfully", obj: review },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
