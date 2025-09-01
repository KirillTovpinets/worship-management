import { SongFormData } from "@/app/dashboard/songs/types";
import { useRouter } from "next/navigation";
import { useToast } from "../../../../hooks/useToast";

export const useSongEntity = () => {
  const router = useRouter();
  const toast = useToast();
  const handleUpdateSong = async (songId: string, formData: SongFormData) => {
    try {
      const response = await fetch(`/api/songs/${songId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Песня обновлена успешно", "Success");
        // Refresh the page to show updated data
        router.refresh();
        return { success: true };
      } else {
        toast.error(data.error || "Не удалось обновить песню", "Error");
        return { success: false, error: data.error };
      }
    } catch (e) {
      console.error("Ошибка обновления песни", e);
      toast.error("Ошибка обновления песни", "Error");
      return { success: false, error: "Ошибка обновления песни" };
    }
  };
  return {
    handleUpdateSong,
  };
};
