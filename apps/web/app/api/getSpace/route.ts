import prisma from "@repo/db";
import { NextResponse } from "next/server";



export async function GET() {
  try {
    console.log("first")
    const spaces = await prisma.space.findMany();
    console.log("second")
    if (spaces) {
      return NextResponse.json(spaces);
    }
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
