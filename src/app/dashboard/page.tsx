import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SingerDashboardClient from "./SingerDashboardClient";

interface SingerDashboardProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
    styles?: string | string[];
    tags?: string | string[];
    natures?: string | string[];
    hasEvents?: string;
    mySongs?: string;
  }>;
}

export default async function SingerDashboard({
  searchParams: params,
}: SingerDashboardProps) {
  const searchParams = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user?.role === "ADMIN") {
    redirect("/admin");
  }

  // Parse search parameters
  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "10");
  const search = searchParams.search || "";
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
  const mySongs = searchParams.mySongs
    ? searchParams.mySongs === "true"
    : undefined;

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

  // Get songs with pagination and event history
  const songs = await prisma.song.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
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
      role: true,
    },
    where: {
      role: "SINGER", // Only get singers
    },
  });

  // Create a map of songs with matching users and events
  const songsWithMatchingUsers = songs.map((song) => {
    const matchingUsers = allUsers
      .filter((user) => user.name)
      .map((user) => ({
        id: user.id,
        name: user.name!,
        email: user.email,
        role: user.role,
      }));
    return {
      ...song,
      matchingUsers,
    };
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
    styles: uniqueStyles.map((s) => s.style),
    tags: uniqueTags,
    natures: uniqueNatures,
  };

  const currentFilters = {
    search,
    styles,
    tags,
    natures,
    hasEvents,
    mySongs,
  };

  return (
    <SingerDashboardClient
      session={session}
      songs={songsWithMatchingUsers}
      pagination={pagination}
      filters={filters}
      currentFilters={currentFilters}
    />
  );
}
