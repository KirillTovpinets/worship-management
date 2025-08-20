"use client";

import Pagination from "@/components/Pagination";
import SingerSongFilters from "@/components/SingerSongFilters";
import { getKeyLabel, getPaceLabel } from "@/lib/songs";
import { SongKey, SongPace } from "@prisma/client";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

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

interface Song {
  id: string;
  title: string;
  tone: SongKey;
  bpm: string;
  originalSinger: string;
  author: string;
  pace: SongPace;
  style: string;
  tags: string;
  nature: string;
  lyrics?: string | null;
  createdAt: Date;
  updatedAt: Date;
  events?: Array<{
    id: string;
    eventId: string;
    songId: string;
    order: number;
    createdAt: Date;
    event: {
      id: string;
      title: string;
      date: Date;
      description?: string | null;
      createdAt: Date;
      updatedAt: Date;
    };
  }>;
  matchingUsers?: Array<{
    id: string;
    name: string;
    email: string;
    key: string;
    role: string;
  }>;
}

interface PaginationData {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface FilterOptions {
  tones: string[];
  paces: string[];
  styles: string[];
  tags: string[];
  natures: string[];
}

interface SingerDashboardClientProps {
  session: Session;
  songs: Song[];
  pagination: PaginationData;
  filters: FilterOptions;
  currentFilters: {
    search: string;
    tones: string[];
    paces: string[];
    styles: string[];
    tags: string[];
    natures: string[];
    hasEvents?: boolean;
    mySongs?: boolean;
  };
}

export default function SingerDashboardClient({
  session,
  songs,
  pagination,
  filters,
  currentFilters,
}: SingerDashboardClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showLyricsModal, setShowLyricsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [viewingLyrics, setViewingLyrics] = useState<string>("");
  const [viewingSongHistory, setViewingSongHistory] = useState<Song | null>(
    null,
  );

  const updateSearchParams = useCallback(
    (newFilters: typeof currentFilters) => {
      const params = new URLSearchParams(searchParams.toString());

      // Clear existing filter params
      params.delete("search");
      params.delete("tones");
      params.delete("paces");
      params.delete("styles");
      params.delete("tags");
      params.delete("natures");
      params.delete("hasEvents");
      params.delete("mySongs");
      params.delete("page"); // Reset to page 1 when filters change

      // Add new filter params
      if (newFilters.search) {
        params.set("search", newFilters.search);
      }

      newFilters.tones.forEach((tone) => params.append("tones", tone));
      newFilters.paces.forEach((pace) => params.append("paces", pace));
      newFilters.styles.forEach((style) => params.append("styles", style));
      newFilters.tags.forEach((tag) => params.append("tags", tag));
      newFilters.natures.forEach((nature) => params.append("natures", nature));

      if (newFilters.hasEvents !== undefined) {
        params.set("hasEvents", newFilters.hasEvents.toString());
      }

      if (newFilters.mySongs !== undefined) {
        params.set("mySongs", newFilters.mySongs.toString());
      }

      router.push(`/dashboard?${params.toString()}`);
    },
    [searchParams, router],
  );

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/dashboard?${params.toString()}`);
  };

  const handleFiltersChange = useCallback(
    (newFilters: typeof currentFilters) => {
      updateSearchParams(newFilters);
    },
    [updateSearchParams],
  );

  const openHistoryModal = (song: Song) => {
    setViewingSongHistory(song);
    setShowHistoryModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Worship Management - Singer Dashboard
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Song Library</h2>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Browse and filter songs in the library
              </div>
              <button
                onClick={() => {
                  const newFilters = { ...currentFilters };
                  if (newFilters.mySongs === true) {
                    newFilters.mySongs = undefined;
                  } else {
                    newFilters.mySongs = true;
                  }
                  updateSearchParams(newFilters);
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  currentFilters.mySongs === true
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {currentFilters.mySongs === true
                  ? "Show All Songs"
                  : "My Songs"}
              </button>
            </div>
          </div>

          {/* Filters */}
          <SingerSongFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {songs.map((song) => (
                <li key={song.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {song.title}
                          </h3>
                          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                            <span>Key: {getKeyLabel(song.tone)}</span>
                            <span>BPM: {song.bpm}</span>
                            <span>Pace: {getPaceLabel(song.pace)}</span>
                          </div>
                          <div className="mt-1 text-sm text-gray-500">
                            <span>Original Singer: {song.originalSinger}</span>
                            <span className="mx-2">•</span>
                            <span>Author: {song.author}</span>
                          </div>
                          <div className="mt-1 text-sm text-gray-500">
                            <span>Style: {song.style}</span>
                            <span className="mx-2">•</span>
                            <span>Nature: {song.nature}</span>
                          </div>
                          {song.tags && (
                            <div className="mt-1 text-sm text-gray-500">
                              Tags: {song.tags}
                            </div>
                          )}
                          {song.lyrics && (
                            <div className="mt-2">
                              <button
                                onClick={() => {
                                  setViewingLyrics(song.lyrics || "");
                                  setShowLyricsModal(true);
                                }}
                                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                              >
                                View Lyrics
                              </button>
                            </div>
                          )}

                          {/* Song History Button */}
                          <div className="mt-2">
                            <button
                              onClick={() => openHistoryModal(song)}
                              className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                            >
                              History{" "}
                              {song.events &&
                                song.events.length > 0 &&
                                `(${song.events.length})`}
                            </button>
                          </div>

                          <div className="mt-2">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">
                                Matching Singers:
                              </span>
                              {song.matchingUsers &&
                              song.matchingUsers.length > 0 ? (
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {song.matchingUsers.map((user) => (
                                    <span
                                      key={user.id}
                                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                    >
                                      {user.name}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <div className="mt-1">
                                  <span className="text-gray-400 text-xs">
                                    No singers available for this key
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalCount={pagination.totalCount}
            limit={pagination.limit}
            onPageChange={handlePageChange}
          />
        </div>
      </main>

      {/* Lyrics Modal */}
      {showLyricsModal && (
        <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-6 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-gray-900">
                  Song Lyrics
                </h3>
                <button
                  onClick={() => setShowLyricsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                  {viewingLyrics}
                </pre>
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowLyricsModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && viewingSongHistory && (
        <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-6 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-gray-900">
                  Song History - {viewingSongHistory.title}
                </h3>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Song Info */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Song Information
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Key:</span>
                      <span className="ml-2 text-gray-900">
                        {getKeyLabel(viewingSongHistory.tone)}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">BPM:</span>
                      <span className="ml-2 text-gray-900">
                        {viewingSongHistory.bpm}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Pace:</span>
                      <span className="ml-2 text-gray-900">
                        {getPaceLabel(viewingSongHistory.pace)}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Style:</span>
                      <span className="ml-2 text-gray-900">
                        {viewingSongHistory.style}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Event History */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">
                    Event History & Schedule
                  </h4>
                  {viewingSongHistory.events &&
                  viewingSongHistory.events.length > 0 ? (
                    <>
                      {/* Summary Statistics */}
                      <div className="mb-4 flex gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-600">
                            Total Events:
                          </span>
                          <span className="bg-gray-200 px-3 py-1 rounded-full text-gray-800">
                            {viewingSongHistory.events.length}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-600">
                            Past Events:
                          </span>
                          <span className="bg-gray-200 px-3 py-1 rounded-full text-gray-800">
                            {
                              viewingSongHistory.events.filter((e) =>
                                isPastEvent(e.event.date),
                              ).length
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-600">
                            Upcoming:
                          </span>
                          <span className="bg-blue-200 px-3 py-1 rounded-full text-blue-800">
                            {
                              viewingSongHistory.events.filter(
                                (e) => !isPastEvent(e.event.date),
                              ).length
                            }
                          </span>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="space-y-3">
                        {viewingSongHistory.events.map((eventSong) => (
                          <div
                            key={eventSong.id}
                            className={`p-4 rounded-lg border ${
                              isPastEvent(eventSong.event.date)
                                ? "bg-gray-50 border-gray-200"
                                : "bg-blue-50 border-blue-200"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h5 className="font-medium text-gray-900">
                                    {eventSong.event.title}
                                  </h5>
                                  {isPastEvent(eventSong.event.date) ? (
                                    <span className="px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-600">
                                      Past
                                    </span>
                                  ) : (
                                    <span className="px-2 py-1 rounded-full text-xs bg-blue-200 text-blue-800">
                                      Scheduled
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                  <span className="font-medium">Date:</span>{" "}
                                  {formatDate(eventSong.event.date)}
                                  {eventSong.order > 0 && (
                                    <span className="ml-4">
                                      <span className="font-medium">
                                        Order:
                                      </span>{" "}
                                      {eventSong.order}
                                    </span>
                                  )}
                                </div>
                                {eventSong.event.description && (
                                  <div className="text-sm text-gray-600">
                                    <span className="font-medium">
                                      Description:
                                    </span>{" "}
                                    {eventSong.event.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No events scheduled
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        This song hasn&apos;t been scheduled for any events yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
