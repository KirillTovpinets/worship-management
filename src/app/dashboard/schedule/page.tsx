import { prisma } from "@/lib/prisma";
import { fromZonedTime } from "date-fns-tz";
import ScheduleClient from "./ScheduleClient";
interface SchedulePageProps {
  searchParams: Promise<{
    year?: string;
    month?: string;
  }>;
}

const belarusTimezone = "Europe/Minsk";

export default async function SchedulePage({
  searchParams: params,
}: SchedulePageProps) {
  const searchParams = await params;

  // Parse year and month from search params or use current date
  const currentDate = new Date();
  const year = parseInt(
    searchParams.year || currentDate.getFullYear().toString(),
  );
  const month = parseInt(
    searchParams.month || (currentDate.getMonth() + 1).toString(),
  );

  // Get events for the specified month
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0);

  const startOfMonthUTC = fromZonedTime(startOfMonth, belarusTimezone);
  const endOfMonthUTC = fromZonedTime(endOfMonth, belarusTimezone);

  const events = await prisma.event.findMany({
    where: {
      date: {
        gte: startOfMonthUTC,
        lte: endOfMonthUTC,
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
