import { useCallback, useEffect, useState } from "react";
import { FileInfo, useFirebase } from "../../../../hooks/useFirebase";
import { useToast } from "../../../../hooks/useToast";

export const useMultipleMP3Upload = (songId: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const [mp3Files, setMp3Files] = useState<FileInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { uploadMultipleMP3s, getMultipleMP3s, deleteMP3 } = useFirebase();
  const toast = useToast();

  const handleFilesUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      if (files.length === 0) return;

      // Validate file types
      const invalidFiles = files.filter(
        (file) => file.type !== "audio/mpeg" && file.type !== "audio/mp3",
      );
      if (invalidFiles.length > 0) {
        toast.error(
          "Пожалуйста, выберите только MP3 файлы",
          "Неверный формат файла",
        );
        return;
      }

      // Validate file sizes (max 50MB each)
      const oversizedFiles = files.filter(
        (file) => file.size > 50 * 1024 * 1024,
      );
      if (oversizedFiles.length > 0) {
        toast.error(
          "Размер каждого файла не должен превышать 50MB",
          "Слишком большой файл",
        );
        return;
      }

      setIsUploading(true);
      try {
        const uploadedFiles = await uploadMultipleMP3s(files, songId);
        setMp3Files((prev) => [...prev, ...uploadedFiles]);
        toast.success(
          `${files.length} MP3 файл(ов) успешно загружен(ы)`,
          "Успех",
        );
      } catch (error) {
        console.error("Error uploading MP3s:", error);
        toast.error("Не удалось загрузить MP3 файлы", "Ошибка загрузки");
      } finally {
        setIsUploading(false);
      }
    },
    [songId, uploadMultipleMP3s, toast],
  );

  const loadMP3Files = useCallback(async () => {
    setIsLoading(true);
    try {
      const files = await getMultipleMP3s(songId);
      setMp3Files(files);
    } catch (error) {
      console.error("Error loading MP3 files:", error);
      setMp3Files([]);
    } finally {
      setIsLoading(false);
    }
  }, [songId, getMultipleMP3s]);

  const handleDeleteMP3 = useCallback(
    async (fileId: string) => {
      try {
        await deleteMP3(songId, fileId);
        setMp3Files((prev) => prev.filter((file) => file.id !== fileId));
        toast.success("MP3 файл удален", "Успех");
      } catch (error) {
        console.error("Error deleting MP3:", error);
        toast.error("Не удалось удалить MP3 файл", "Ошибка удаления");
      }
    },
    [songId, deleteMP3, toast],
  );

  // Load MP3 files on component mount
  useEffect(() => {
    loadMP3Files();
  }, [loadMP3Files]);

  return {
    isUploading,
    isLoading,
    mp3Files,
    handleFilesUpload,
    handleDeleteMP3,
    loadMP3Files,
  };
};
