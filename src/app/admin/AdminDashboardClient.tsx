"use client";

import { getKeyLabel } from "@/lib/keys";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Statistics {
  totalUsers: number;
  totalSongs: number;
  upcomingEvents: number;
  totalEvents: number;
  singersCount: number;
  songsWithEvents: number;
}

interface RecentActivity {
  recentEvents: Array<{
    id: string;
    title: string;
    date: Date;
    description?: string | null;
    songs: Array<{
      song: {
        title: string;
      };
    }>;
  }>;
  recentSongs: Array<{
    id: string;
    title: string;
    tone: string;
    createdAt: Date;
  }>;
}

interface AdminDashboardClientProps {
  session: Session;
  statistics: Statistics;
  recentActivity: RecentActivity;
}

// Helper function to format date
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Helper function to check if event is in the past
const isPastEvent = (date: Date) => {
  return new Date(date) < new Date();
};

export default function AdminDashboardClient({
  session,
  statistics,
  recentActivity,
}: AdminDashboardClientProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Worship Management - Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {session.user?.name} ({session.user?.role})
                {session.user?.key &&
                  ` - Key: ${getKeyLabel(session.user.key)}`}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Users
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {statistics.totalUsers}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Songs
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {statistics.totalSongs}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Upcoming Events
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {statistics.upcomingEvents}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Singers
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {statistics.singersCount}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Songs with Events
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {statistics.songsWithEvents}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Events
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {statistics.totalEvents}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Quick Actions
                </h3>
                <div className="mt-4 space-y-3">
                  <button
                    onClick={() => router.push("/admin/users")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Manage Users
                  </button>
                  <button
                    onClick={() => router.push("/admin/songs")}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Manage Songs
                  </button>
                  <button
                    onClick={() => router.push("/admin/schedule")}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Schedule Event
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Recent Activity
                </h3>
                <div className="mt-4 space-y-4">
                  {/* Recent Events */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Recent Events
                    </h4>
                    {recentActivity.recentEvents.length > 0 ? (
                      <div className="space-y-2">
                        {recentActivity.recentEvents.map((event) => (
                          <div
                            key={event.id}
                            className={`p-2 rounded-md text-xs ${
                              isPastEvent(event.date)
                                ? "bg-gray-50 text-gray-600"
                                : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            <div className="font-medium">{event.title}</div>
                            <div className="text-gray-500">
                              {formatDate(event.date)} • {event.songs.length}{" "}
                              songs
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-xs">No events found</p>
                    )}
                  </div>

                  {/* Recent Songs */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Recent Songs
                    </h4>
                    {recentActivity.recentSongs.length > 0 ? (
                      <div className="space-y-2">
                        {recentActivity.recentSongs.map((song) => (
                          <div
                            key={song.id}
                            className="p-2 rounded-md text-xs bg-gray-50"
                          >
                            <div className="font-medium">{song.title}</div>
                            <div className="text-gray-500">
                              Key: {getKeyLabel(song.tone)} •{" "}
                              {formatDate(song.createdAt)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-xs">No songs found</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="mt-8 bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                System Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {statistics.totalUsers}
                  </div>
                  <div className="text-sm text-gray-500">Total Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {statistics.totalSongs}
                  </div>
                  <div className="text-sm text-gray-500">Total Songs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {statistics.totalEvents}
                  </div>
                  <div className="text-sm text-gray-500">Total Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {statistics.singersCount}
                  </div>
                  <div className="text-sm text-gray-500">Active Singers</div>
                </div>
              </div>

              {/* Additional Insights */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium text-gray-900 mb-2">Song Usage</h4>
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Songs with events:</span>
                      <span className="font-medium">
                        {statistics.songsWithEvents}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Songs without events:</span>
                      <span className="font-medium">
                        {statistics.totalSongs - statistics.songsWithEvents}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Usage rate:</span>
                      <span className="font-medium">
                        {statistics.totalSongs > 0
                          ? Math.round(
                              (statistics.songsWithEvents /
                                statistics.totalSongs) *
                                100
                            )
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Event Status
                  </h4>
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Upcoming events:</span>
                      <span className="font-medium text-blue-600">
                        {statistics.upcomingEvents}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Past events:</span>
                      <span className="font-medium text-gray-600">
                        {statistics.totalEvents - statistics.upcomingEvents}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Events this month:</span>
                      <span className="font-medium">
                        {statistics.upcomingEvents > 0
                          ? "Active"
                          : "None scheduled"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
