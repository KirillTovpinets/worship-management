"use client";

import { WButton } from "@/components/ui";
import { Download, Music, Pause, Play, Upload, X } from "lucide-react";
import { useState } from "react";
import { useMultipleMP3Upload } from "../hooks/useMultipleMP3Upload";

interface MultipleMP3UploadProps {
  songId: string;
}

export const MultipleMP3Upload = ({ songId }: MultipleMP3UploadProps) => {
  const {
    isUploading,
    isLoading,
    mp3Files,
    handleFilesUpload,
    handleDeleteMP3,
  } = useMultipleMP3Upload(songId);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("ru-RU", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handlePlayPause = (fileId: string, audioElement: HTMLAudioElement) => {
    if (playingAudio === fileId) {
      audioElement.pause();
      setPlayingAudio(null);
    } else {
      // Pause any currently playing audio
      const allAudios = document.querySelectorAll("audio");
      allAudios.forEach((audio) => audio.pause());

      audioElement.play();
      setPlayingAudio(fileId);
    }
  };

  const handleAudioEnded = () => {
    setPlayingAudio(null);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Загрузка MP3 файлов...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Upload Section */}
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors duration-200">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Music className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Загрузить MP3 файлы
          </h4>
          <p className="text-gray-600 mb-4">
            Выберите один или несколько MP3 файлов с аудио версиями песни
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Поддерживается только MP3 формат, максимальный размер каждого файла
            50MB
          </p>
          <div className="flex flex-col items-center space-y-3">
            <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200">
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Загрузка..." : "Выбрать MP3 файлы"}
              <input
                type="file"
                accept=".mp3,audio/mpeg,audio/mp3"
                multiple
                onChange={handleFilesUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>
            {isUploading && (
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">Загрузка файлов...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Files List */}
      {mp3Files.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Загруженные MP3 файлы ({mp3Files.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {mp3Files.map((file) => (
              <div key={file.id} className="px-6 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="flex-shrink-0">
                      <Music className="h-8 w-8 text-green-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>{formatDate(file.uploadedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <WButton
                      onClick={(e) => {
                        const audioElement =
                          e.currentTarget.parentElement?.parentElement?.querySelector(
                            "audio",
                          ) as HTMLAudioElement;
                        if (audioElement) {
                          handlePlayPause(file.id, audioElement);
                        }
                      }}
                      variant="tertiary"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      {playingAudio === file.id ? (
                        <>
                          <Pause size={14} />
                          Пауза
                        </>
                      ) : (
                        <>
                          <Play size={14} />
                          Воспроизвести
                        </>
                      )}
                    </WButton>
                    <a
                      href={file.url}
                      download={file.name}
                      className="inline-flex items-center px-2 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Download size={14} />
                    </a>
                    <WButton
                      onClick={() => handleDeleteMP3(file.id)}
                      variant="danger"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <X size={14} />
                      Удалить
                    </WButton>
                  </div>
                </div>

                {/* Audio Player */}
                <div className="ml-11">
                  <audio
                    src={file.url}
                    onEnded={handleAudioEnded}
                    onPause={() => {
                      if (playingAudio === file.id) {
                        setPlayingAudio(null);
                      }
                    }}
                    className="w-full"
                    controls
                  >
                    Ваш браузер не поддерживает аудио элемент.
                  </audio>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
