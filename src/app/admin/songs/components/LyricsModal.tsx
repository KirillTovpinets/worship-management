"use client";

import { useImportLyrics } from "@/app/admin/songs/hooks/useImportLyrics";
import { WButton, WTextarea } from "@/components/ui";
import { useEffect, useState } from "react";
import { useModalContext } from "../contexts/ModalContext";
import { Song } from "../types";

interface LyricsModalProps {
  song: Song;
}

export const LyricsModal = ({ song }: LyricsModalProps) => {
  const { showLyricsModal, viewingLyrics, closeLyricsModal, setViewingLyrics } =
    useModalContext();

  const { isUploading, handleFileUpload, uploadLyrics } = useImportLyrics(
    song,
    (text) => {
      setViewingLyrics(text);
      closeLyricsModal();
    },
  );

  const [changedLyrics, setChangedLyrics] = useState(viewingLyrics);

  useEffect(() => {
    setChangedLyrics(viewingLyrics);
  }, [viewingLyrics]);

  const handleSaveChanges = async () => {
    await uploadLyrics(changedLyrics);
  };

  const handleCloseLyricsModal = () => {
    closeLyricsModal();
    setViewingLyrics("");
  };

  if (!showLyricsModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-medium text-gray-900">Текст песни</h3>
            <button
              onClick={closeLyricsModal}
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
          <div className="flex justify-end my-6">
            <div>
              <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200">
                {isUploading ? "Загрузка..." : "Выбрать файл"}
                <input
                  disabled={isUploading}
                  type="file"
                  accept=".txt"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </div>
          <WTextarea
            value={changedLyrics}
            onChange={(e) => setChangedLyrics(e.target.value)}
            rows={15}
          />
          <div className="flex justify-end mt-6 gap-2">
            <WButton variant="primary" onClick={handleSaveChanges}>
              Сохранить
            </WButton>
            <button
              onClick={handleCloseLyricsModal}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
