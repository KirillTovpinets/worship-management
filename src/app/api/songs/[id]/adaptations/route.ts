import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET /api/songs/[id]/adaptations - Get all adaptations for a song
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: songId } = await params;

    const adaptations = await prisma.songAdaptation.findMany({
      where: {
        songId,
      },
      include: {
        singer: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        singer: {
          name: "asc",
        },
      },
    });

    return NextResponse.json(adaptations);
  } catch (error) {
    console.error("Error fetching song adaptations:", error);
    return NextResponse.json(
      { error: "Failed to fetch song adaptations" },
      { status: 500 },
    );
  }
}

// POST /api/songs/[id]/adaptations - Create a new adaptation for a singer
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: songId } = await params;
    const { singerId, key } = await request.json();

    if (!singerId || !key) {
      return NextResponse.json(
        { error: "Singer ID and key are required" },
        { status: 400 },
      );
    }

    // Check if adaptation already exists
    const existingAdaptation = await prisma.songAdaptation.findUnique({
      where: {
        songId_singerId: {
          songId,
          singerId,
        },
      },
    });

    if (existingAdaptation) {
      return NextResponse.json(
        { error: "Adaptation for this singer already exists" },
        { status: 409 },
      );
    }

    const adaptation = await prisma.songAdaptation.create({
      data: {
        songId,
        singerId,
        key,
      },
      include: {
        singer: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json(adaptation, { status: 201 });
  } catch (error) {
    console.error("Error creating song adaptation:", error);
    return NextResponse.json(
      { error: "Failed to create song adaptation" },
      { status: 500 },
    );
  }
}
