"use client";

import Pagination from "@/components/Pagination";
import SongFilters from "@/components/SongFilters";
import { SONG_KEYS, SONG_PACES, getKeyLabel, getPaceLabel } from "@/lib/songs";
import { SongKey, SongPace } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
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
  bpm: number;
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

interface SongsClientProps {
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
  };
}

export default function SongsClient({
  songs,
  pagination,
  filters,
  currentFilters,
}: SongsClientProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLyricsModal, setShowLyricsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [viewingLyrics, setViewingLyrics] = useState<string>("");
  const [viewingSongHistory, setViewingSongHistory] = useState<Song | null>(
    null
  );
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    tone: "C" as SongKey,
    bpm: "",
    originalSinger: "",
    author: "",
    pace: "MODERATE" as SongPace,
    style: "",
    tags: "",
    nature: "",
    lyrics: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

      router.push(`/admin/songs?${params.toString()}`);
    },
    [searchParams, router]
  );

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/admin/songs?${params.toString()}`);
  };

  const handleFiltersChange = useCallback(
    (newFilters: typeof currentFilters) => {
      updateSearchParams(newFilters);
    },
    [updateSearchParams]
  );

  const handleCreateSong = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Song created successfully");
        setShowCreateModal(false);
        setFormData({
          title: "",
          tone: "C",
          bpm: "",
          originalSinger: "",
          author: "",
          pace: "MODERATE",
          style: "",
          tags: "",
          nature: "",
          lyrics: "",
        });
        // Refresh the page to show new data
        router.refresh();
      } else {
        setError(data.error || "Failed to create song");
      }
    } catch (error) {
      setError("Error creating song");
    }
  };

  const handleUpdateSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSong) return;

    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/songs/${editingSong.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Song updated successfully");
        setShowEditModal(false);
        setEditingSong(null);
        setFormData({
          title: "",
          tone: "C",
          bpm: "",
          originalSinger: "",
          author: "",
          pace: "MODERATE",
          style: "",
          tags: "",
          nature: "",
          lyrics: "",
        });
        // Refresh the page to show updated data
        router.refresh();
      } else {
        setError(data.error || "Failed to update song");
      }
    } catch (error) {
      setError("Error updating song");
    }
  };

  const handleDeleteSong = async (songId: string) => {
    if (!confirm("Are you sure you want to delete this song?")) return;

    try {
      const response = await fetch(`/api/songs/${songId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSuccess("Song deleted successfully");
        // Refresh the page to show updated data
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete song");
      }
    } catch (error) {
      setError("Error deleting song");
    }
  };

  const openEditModal = (song: Song) => {
    setEditingSong(song);
    setFormData({
      title: song.title,
      tone: song.tone,
      bpm: song.bpm.toString(),
      originalSinger: song.originalSinger,
      author: song.author,
      pace: song.pace,
      style: song.style,
      tags: song.tags,
      nature: song.nature,
      lyrics: song.lyrics || "",
    });
    setShowEditModal(true);
  };

  const openHistoryModal = (song: Song) => {
    setViewingSongHistory(song);
    setShowHistoryModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowLyricsModal(false);
    setShowHistoryModal(false);
    setEditingSong(null);
    setViewingSongHistory(null);
    setFormData({
      title: "",
      tone: "C",
      bpm: "",
      originalSinger: "",
      author: "",
      pace: "MODERATE",
      style: "",
      tags: "",
      nature: "",
      lyrics: "",
    });
    setError("");
    setSuccess("");
  };

  if (!session || session.user?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/admin")}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Song Management
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
            <h2 className="text-2xl font-bold text-gray-900">Songs</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Add New Song
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {success}
            </div>
          )}

          {/* Filters */}
          <SongFilters
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
        </div>
      </main>

      {/* Create Song Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-6 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-xl font-medium text-gray-900 mb-6">
                Create New Song
              </h3>
              <form onSubmit={handleCreateSong}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Key *
                    </label>
                    <select
                      required
                      value={formData.tone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tone: e.target.value as SongKey,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {SONG_KEYS.map((keyOption) => (
                        <option key={keyOption.value} value={keyOption.value}>
                          {keyOption.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      BPM *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="300"
                      value={formData.bpm}
                      onChange={(e) =>
                        setFormData({ ...formData, bpm: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Original Singer *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.originalSinger}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          originalSinger: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Author *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Pace *
                    </label>
                    <select
                      required
                      value={formData.pace}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pace: e.target.value as SongPace,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {SONG_PACES.map((paceOption) => (
                        <option key={paceOption.value} value={paceOption.value}>
                          {paceOption.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Style *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.style}
                      onChange={(e) =>
                        setFormData({ ...formData, style: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tags *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., worship, contemporary, gospel"
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nature *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., upbeat, reflective, powerful"
                      value={formData.nature}
                      onChange={(e) =>
                        setFormData({ ...formData, nature: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lyrics (Upload TXT file or paste text)
                    </label>
                    <div className="space-y-3">
                      <div>
                        <input
                          type="file"
                          accept=".txt"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const text = event.target?.result as string;
                                setFormData({ ...formData, lyrics: text });
                              };
                              reader.readAsText(file);
                            }
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                      </div>
                      <div>
                        <textarea
                          value={formData.lyrics}
                          onChange={(e) =>
                            setFormData({ ...formData, lyrics: e.target.value })
                          }
                          placeholder="Paste lyrics here or upload a TXT file above..."
                          rows={8}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Create Song
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Song Modal */}
      {showEditModal && editingSong && (
        <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-6 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-xl font-medium text-gray-900 mb-6">
                Edit Song
              </h3>
              <form onSubmit={handleUpdateSong}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Key *
                    </label>
                    <select
                      required
                      value={formData.tone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tone: e.target.value as SongKey,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {SONG_KEYS.map((keyOption) => (
                        <option key={keyOption.value} value={keyOption.value}>
                          {keyOption.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      BPM *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="300"
                      value={formData.bpm}
                      onChange={(e) =>
                        setFormData({ ...formData, bpm: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Original Singer *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.originalSinger}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          originalSinger: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Author *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Pace *
                    </label>
                    <select
                      required
                      value={formData.pace}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pace: e.target.value as SongPace,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {SONG_PACES.map((paceOption) => (
                        <option key={paceOption.value} value={paceOption.value}>
                          {paceOption.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Style *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.style}
                      onChange={(e) =>
                        setFormData({ ...formData, style: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tags *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., worship, contemporary, gospel"
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nature *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., upbeat, reflective, powerful"
                      value={formData.nature}
                      onChange={(e) =>
                        setFormData({ ...formData, nature: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lyrics (Upload TXT file or paste text)
                    </label>
                    <div className="space-y-3">
                      <div>
                        <input
                          type="file"
                          accept=".txt"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const text = event.target?.result as string;
                                setFormData({ ...formData, lyrics: text });
                              };
                              reader.readAsText(file);
                            }
                          }}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                      </div>
                      <div>
                        <textarea
                          value={formData.lyrics}
                          onChange={(e) =>
                            setFormData({ ...formData, lyrics: e.target.value })
                          }
                          placeholder="Paste lyrics here or upload a TXT file above..."
                          rows={8}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Update Song
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
                                isPastEvent(e.event.date)
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
                                (e) => !isPastEvent(e.event.date)
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
                        This song hasn't been scheduled for any events yet.
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
