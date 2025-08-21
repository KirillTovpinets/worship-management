import { SongKey } from "@prisma/client";
import { useCallback, useState } from "react";

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

// Singer interface removed as it's not used

export const useAdaptations = (songId: string | null) => {
  const [adaptations, setAdaptations] = useState<Adaptation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch adaptations for a song
  const fetchAdaptations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!songId) return;
      const response = await fetch(`/api/songs/${songId}/adaptations`);
      if (!response.ok) {
        throw new Error("Failed to fetch adaptations");
      }
      const data = await response.json();
      setAdaptations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [songId]);

  // Add a new adaptation
  const addAdaptation = useCallback(
    async (singerId: string, key: SongKey) => {
      setLoading(true);
      setError(null);
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
          throw new Error(errorData.error || "Failed to add adaptation");
        }

        const newAdaptation = await response.json();
        setAdaptations((prev) => [...prev, newAdaptation]);
        return newAdaptation;
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [songId],
  );

  // Update an adaptation
  const updateAdaptation = useCallback(
    async (singerId: string, key: SongKey) => {
      setLoading(true);
      setError(null);
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
          throw new Error(errorData.error || "Failed to update adaptation");
        }

        const updatedAdaptation = await response.json();
        setAdaptations((prev) =>
          prev.map((adaptation) =>
            adaptation.singerId === singerId ? updatedAdaptation : adaptation,
          ),
        );
        return updatedAdaptation;
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [songId],
  );

  // Delete an adaptation
  const deleteAdaptation = useCallback(
    async (singerId: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/songs/${songId}/adaptations/${singerId}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete adaptation");
        }

        setAdaptations((prev) =>
          prev.filter((adaptation) => adaptation.singerId !== singerId),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [songId],
  );

  return {
    adaptations,
    loading,
    error,
    fetchAdaptations,
    addAdaptation,
    updateAdaptation,
    deleteAdaptation,
  };
};
