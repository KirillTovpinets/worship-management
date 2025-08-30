"use client";

import { PDFModal } from "@/app/admin/songs/components/PDFModal";
import { WButton } from "@/components/ui";
import { Download, Eye, FileText, Upload, X } from "lucide-react";
import { useState } from "react";
import { useMultiplePDFUpload } from "../hooks/useMultiplePDFUpload";

interface MultiplePDFUploadProps {
  songId: string;
  songTitle: string;
}

export const MultiplePDFUpload = ({
  songId,
  songTitle,
}: MultiplePDFUploadProps) => {
  const {
    isUploading,
    isLoading,
    pdfFiles,
    handleFilesUpload,
    handleDeletePDF,
  } = useMultiplePDFUpload(songId);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [currentPDFUrl, setCurrentPDFUrl] = useState<string | null>(null);
  const [currentPDFName, setCurrentPDFName] = useState<string>("");

  const handlePDFView = (url: string, name: string) => {
    setCurrentPDFUrl(url);
    setCurrentPDFName(name);
    setIsPDFModalOpen(true);
  };

  const handlePDFModalClose = () => {
    setIsPDFModalOpen(false);
    setCurrentPDFUrl(null);
    setCurrentPDFName("");
  };

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

  if (isLoading) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <div className="flex items-center justify-center space-x-2 text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Загрузка PDF файлов...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Upload Section */}
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors duration-200">
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Загрузить PDF файлы
            </h4>
            <p className="text-gray-600 mb-4">
              Выберите один или несколько PDF файлов с аккордами и текстами
              песен
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Поддерживается только PDF формат, максимальный размер каждого
              файла 10MB
            </p>
            <div className="flex flex-col items-center space-y-3">
              <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200">
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? "Загрузка..." : "Выбрать PDF файлы"}
                <input
                  type="file"
                  accept=".pdf,application/pdf"
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
        {pdfFiles.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Загруженные PDF файлы ({pdfFiles.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {pdfFiles.map((file) => (
                <div
                  key={file.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="flex-shrink-0">
                      <FileText className="h-8 w-8 text-red-500" />
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
                      onClick={() => handlePDFView(file.url, file.name)}
                      variant="tertiary"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Eye size={14} />
                      Просмотр
                    </WButton>
                    <a
                      href={file.url}
                      download={file.name}
                      className="inline-flex items-center px-2 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Download size={14} />
                    </a>
                    <WButton
                      onClick={() => handleDeletePDF(file.id)}
                      variant="danger"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <X size={14} />
                      Удалить
                    </WButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PDF Modal */}
      <PDFModal
        isOpen={isPDFModalOpen}
        onClose={handlePDFModalClose}
        pdfUrl={currentPDFUrl}
        songTitle={`${songTitle} - ${currentPDFName}`}
        handleDeletePDF={() => {
          // This will be handled by the individual file delete
          handlePDFModalClose();
        }}
      />
    </>
  );
};
