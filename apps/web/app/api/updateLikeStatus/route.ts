import prisma from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { reviewId, liked } = await req.json();

    if (!reviewId || typeof liked !== "boolean") {
      return NextResponse.json({ error: "Invalid data provided." }, { status: 400 });
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: { liked },
    });

    return NextResponse.json(updatedReview);
  } catch (error) {
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}
