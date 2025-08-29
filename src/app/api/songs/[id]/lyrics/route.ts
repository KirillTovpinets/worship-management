import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { lyrics } = await request.json();
  const { id } = await params;

  if (!lyrics) {
    return NextResponse.json({ error: "Lyrics are required" }, { status: 400 });
  }

  await prisma.song.update({
    where: { id },
    data: { lyrics },
  });

  return NextResponse.json({ message: "Lyrics updated successfully" });
}
