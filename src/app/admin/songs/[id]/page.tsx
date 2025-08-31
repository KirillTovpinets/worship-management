import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SongDetailClient from "./SongDetailClient";

interface SongDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SongDetailPage({ params }: SongDetailPageProps) {
  const { id } = await params;

  // Fetch the song with all related data
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

  if (!song) {
    notFound();
  }

  // Fetch all singers for adaptations
  const singers = await prisma.user.findMany({
    where: { role: "SINGER" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: { name: "asc" },
  });

  // Cast to fix type issues
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processedSong = song as any;

  // Process singers to fix type issues
  const processedSingers = singers.map((singer) => ({
    ...singer,
    name: singer.name || "",
  }));

  return (
    <SongDetailClient
      song={processedSong}
      availableSingers={processedSingers}
    />
  );
}
