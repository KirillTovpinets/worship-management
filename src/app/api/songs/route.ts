import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// GET - List all songs with filtering, search, and pagination
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const paces = searchParams.getAll("paces");
    const styles = searchParams.getAll("styles");
    const tags = searchParams.getAll("tags");
    const natures = searchParams.getAll("natures");
    const matchingSingers = searchParams.getAll("matchingSingers");
    const sortBy = searchParams.get("sortBy");
    const sortOrder =
      (searchParams.get("sortOrder") as "asc" | "desc") || "asc";

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    // Search by title
    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    // Filter by pace
    if (paces.length > 0) {
      where.pace = {
        in: paces,
      };
    }

    // Filter by style
    if (styles.length > 0) {
      where.style = {
        in: styles,
      };
    }

    // Filter by tags (partial match)
    if (tags.length > 0) {
      where.OR = tags.map((tag) => ({
        tags: {
          contains: tag,
          mode: "insensitive",
        },
      }));
    }

    // Filter by nature (partial match)
    if (natures.length > 0) {
      where.OR = natures.map((nature) => ({
        nature: {
          contains: nature,
          mode: "insensitive",
        },
      }));
    }

    // Get total count for pagination
    const totalCount = await prisma.song.count({ where });

    // Build orderBy clause
    let orderBy: { [key: string]: "asc" | "desc" } = { createdAt: "desc" }; // default sorting

    if (sortBy) {
      switch (sortBy) {
        case "title":
          orderBy = { title: sortOrder };
          break;
        case "bpm":
          orderBy = { bpm: sortOrder };
          break;
        case "originalSinger":
          orderBy = { originalSinger: sortOrder };
          break;
        case "author":
          orderBy = { author: sortOrder };
          break;
        default:
          orderBy = { createdAt: "desc" };
      }
    }

    // Get songs with pagination and singer assignments
    let songs = await prisma.song.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        adaptations: {
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
        },
      },
    });

    // Filter by matching singers if specified
    if (matchingSingers.length > 0) {
      // Filter songs that match the specified singer names
      songs = songs.filter((song) =>
        matchingSingers.includes(song.originalSinger),
      );
    }

    // Get unique values for filter options
    const uniquePaces = await prisma.song.findMany({
      select: { pace: true },
      distinct: ["pace"],
      orderBy: { pace: "asc" },
    });

    const uniqueStyles = await prisma.song.findMany({
      select: { style: true },
      distinct: ["style"],
      orderBy: { style: "asc" },
    });

    const allSongs = await prisma.song.findMany({
      select: { tags: true, nature: true },
    });

    // Extract unique tags and natures
    const allTags = new Set<string>();
    const allNatures = new Set<string>();

    allSongs.forEach((song) => {
      if (song.tags) {
        song.tags.split("/").forEach((tag) => {
          allTags.add(tag.trim());
        });
      }
      if (song.nature) {
        song.nature.split(",").forEach((nature) => {
          allNatures.add(nature.trim());
        });
      }
    });

    const uniqueTags = Array.from(allTags).sort();
    const uniqueNatures = Array.from(allNatures).sort();

    // Get unique matching singers from songs
    const uniqueMatchingSingers = await prisma.song.findMany({
      select: {
        originalSinger: true,
      },
      distinct: ["originalSinger"],
      orderBy: {
        originalSinger: "asc",
      },
    });

    return NextResponse.json({
      songs,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1,
      },
      filters: {
        paces: uniquePaces.map((p) => p.pace),
        styles: uniqueStyles.map((s) => s.style),
        tags: uniqueTags,
        natures: uniqueNatures,
        matchingSingers: uniqueMatchingSingers.map((s) => ({
          name: s.originalSinger,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching songs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST - Create new song
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      bpm,
      originalSinger,
      author,
      pace,
      style,
      tags,
      nature,
      lyrics,
    } = await request.json();

    if (
      !title ||
      !bpm ||
      !originalSinger ||
      !author ||
      !pace ||
      !style ||
      !tags ||
      !nature
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Create song
    const song = await prisma.song.create({
      data: {
        title,
        bpm,
        originalSinger,
        author,
        pace,
        style,
        tags,
        nature,
        lyrics: lyrics || null,
      },
    });

    return NextResponse.json(
      {
        message: "Song created successfully",
        song,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating song:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
