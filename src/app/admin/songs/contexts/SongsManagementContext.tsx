"use client";

import { createContext, ReactNode, useContext } from "react";
import { useSongsManagement } from "../hooks/useSongsManagement";
import { CurrentFilters } from "../types";

interface SongsManagementContextType {
  error: string;
  success: string;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
  handleFiltersChange: (newFilters: CurrentFilters) => void;
  handleSort: (sortKey: string) => void;
  handleDeleteSong: (songId: string) => Promise<void>;
  handleCreateSong: (
    formData: import("../types").SongFormData,
  ) => Promise<{ success: boolean; error?: string }>;
  handleUpdateSong: (
    songId: string,
    formData: import("../types").SongFormData,
  ) => Promise<{ success: boolean; error?: string }>;
  clearMessages: () => void;
  refreshData: () => void;
}

const SongsManagementContext = createContext<
  SongsManagementContextType | undefined
>(undefined);

export const useSongsManagementContext = () => {
  const context = useContext(SongsManagementContext);
  if (!context) {
    throw new Error(
      "useSongsManagementContext must be used within a SongsManagementProvider",
    );
  }
  return context;
};

interface SongsManagementProviderProps {
  children: ReactNode;
  currentFilters: CurrentFilters;
}

export const SongsManagementProvider = ({
  children,
  currentFilters,
}: SongsManagementProviderProps) => {
  const songsManagement = useSongsManagement(currentFilters);

  return (
    <SongsManagementContext.Provider value={songsManagement}>
      {children}
    </SongsManagementContext.Provider>
  );
};
