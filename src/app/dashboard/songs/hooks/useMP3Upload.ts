import { useCallback, useState } from "react";
import { useFirebase } from "../../../../hooks/useFirebase";
import { useToast } from "../../../../hooks/useToast";

export const useMP3Upload = (songId: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const [mp3Url, setMp3Url] = useState<string | null>(null);
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const { uploadMP3, getMP3Url, deleteMP3 } = useFirebase();
  const toast = useToast();

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (file.type !== "audio/mpeg" && file.type !== "audio/mp3") {
        toast.error("Пожалуйста, выберите MP3 файл", "Неверный формат файла");
        return;
      }

      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error(
          "Размер файла не должен превышать 50MB",
          "Слишком большой файл",
        );
        return;
      }

      setIsUploading(true);
      try {
        const url = await uploadMP3(file, songId);
        setMp3Url(url);
        toast.success("MP3 файл успешно загружен", "Успех");
      } catch (error) {
        console.error("Error uploading MP3:", error);
        toast.error("Не удалось загрузить MP3 файл", "Ошибка загрузки");
      } finally {
        setIsUploading(false);
      }
    },
    [songId, uploadMP3, toast],
  );

  const loadMP3Url = useCallback(async () => {
    setIsLoadingUrl(true);
    try {
      const url = await getMP3Url(songId);
      setMp3Url(url);
    } catch (error) {
      console.error("Error loading MP3 URL:", error);
      setMp3Url(null);
    } finally {
      setIsLoadingUrl(false);
    }
  }, [songId, getMP3Url]);

  const handleDeleteMP3 = useCallback(async () => {
    try {
      await deleteMP3(songId);
      setMp3Url(null);
      toast.success("MP3 файл удален", "Успех");
    } catch (error) {
      console.error("Error deleting MP3:", error);
      toast.error("Не удалось удалить MP3 файл", "Ошибка удаления");
    }
  }, [songId, deleteMP3, toast]);

  return {
    isUploading,
    mp3Url,
    isLoadingUrl,
    handleFileUpload,
    loadMP3Url,
    handleDeleteMP3,
  };
};
