import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useFirebase } from "../../../../hooks/useFirebase";
import { useToast } from "../../../../hooks/useToast";

export const usePDFUpload = (songId: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const { uploadPDF, getPDFUrl, deletePDF } = useFirebase();
  const toast = useToast();
  const router = useRouter();

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (file.type !== "application/pdf") {
        toast.error("Пожалуйста, выберите PDF файл", "Неверный формат файла");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(
          "Размер файла не должен превышать 10MB",
          "Слишком большой файл",
        );
        return;
      }

      setIsUploading(true);
      try {
        const url = await uploadPDF(file, songId);
        setPdfUrl(url);
        toast.success("PDF файл успешно загружен", "Успех");
      } catch (error) {
        console.error("Error uploading PDF:", error);
        toast.error("Не удалось загрузить PDF файл", "Ошибка загрузки");
      } finally {
        setIsUploading(false);
      }
    },
    [songId, uploadPDF, toast],
  );

  const loadPDFUrl = useCallback(async () => {
    setIsLoadingUrl(true);
    try {
      const url = await getPDFUrl(songId);
      setPdfUrl(url);
    } catch (error) {
      console.error("Error loading PDF URL:", error);
      setPdfUrl(null);
    } finally {
      setIsLoadingUrl(false);
    }
  }, [songId, getPDFUrl]);

  const handleDeletePDF = useCallback(async () => {
    try {
      await deletePDF(songId);
      setPdfUrl(null);
      router.refresh();
      toast.success("PDF файл удален", "Успех");
    } catch (error) {
      console.error("Error deleting PDF:", error);
      toast.error("Не удалось удалить PDF файл", "Ошибка удаления");
    }
  }, [songId, deletePDF, toast, router]);

  return {
    isUploading,
    pdfUrl,
    isLoadingUrl,
    handleFileUpload,
    loadPDFUrl,
    handleDeletePDF,
  };
};
