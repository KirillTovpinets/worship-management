import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ScheduleClient from "./ScheduleClient";

interface SchedulePageProps {
  searchParams: {
    year?: string;
    month?: string;
  };
}

export default async function SchedulePage({
  searchParams: params,
}: SchedulePageProps) {
  const searchParams = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Parse year and month from search params or use current date
  const currentDate = new Date();
  const year = parseInt(
    searchParams.year || currentDate.getFullYear().toString()
  );
  const month = parseInt(
    searchParams.month || (currentDate.getMonth() + 1).toString()
  );

  // Get events for the specified month
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0);

  const events = await prisma.event.findMany({
    where: {
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
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

  // Get all songs for the song selector
  const songs = await prisma.song.findMany({
    orderBy: {
      title: "asc",
    },
  });

  return (
    <ScheduleClient
      events={events}
      songs={songs}
      currentYear={year}
      currentMonth={month}
    />
  );
}
