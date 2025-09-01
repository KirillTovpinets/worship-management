"use client";

import { WButton, WModal, WModalContent, WModalHeader } from "@/components/ui";
import { Download, Trash } from "lucide-react";
import { useEffect, useState } from "react";

interface PDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
  songTitle: string;
  handleDeletePDF: () => void;
}

export const PDFModal = ({
  isOpen,
  onClose,
  pdfUrl,
  songTitle,
  handleDeletePDF,
}: PDFModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && pdfUrl) {
      setIsLoading(true);
      setError(null);
    }
  }, [isOpen, pdfUrl]);

  const handleDownload = () => {
    if (!pdfUrl) return;

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `${songTitle}-lyrics.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError("Не удалось загрузить PDF файл");
  };

  return (
    <WModal isOpen={isOpen} onClose={onClose}>
      <WModalContent className="max-w-4xl max-h-[90vh]">
        <WModalHeader onClose={onClose}>
          <span className="text-xl font-semibold text-gray-900 mb-3 block">
            Текст песни с аккордами
          </span>
          {pdfUrl && (
            <div className="flex items-center gap-2">
              <WButton
                onClick={handleDownload}
                variant="primary"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Скачать
              </WButton>

              <WButton
                onClick={handleDeletePDF}
                variant="danger"
                size="sm"
                className="flex items-center gap-2"
              >
                <Trash size={16} />
                Удалить
              </WButton>
            </div>
          )}
        </WModalHeader>

        <div className="flex-1 min-h-0">
          {isLoading && (
            <div className="flex items-center justify-center h-96">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-600">Загрузка PDF...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <WButton onClick={onClose} variant="primary">
                  Закрыть
                </WButton>
              </div>
            </div>
          )}

          {pdfUrl && !error && (
            <div className="relative h-[70vh] border border-gray-200 rounded-lg overflow-hidden">
              <iframe
                src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-full"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                title={`PDF для песни ${songTitle}`}
              />
            </div>
          )}
        </div>
      </WModalContent>
    </WModal>
  );
};
