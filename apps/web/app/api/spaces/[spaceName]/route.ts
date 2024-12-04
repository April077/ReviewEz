import prisma from "@repo/db";
import { NextRequest, NextResponse } from "next/server";

type ParamsType = Promise<{
  spaceName: string;
}>

export async function GET(
  req: NextRequest,
  { params }: { params: ParamsType }
) {
  const { spaceName } = await params;
  console.log(spaceName);
  try {
    const space = await prisma.space.findUnique({
      where: {
        spaceName: spaceName,
      },
      select: {
        image: true,
        headerName: true,
        msg: true,
        id: true,
      },
    });

    if (space) {
      return NextResponse.json(space);
    }
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
