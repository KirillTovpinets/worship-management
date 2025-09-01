import { SongKey } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "../../../../hooks/useToast";

interface Adaptation {
  id: string;
  songId: string;
  singerId: string;
  key: SongKey;
  createdAt: Date;
  updatedAt: Date;
  singer: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const useAdaptations = (songId: string | null) => {
  const [adaptations, setAdaptations] = useState<Adaptation[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Fetch adaptations for a song
  const fetchAdaptations = useCallback(async () => {
    setLoading(true);
    try {
      if (!songId) return;
      const response = await fetch(`/api/songs/${songId}/adaptations`);
      if (!response.ok) {
        throw new Error("Не удалось получить список тональностей");
      }
      const data = await response.json();
      setAdaptations(data);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "An error occurred",
        "Не удалось получить список тональностей",
      );
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songId]);

  useEffect(() => {
    fetchAdaptations();
  }, [fetchAdaptations]);

  const addAdaptation = useCallback(
    async (singerId: string, key: SongKey) => {
      setLoading(true);
      try {
        const response = await fetch(`/api/songs/${songId}/adaptations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ singerId, key }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Не удалось добавить тональность");
        }

        const newAdaptation = await response.json();
        setAdaptations((prev) => [...prev, newAdaptation]);
        toast.success("Тональность добавлена успешно", "Success");
        return newAdaptation;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        toast.error(errorMessage, "Не удалось добавить тональность");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [songId, toast],
  );

  // Update an adaptation
  const updateAdaptation = useCallback(
    async (singerId: string, key: SongKey) => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/songs/${songId}/adaptations/${singerId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ key }),
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Не удалось обновить тональность");
        }

        const updatedAdaptation = await response.json();
        setAdaptations((prev) =>
          prev.map((adaptation) =>
            adaptation.singerId === singerId ? updatedAdaptation : adaptation,
          ),
        );
        toast.success("Тональность обновлена успешно", "Success");
        return updatedAdaptation;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        toast.error(errorMessage, "Не удалось обновить тональность");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [songId, toast],
  );

  // Delete an adaptation
  const deleteAdaptation = useCallback(
    async (singerId: string) => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/songs/${songId}/adaptations/${singerId}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Не удалось удалить тональность");
        }

        setAdaptations((prev) =>
          prev.filter((adaptation) => adaptation.singerId !== singerId),
        );
        toast.success("Тональность удалена успешно", "Success");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        toast.error(errorMessage, "Не удалось удалить тональность");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [songId, toast],
  );

  return {
    adaptations,
    loading,
    fetchAdaptations,
    addAdaptation,
    updateAdaptation,
    deleteAdaptation,
  };
};
