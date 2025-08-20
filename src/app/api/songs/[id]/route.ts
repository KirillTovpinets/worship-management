import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET - Get specific song
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const song = await prisma.song.findUnique({
      where: { id },
      include: {
        events: {
          include: {
            event: true,
          },
          orderBy: {
            event: {
              date: "desc",
            },
          },
        },
      },
    });

    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    return NextResponse.json(song);
  } catch (error) {
    console.error("Error fetching song:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT - Update song
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      tone,
      bpm,
      originalSinger,
      author,
      pace,
      style,
      tags,
      nature,
      lyrics,
    } = await request.json();

    // Check if song exists
    const existingSong = await prisma.song.findUnique({
      where: { id },
    });

    if (!existingSong) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    // Prepare update data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};
    if (title) updateData.title = title;
    if (tone) updateData.tone = tone;
    if (bpm) updateData.bpm = bpm;
    if (originalSinger) updateData.originalSinger = originalSinger;
    if (author) updateData.author = author;
    if (pace) updateData.pace = pace;
    if (style) updateData.style = style;
    if (tags) updateData.tags = tags;
    if (nature) updateData.nature = nature;
    if (lyrics !== undefined) updateData.lyrics = lyrics;

    // Update song
    const updatedSong = await prisma.song.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      message: "Song updated successfully",
      song: updatedSong,
    });
  } catch (error) {
    console.error("Error updating song:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE - Delete song
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if song exists
    const existingSong = await prisma.song.findUnique({
      where: { id },
    });

    if (!existingSong) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    // Delete song
    await prisma.song.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Song deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting song:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
