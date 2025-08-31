import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  // Fetch statistics from database
  const [
    totalUsers,
    totalSongs,
    upcomingEvents,
    totalEvents,
    singersCount,
    songsWithEvents,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.song.count(),
    prisma.event.count({
      where: {
        date: {
          gte: new Date(),
        },
      },
    }),
    prisma.event.count(),
    prisma.user.count({
      where: {
        role: "SINGER",
      },
    }),
    prisma.song.count({
      where: {
        events: {
          some: {},
        },
      },
    }),
  ]);

  // Fetch recent data for activity feed
  const [recentEvents, recentSongs] = await Promise.all([
    prisma.event.findMany({
      take: 5,
      orderBy: {
        date: "desc",
      },
      include: {
        songs: {
          include: {
            song: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    }),
    prisma.song.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    }),
  ]);

  const statistics = {
    totalUsers,
    totalSongs,
    upcomingEvents,
    totalEvents,
    singersCount,
    songsWithEvents,
  };

  const recentActivity = {
    recentEvents,
    recentSongs,
  };

  return (
    <AdminDashboardClient
      statistics={statistics}
      recentActivity={recentActivity}
    />
  );
}
