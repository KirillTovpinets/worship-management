"use client";

import { LyricsModal } from "@/app/admin/songs/components/LyricsModal";
import { MultipleMP3Upload } from "@/app/admin/songs/components/MultipleMP3Upload";
import { MultiplePDFUpload } from "@/app/admin/songs/components/MultiplePDFUpload";
import {
  ModalProvider,
  useModalContext,
} from "@/app/admin/songs/contexts/ModalContext";
import { useImportLyrics } from "@/app/admin/songs/hooks/useImportLyrics";
import { WButton } from "@/components/ui";
import { Song } from "@prisma/client";
import { useSession } from "next-auth/react";
import SongInformation from "../components/SongInformation";

interface Singer {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface SongDetailClientProps {
  song: Song;
  availableSingers: Singer[];
}

function SongDetailClientComponent({ song }: SongDetailClientProps) {
  const { data: session } = useSession();
  const { openLyricsModal } = useModalContext();

  const { isUploading, handleFileUpload } = useImportLyrics(song, () => {});

  if (!session || session.user?.role !== "ADMIN") {
    return <div>Доступ запрещен</div>;
  }

  const handleEditLyrics = () => {
    if (!song.lyrics) return;
    openLyricsModal(song.lyrics);
  };

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{song.title}</h2>
          <p className="text-gray-600 mt-1">{song.originalSinger}</p>
        </div>

        <div className="space-y-6">
          <div className="flex gap-7">
            {/* Lyrics Section */}
            <div className="flex-grow-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Текст песни
                </h3>
                <div className="flex items-center gap-2">
                  {song.lyrics && (
                    <WButton
                      onClick={handleEditLyrics}
                      variant="tertiary"
                      size="none"
                    >
                      Редактировать
                    </WButton>
                  )}
                </div>
              </div>
              {song.lyrics && (
                <div className="bg-gray-100 p-4 rounded-md">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                    {song.lyrics}
                  </pre>
                </div>
              )}
              {!song.lyrics && (
                <div className="space-y-4">
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors duration-200">
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          Загрузить файл с текстом песни
                        </h4>
                        <p className="text-gray-600 mb-4">
                          Выберите .txt файл с текстом песни для загрузки
                        </p>
                        <div className="flex flex-col items-center space-y-3">
                          <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200">
                            <svg
                              className="w-4 h-4 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            {isUploading ? "Загрузка..." : "Выбрать файл"}
                            <input
                              type="file"
                              accept=".txt"
                              onChange={handleFileUpload}
                              className="hidden"
                              disabled={isUploading}
                            />
                          </label>
                          {isUploading && (
                            <div className="flex items-center space-x-2 text-blue-600">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                              <span className="text-sm">Загрузка файла...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <SongInformation song={song} />
          </div>

          {/* MP3 Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Аудио файлы
            </h3>
            <MultipleMP3Upload songId={song.id} songTitle={song.title} />
          </div>

          {/* PDF Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              PDF файлы (аккорды и тексты)
            </h3>
            <MultiplePDFUpload songId={song.id} songTitle={song.title} />
          </div>
        </div>
      </div>

      <LyricsModal song={song} />
    </main>
  );
}

export default function SongDetailClient(props: SongDetailClientProps) {
  return (
    <ModalProvider>
      <SongDetailClientComponent {...props} />
    </ModalProvider>
  );
}
