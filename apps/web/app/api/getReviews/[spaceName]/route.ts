import prisma from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: any) {
  const { spaceName } = params;
  console.log(spaceName);
  try {
    const space = await prisma.space.findUnique({
      where: {
        spaceName: spaceName,
      },
      include: {
        reviews: true,
      },
    });

    if (space) {
      return NextResponse.json(space);
    }
  } catch (error) {
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}
