"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { Song } from "../types";

interface ModalContextType {
  // Modal visibility states
  showCreateModal: boolean;
  showEditModal: boolean;
  showLyricsModal: boolean;
  showHistoryModal: boolean;
  showImportModal: boolean;
  showAdaptationsModal: boolean;

  // Modal data
  viewingLyrics: string;
  viewingSongHistory: Song | null;
  editingSong: Song | null;
  viewingAdaptations: Song | null;

  // Refresh callback
  onDataRefresh?: () => void;

  // Modal actions
  openCreateModal: () => void;
  openEditModal: (song: Song) => void;
  openLyricsModal: (lyrics: string) => void;
  openHistoryModal: (song: Song) => void;
  openImportModal: () => void;
  openAdaptationsModal: (song: Song) => void;
  closeAllModals: () => void;
  closeCreateModal: () => void;
  closeEditModal: () => void;
  closeLyricsModal: () => void;
  closeHistoryModal: () => void;
  closeImportModal: () => void;
  closeAdaptationsModal: () => void;
  setDataRefreshCallback: (callback: () => void) => void;
  setViewingLyrics: (lyrics: string) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within a ModalProvider");
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLyricsModal, setShowLyricsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAdaptationsModal, setShowAdaptationsModal] = useState(false);
  const [viewingLyrics, setViewingLyrics] = useState("");
  const [viewingSongHistory, setViewingSongHistory] = useState<Song | null>(
    null,
  );
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [viewingAdaptations, setViewingAdaptations] = useState<Song | null>(
    null,
  );
  const [onDataRefresh, setOnDataRefresh] = useState<(() => void) | undefined>(
    undefined,
  );
  const openCreateModal = () => setShowCreateModal(true);
  const openEditModal = (song: Song) => {
    setEditingSong(song);
    setShowEditModal(true);
  };
  const openLyricsModal = (lyrics: string) => {
    setViewingLyrics(lyrics);
    setShowLyricsModal(true);
  };
  const openHistoryModal = (song: Song) => {
    setViewingSongHistory(song);
    setShowHistoryModal(true);
  };
  const openImportModal = () => setShowImportModal(true);
  const openAdaptationsModal = (song: Song) => {
    setViewingAdaptations(song);
    setShowAdaptationsModal(true);
  };
  const closeCreateModal = () => setShowCreateModal(false);
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingSong(null);
  };
  const closeLyricsModal = () => {
    setShowLyricsModal(false);
    setViewingLyrics("");
  };
  const closeHistoryModal = () => {
    setShowHistoryModal(false);
    setViewingSongHistory(null);
  };
  const closeImportModal = () => setShowImportModal(false);
  const closeAdaptationsModal = () => {
    setShowAdaptationsModal(false);
    setViewingAdaptations(null);
  };
  const setDataRefreshCallback = (callback: () => void) => {
    setOnDataRefresh(() => callback);
  };
  const closeAllModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowLyricsModal(false);
    setShowHistoryModal(false);
    setShowImportModal(false);
    setViewingLyrics("");
    setViewingSongHistory(null);
    setEditingSong(null);
  };

  const value: ModalContextType = {
    showCreateModal,
    showEditModal,
    showLyricsModal,
    showHistoryModal,
    showImportModal,
    showAdaptationsModal,
    viewingLyrics,
    viewingSongHistory,
    editingSong,
    viewingAdaptations,
    onDataRefresh,
    openCreateModal,
    openEditModal,
    openLyricsModal,
    openHistoryModal,
    openImportModal,
    openAdaptationsModal,
    closeAllModals,
    closeCreateModal,
    closeEditModal,
    closeLyricsModal,
    closeHistoryModal,
    closeImportModal,
    closeAdaptationsModal,
    setDataRefreshCallback,
    setViewingLyrics,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};
