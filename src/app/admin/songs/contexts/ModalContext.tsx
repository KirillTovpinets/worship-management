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

  // Modal data
  viewingLyrics: string;
  viewingSongHistory: Song | null;
  editingSong: Song | null;

  // Modal actions
  openCreateModal: () => void;
  openEditModal: (song: Song) => void;
  openLyricsModal: (lyrics: string) => void;
  openHistoryModal: (song: Song) => void;
  openImportModal: () => void;
  closeAllModals: () => void;
  closeCreateModal: () => void;
  closeEditModal: () => void;
  closeLyricsModal: () => void;
  closeHistoryModal: () => void;
  closeImportModal: () => void;
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

  const [viewingLyrics, setViewingLyrics] = useState("");
  const [viewingSongHistory, setViewingSongHistory] = useState<Song | null>(
    null,
  );
  const [editingSong, setEditingSong] = useState<Song | null>(null);

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
    viewingLyrics,
    viewingSongHistory,
    editingSong,
    openCreateModal,
    openEditModal,
    openLyricsModal,
    openHistoryModal,
    openImportModal,
    closeAllModals,
    closeCreateModal,
    closeEditModal,
    closeLyricsModal,
    closeHistoryModal,
    closeImportModal,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};
