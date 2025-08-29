"use client";

import Pagination from "@/components/Pagination";
import SongFilters from "@/components/SongFilters";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { ImportModal } from "./components/ImportModal";
import { SongsTable } from "./components/SongsTable";
import { ModalProvider, useModalContext } from "./contexts/ModalContext";
import {
  SongsManagementProvider,
  useSongsManagementContext,
} from "./contexts/SongsManagementContext";
import { CreateSongModal } from "./CreateSongModal";
import { SongsClientProps } from "./types";

const SongsClientContent = ({
  songs,
  pagination,
  filters,
  currentFilters,
}: SongsClientProps) => {
  const { data: session } = useSession();

  const { openCreateModal, openImportModal, setDataRefreshCallback } =
    useModalContext();
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

  // Register refresh callback
  useEffect(() => {
    setDataRefreshCallback(refreshData);
  }, [setDataRefreshCallback, refreshData]);

  if (!session || session.user?.role !== "ADMIN") {
    return null;
  }

  return (
    <div>
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
      <ImportModal />
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
