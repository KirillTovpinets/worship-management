"use client";

import Pagination from "@/components/Pagination";
import { getPaceLabel } from "@/lib/songs";
import type { Song, SongPace } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface FilterOptions {
  search: string;
  tones: string[];
  paces: string[];
  styles: string[];
  tags: string[];
  natures: string[];
}

interface PaginationData {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface SongFormData {
  title: string;
  bpm: string;
  originalSinger: string;
  author: string;
  pace: SongPace;
  style: string;
  tags: string;
  nature: string;
}

export default function SongsList({
  currentFilters,
}: {
  currentFilters: FilterOptions;
}) {
  const { status } = useSession();
  const [loading, setLoading] = useState(true);
  const [songs, setSongs] = useState<Song[]>([]);

  // Pagination state
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const fetchSongs = async (page = 1, filters = currentFilters) => {
    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      });

      if (filters.search) {
        params.append("search", filters.search);
      }

      filters.tones.forEach((tone) => params.append("tones", tone));
      filters.paces.forEach((pace) => params.append("paces", pace));
      filters.styles.forEach((style) => params.append("styles", style));
      filters.tags.forEach((tag) => params.append("tags", tag));
      filters.natures.forEach((nature) => params.append("natures", nature));

      const response = await fetch(`/api/songs?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setSongs(data.songs);
        setPagination(data.pagination);
      } else {
        console.error("Failed to fetch songs");
      }
    } catch {
      console.error("Error fetching songs");
    } finally {
      setLoading(false);
    }
  };

  // Load on mount and when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    void fetchSongs(1, currentFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(currentFilters)]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    fetchSongs(page, currentFilters);
  };

  const handleDeleteSong = async (songId: string) => {
    if (!confirm("Are you sure you want to delete this song?")) return;

    try {
      const response = await fetch(`/api/songs/${songId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchSongs(pagination.page, currentFilters);
      } else {
        const data = await response.json();
        console.error(data.error || "Failed to delete song");
      }
    } catch {
      console.error("Error deleting song");
    }
  };

  const openEditModal = (song: Song) => {
    setFormData({
      title: song.title,
      bpm: song.bpm,
      originalSinger: song.originalSinger,
      author: song.author,
      pace: song.pace,
      style: song.style,
      tags: song.tags,
      nature: song.nature,
    });
  };

  const [, setFormData] = useState<SongFormData>({
    title: "",
    bpm: "",
    originalSinger: "",
    author: "",
    pace: "MODERATE",
    style: "",
    tags: "",
    nature: "",
  } as SongFormData);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
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
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => openEditModal(song)}
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSong(song.id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    Delete
                  </button>
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
    </>
  );
}
