"use client";

import { PDFModal } from "@/app/admin/songs/components/PDFModal";
import { WButton } from "@/components/ui";
import { ListMusicIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { usePDFUpload } from "../hooks/usePDFUpload";

interface PDFUploadProps {
  songId: string;
  songTitle: string;
}

export const PDFUpload = ({ songId, songTitle }: PDFUploadProps) => {
  const { isUploading, pdfUrl, handleFileUpload, loadPDFUrl, handleDeletePDF } =
    usePDFUpload(songId);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [currentPDFUrl, setCurrentPDFUrl] = useState<string | null>(null);

  const handlePDFView = (url: string) => {
    setCurrentPDFUrl(url);
    setIsPDFModalOpen(true);
  };

  const handlePDFModalClose = () => {
    setIsPDFModalOpen(false);
    setCurrentPDFUrl(null);
  };

  // Load PDF URL on component mount
  useEffect(() => {
    loadPDFUrl();
  }, [loadPDFUrl]);

  const handleViewPDF = () => {
    if (pdfUrl) {
      handlePDFView(pdfUrl);
    }
  };

  if (pdfUrl) {
    return (
      <>
        <div className="flex justify-start items-center space-y-3 ">
          <WButton variant="tertiary" size="none" onClick={handleViewPDF}>
            <ListMusicIcon className="mr-2" />
            Аккорды {isPDFModalOpen}
          </WButton>
        </div>
        <PDFModal
          isOpen={isPDFModalOpen}
          onClose={handlePDFModalClose}
          pdfUrl={currentPDFUrl}
          songTitle={songTitle}
          handleDeletePDF={handleDeletePDF}
        />
      </>
    );
  }

  return (
    <div className="flex justify-start items-center space-y-3">
      {!isUploading && (
        <label className="cursor-pointer inline-flex items-center px-4 py-2 text-indigo-600 font-medium rounded-md transition-colors duration-200">
          <ListMusicIcon className="mr-2" />
          {isUploading ? "Загрузка..." : "Загрузить аккорды"}
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      )}
      {isUploading && (
        <div className="flex items-center space-x-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Загрузка файла...</span>
        </div>
      )}
    </div>
  );
};
