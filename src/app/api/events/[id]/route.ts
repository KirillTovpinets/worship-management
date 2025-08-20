import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        songs: {
          include: {
            song: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { title, description, date, songIds } = await request.json();

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Update event
    await prisma.event.update({
      where: { id },
      data: {
        title: title || existingEvent.title,
        description:
          description !== undefined ? description : existingEvent.description,
        date: date ? new Date(date) : existingEvent.date,
      },
    });

    // Update songs if provided
    if (songIds !== undefined) {
      // Remove existing songs
      await prisma.eventSong.deleteMany({
        where: { eventId: id },
      });

      // Add new songs
      if (songIds.length > 0) {
        const eventSongs = songIds.map((songId: string, index: number) => ({
          eventId: id,
          songId,
          order: index,
        }));

        await prisma.eventSong.createMany({
          data: eventSongs,
        });
      }
    }

    // Return the updated event with songs
    const eventWithSongs = await prisma.event.findUnique({
      where: { id },
      include: {
        songs: {
          include: {
            song: true,
          },
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return NextResponse.json(eventWithSongs);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Delete event (EventSong records will be deleted automatically due to cascade)
    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 },
    );
  }
}
