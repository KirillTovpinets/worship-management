import { prisma } from "@/lib/prisma";
import SongsClient from "./SongsClient";

interface SongsPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    search?: string;
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
  let orderBy: { [key: string]: "asc" | "desc" } = { title: "asc" }; // default sorting

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
        orderBy = { title: "asc" };
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
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

  // Cast songs to the expected type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processedSongs = songs as any;

  return (
    <SongsClient
      songs={processedSongs}
      pagination={pagination}
      filters={filters}
      currentFilters={{
        search,
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
