import { SpaceSchema } from "@/zod/spaceSchema";
import prisma from "@repo/db";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = SpaceSchema.parse(body);
    if (data) {
      await prisma.space.create({
        data,
      });
    }
    

    return NextResponse.json(
      { message: "Space created successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(error.errors, { status: 404 });
    }
    return NextResponse.json("Server Error", { status: 500 });
  }
}
