import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useToast } from "../../../../hooks/useToast";
import { Song } from "../types";

export const useImportLyrics = (
  song: Song,
  onSuccess: (text: string) => void,
) => {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();

  const uploadLyrics = useCallback(
    async (text: string) => {
      try {
        setIsUploading(true);
        const response = await fetch(`/api/songs/${song.id}/lyrics`, {
          method: "POST",
          body: JSON.stringify({ lyrics: text }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          onSuccess(text);
          toast.success("Текст песни успешно загружен", "Success");
          // Refresh the page to show updated data
          router.refresh();
        } else {
          toast.error(
            data.error || "Не удалось загрузить текст песни",
            "Error",
          );
        }
      } catch {
        toast.error("Ошибка загрузки файла", "Error");
      } finally {
        setIsUploading(false);
      }
    },
    [song.id, onSuccess, router, toast],
  );

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is a text file
    if (!file.name.endsWith(".txt")) {
      toast.error("Пожалуйста, загрузите файл в формате .txt", "Error");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;

      uploadLyrics(text);
    };
    reader.readAsText(file);
  };

  return {
    isUploading,
    handleFileUpload,
    uploadLyrics,
  };
};
