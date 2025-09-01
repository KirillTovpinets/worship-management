"use client";

import { WButton } from "@/components/ui";
import { Music, Upload, X } from "lucide-react";
import { useEffect } from "react";
import { useMP3Upload } from "../hooks/useMP3Upload";

interface MP3UploadProps {
  songId: string;
  songTitle: string;
}

export const MP3Upload = ({ songId }: MP3UploadProps) => {
  const {
    isUploading,
    mp3Url,
    isLoadingUrl,
    handleFileUpload,
    loadMP3Url,
    handleDeleteMP3,
  } = useMP3Upload(songId);
  // Load MP3 URL on component mount
  useEffect(() => {
    loadMP3Url();
  }, [loadMP3Url]);

  if (isLoadingUrl) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Загрузка...</span>
        </div>
      </div>
    );
  }

  if (mp3Url) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Music className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-green-900">
                MP3 файл загружен
              </h4>
              <p className="text-sm text-green-700">
                Аудио файл готов к воспроизведению
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <WButton
              onClick={handleDeleteMP3}
              variant="danger"
              size="sm"
              className="flex items-center gap-2"
            >
              <X size={16} />
              Удалить
            </WButton>
          </div>
        </div>

        {/* Audio Player */}
        <div className="mt-4">
          <audio src={mp3Url} controls className="w-full">
            Ваш браузер не поддерживает аудио элемент.
          </audio>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors duration-200">
      <div className="space-y-4">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <Music className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Загрузить MP3 файл
          </h4>
          <p className="text-gray-600 mb-4">
            Выберите MP3 файл с аудио версией песни
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Поддерживается только MP3 формат, максимальный размер 50MB
          </p>
          <div className="flex flex-col items-center space-y-3">
            <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200">
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Загрузка..." : "Выбрать MP3 файл"}
              <input
                type="file"
                accept=".mp3,audio/mpeg,audio/mp3"
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
  );
};
