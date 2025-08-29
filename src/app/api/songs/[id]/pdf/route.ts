import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: songId } = await params;

    // Check if song exists
    const song = await prisma.song.findUnique({
      where: { id: songId },
      select: { id: true, title: true },
    });

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    // For now, we'll just return the song info
    // In the future, you might want to store PDF metadata in the database
    return NextResponse.json({
      songId,
      title: song.title,
      hasPDF: false, // This could be determined by checking Firebase storage
    });
  } catch (error) {
    console.error("Error fetching song PDF info:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
