"use client";

import Pagination from "@/components/Pagination";
import SongFilters from "@/components/SongFilters";
import { getKeyLabel } from "@/lib/songs";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdaptationsModal from "./components/AdaptationsModal";
import { HistoryModal } from "./components/HistoryModal";
import { ImportModal } from "./components/ImportModal";
import { LyricsModal } from "./components/LyricsModal";
import { SongsTable } from "./components/SongsTable";
import { ModalProvider, useModalContext } from "./contexts/ModalContext";
import {
  SongsManagementProvider,
  useSongsManagementContext,
} from "./contexts/SongsManagementContext";
import { CreateSongModal } from "./CreateSongModal";
import { EditSongModal } from "./EditSongModal";
import { Song, SongsClientProps } from "./types";

const SongsClientContent = ({
  songs,
  pagination,
  filters,
  currentFilters,
}: SongsClientProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const {
    openCreateModal,
    openImportModal,
    openAdaptationsModal,
    setDataRefreshCallback,
  } = useModalContext();
  const [availableSingers, setAvailableSingers] = useState<
    Array<{
      id: string;
      name: string;
      email: string;
      role: string;
    }>
  >([]);
  const {
    error,
    success,
    handlePageChange,
    handlePageSizeChange,
    handleFiltersChange,
    handleSort,
    handleDeleteSong,
    refreshData,
  } = useSongsManagementContext();

  const handleOpenAdaptations = (song: Song) => {
    openAdaptationsModal(song);
  };

  // Fetch available singers
  useEffect(() => {
    const fetchSingers = async () => {
      try {
        const response = await fetch("/api/users/singers");
        if (response.ok) {
          const singers = await response.json();
          setAvailableSingers(singers);
        }
      } catch (error) {
        console.error("Failed to fetch singers:", error);
      }
    };

    fetchSingers();
  }, []);

  // Register refresh callback
  useEffect(() => {
    setDataRefreshCallback(refreshData);
  }, [setDataRefreshCallback, refreshData]);

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
                ← Назад
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Управление песнями
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
                Выйти
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Список песен</h2>
            <div className="flex space-x-3">
              <button
                onClick={openImportModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Импорт из Excel
              </button>
              <button
                onClick={openCreateModal}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Добавить песню
              </button>
            </div>
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
            currentFilters={currentFilters}
            onFiltersChange={handleFiltersChange}
          />

          {/* Songs Table */}
          <SongsTable
            songs={songs}
            onDeleteSong={handleDeleteSong}
            onSort={handleSort}
            onOpenAdaptations={handleOpenAdaptations}
          />

          {/* Pagination */}
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            totalCount={pagination.totalCount}
            limit={pagination.limit}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </main>

      {/* Modals */}
      <CreateSongModal />
      <EditSongModal />
      <LyricsModal />
      <HistoryModal />
      <ImportModal />
      <AdaptationsModal availableSingers={availableSingers} />
    </div>
  );
};

export default function SongsClient(props: SongsClientProps) {
  return (
    <ModalProvider>
      <SongsManagementProvider currentFilters={props.currentFilters}>
        <SongsClientContent {...props} />
      </SongsManagementProvider>
    </ModalProvider>
  );
}
