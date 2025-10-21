import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const events = await prisma.event.findMany({
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
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { title, description, date, songIds } = await request.json();

    if (!title || !date) {
      return NextResponse.json(
        { error: "Title and date are required" },
        { status: 400 },
      );
    }
    // Create event
    const event = await prisma.event.create({
      data: {
        title,
        description: description || null,
        date,
      },
    });

    // Add songs to event if provided
    if (songIds && songIds.length > 0) {
      const eventSongs = songIds.map((songId: string, index: number) => ({
        eventId: event.id,
        songId,
        order: index,
      }));

      await prisma.eventSong.createMany({
        data: eventSongs,
      });
    }

    // Return the created event with songs
    const createdEvent = await prisma.event.findUnique({
      where: { id: event.id },
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

    return NextResponse.json(createdEvent, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 },
    );
  }
}
