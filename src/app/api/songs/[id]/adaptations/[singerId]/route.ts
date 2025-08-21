import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// DELETE /api/songs/[id]/adaptations/[singerId] - Remove an adaptation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; singerId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: songId, singerId } = await params;

    // Check if adaptation exists
    const existingAdaptation = await prisma.songAdaptation.findUnique({
      where: {
        songId_singerId: {
          songId,
          singerId,
        },
      },
    });

    if (!existingAdaptation) {
      return NextResponse.json(
        { error: "Adaptation not found" },
        { status: 404 },
      );
    }

    // Delete the adaptation
    await prisma.songAdaptation.delete({
      where: {
        songId_singerId: {
          songId,
          singerId,
        },
      },
    });

    return NextResponse.json({ message: "Adaptation removed successfully" });
  } catch (error) {
    console.error("Error deleting adaptation:", error);
    return NextResponse.json(
      { error: "Failed to delete adaptation" },
      { status: 500 },
    );
  }
}

// PUT /api/songs/[id]/adaptations/[singerId] - Update a singer's key for a song
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; singerId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: songId, singerId } = await params;
    const { key } = await request.json();

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    // Check if adaptation exists
    const existingAdaptation = await prisma.songAdaptation.findUnique({
      where: {
        songId_singerId: {
          songId,
          singerId,
        },
      },
    });

    if (!existingAdaptation) {
      return NextResponse.json(
        { error: "Adaptation not found" },
        { status: 404 },
      );
    }

    // Update the adaptation
    const updatedAdaptation = await prisma.songAdaptation.update({
      where: {
        songId_singerId: {
          songId,
          singerId,
        },
      },
      data: {
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

    return NextResponse.json(updatedAdaptation);
  } catch (error) {
    console.error("Error updating adaptation:", error);
    return NextResponse.json(
      { error: "Failed to update adaptation" },
      { status: 500 },
    );
  }
}
