import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Song } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SongsClient from "./SongsClient";

interface SongsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    tones?: string | string[];
    paces?: string | string[];
    styles?: string | string[];
    tags?: string | string[];
    natures?: string | string[];
    hasEvents?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function SongsPage({
  searchParams: params,
}: SongsPageProps) {
  const searchParams = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Parse search parameters
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "10");
  const search = searchParams.search || "";
  const tones = Array.isArray(searchParams.tones)
    ? searchParams.tones
    : searchParams.tones
    ? [searchParams.tones]
    : [];
  const paces = Array.isArray(searchParams.paces)
    ? searchParams.paces
    : searchParams.paces
    ? [searchParams.paces]
    : [];
  const styles = Array.isArray(searchParams.styles)
    ? searchParams.styles
    : searchParams.styles
    ? [searchParams.styles]
    : [];
  const tags = Array.isArray(searchParams.tags)
    ? searchParams.tags
    : searchParams.tags
    ? [searchParams.tags]
    : [];
  const natures = Array.isArray(searchParams.natures)
    ? searchParams.natures
    : searchParams.natures
    ? [searchParams.natures]
    : [];
  const hasEvents = searchParams.hasEvents
    ? searchParams.hasEvents === "true"
    : undefined;
  const sortBy = searchParams.sortBy;
  const sortOrder = (searchParams.sortOrder as "asc" | "desc") || "asc";

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Build where clause
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  // Search by title
  if (search) {
    where.title = {
      contains: search,
    };
  }

  // Filter by tone
  if (tones.length > 0) {
    where.tone = {
      in: tones,
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
      },
    }));
  }

  // Filter by nature (partial match)
  if (natures.length > 0) {
    where.OR = natures.map((nature) => ({
      nature: {
        contains: nature,
      },
    }));
  }

  // Filter by events
  if (hasEvents !== undefined) {
    if (hasEvents) {
      where.events = {
        some: {}, // Songs that have at least one event
      };
    } else {
      where.events = {
        none: {}, // Songs that have no events
      };
    }
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

  // Get songs with pagination and event history
  const songs = await prisma.song.findMany({
    where,
    orderBy,
    skip,
    take: limit,
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

  // Get all users for matching
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      key: true,
      role: true,
    },
    where: {
      role: "SINGER", // Only get singers
    },
  });

  // Create a map of songs with matching users and events
  const songsWithMatchingUsers = songs.map((song) => {
    const matchingUsers = allUsers.filter((user) => user.key === song.tone);
    return {
      ...song,
      matchingUsers,
    };
  });

  // Get unique values for filter options
  const uniqueTones = await prisma.song.findMany({
    select: { tone: true },
    distinct: ["tone"],
    orderBy: { tone: "asc" },
  });

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

  const pagination = {
    page,
    limit,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    hasNextPage: page < Math.ceil(totalCount / limit),
    hasPrevPage: page > 1,
  };

  const filters = {
    tones: uniqueTones.map((t) => t.tone),
    paces: uniquePaces.map((p) => p.pace),
    styles: uniqueStyles.map((s) => s.style),
    tags: uniqueTags,
    natures: uniqueNatures,
  };

  return (
    <SongsClient
      songs={
        songsWithMatchingUsers as unknown as (Song & {
          matchingUsers: Array<{
            id: string;
            name: string;
            email: string;
            key: string;
            role: string;
          }>;
        })[]
      }
      pagination={pagination}
      filters={filters}
      currentFilters={{
        search,
        tones,
        paces,
        styles,
        tags,
        natures,
        hasEvents,
        sortBy,
        sortOrder,
      }}
    />
  );
}
