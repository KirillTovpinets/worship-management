import { useCallback, useEffect, useState } from "react";
import { FileInfo, useFirebase } from "../../../../hooks/useFirebase";
import { useToast } from "../../../../hooks/useToast";

export const useMultiplePDFUpload = (songId: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const [pdfFiles, setPdfFiles] = useState<FileInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { uploadMultiplePDFs, getMultiplePDFs, deletePDF } = useFirebase();
  const toast = useToast();

  const handleFilesUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      if (files.length === 0) return;

      // Validate file types
      const invalidFiles = files.filter(
        (file) => file.type !== "application/pdf",
      );
      if (invalidFiles.length > 0) {
        toast.error(
          "Пожалуйста, выберите только PDF файлы",
          "Неверный формат файла",
        );
        return;
      }

      // Validate file sizes (max 10MB each)
      const oversizedFiles = files.filter(
        (file) => file.size > 10 * 1024 * 1024,
      );
      if (oversizedFiles.length > 0) {
        toast.error(
          "Размер каждого файла не должен превышать 10MB",
          "Слишком большой файл",
        );
        return;
      }

      setIsUploading(true);
      try {
        const uploadedFiles = await uploadMultiplePDFs(files, songId);
        setPdfFiles((prev) => [...prev, ...uploadedFiles]);
        toast.success(
          `${files.length} PDF файл(ов) успешно загружен(ы)`,
          "Успех",
        );
      } catch (error) {
        console.error("Error uploading PDFs:", error);
        toast.error("Не удалось загрузить PDF файлы", "Ошибка загрузки");
      } finally {
        setIsUploading(false);
      }
    },
    [songId, uploadMultiplePDFs, toast],
  );

  const loadPDFFiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const files = await getMultiplePDFs(songId);
      setPdfFiles(files);
    } catch (error) {
      console.error("Error loading PDF files:", error);
      setPdfFiles([]);
    } finally {
      setIsLoading(false);
    }
  }, [songId, getMultiplePDFs]);

  const handleDeletePDF = useCallback(
    async (fileId: string) => {
      try {
        await deletePDF(songId, fileId);
        setPdfFiles((prev) => prev.filter((file) => file.id !== fileId));
        toast.success("PDF файл удален", "Успех");
      } catch (error) {
        console.error("Error deleting PDF:", error);
        toast.error("Не удалось удалить PDF файл", "Ошибка удаления");
      }
    },
    [songId, deletePDF, toast],
  );

  // Load PDF files on component mount
  useEffect(() => {
    loadPDFFiles();
  }, [loadPDFFiles]);

  return {
    isUploading,
    isLoading,
    pdfFiles,
    handleFilesUpload,
    handleDeletePDF,
    loadPDFFiles,
  };
};
