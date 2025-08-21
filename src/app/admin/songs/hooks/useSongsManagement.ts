"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { CurrentFilters, SongFormData } from "../types";

export const useSongsManagement = (currentFilters: CurrentFilters) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const updateSearchParams = useCallback(
    (newFilters: CurrentFilters) => {
      const params = new URLSearchParams(searchParams.toString());

      // Clear existing filter params (but preserve sort params)
      params.delete("search");
      params.delete("tones");
      params.delete("paces");
      params.delete("styles");
      params.delete("tags");
      params.delete("natures");
      params.delete("matchingSingers");
      params.delete("hasEvents");
      params.delete("page"); // Reset to page 1 when filters change

      // Add new filter params
      if (newFilters.search) {
        params.set("search", newFilters.search);
      }

      newFilters.tones.forEach((tone) => params.append("tones", tone));
      newFilters.paces.forEach((pace) => params.append("paces", pace));
      newFilters.styles.forEach((style) => params.append("styles", style));
      newFilters.tags.forEach((tag) => params.append("tags", tag));
      newFilters.natures.forEach((nature) => params.append("natures", nature));
      newFilters.matchingSingers.forEach((singer) =>
        params.append("matchingSingers", singer.name),
      );

      if (newFilters.hasEvents !== undefined) {
        params.set("hasEvents", newFilters.hasEvents.toString());
      }

      // Preserve existing sort params if not explicitly provided
      if (newFilters.sortBy) {
        params.set("sortBy", newFilters.sortBy);
      }
      if (newFilters.sortOrder) {
        params.set("sortOrder", newFilters.sortOrder);
      }

      router.push(`/admin/songs?${params.toString()}`, { scroll: false });
    },
    [searchParams, router],
  );

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    const url = `/admin/songs?${params.toString()}`;
    router.push(url, { scroll: false });
  };

  const handlePageSizeChange = (pageSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", pageSize.toString());
    params.delete("page"); // Reset to page 1 when changing page size
    const url = `/admin/songs?${params.toString()}`;
    router.push(url, { scroll: false });
  };

  const handleFiltersChange = useCallback(
    (newFilters: CurrentFilters) => {
      // Only update if filters actually changed (excluding sort params)
      const hasChanged =
        newFilters.search !== currentFilters.search ||
        JSON.stringify(newFilters.tones) !==
          JSON.stringify(currentFilters.tones) ||
        JSON.stringify(newFilters.paces) !==
          JSON.stringify(currentFilters.paces) ||
        JSON.stringify(newFilters.styles) !==
          JSON.stringify(currentFilters.styles) ||
        JSON.stringify(newFilters.tags) !==
          JSON.stringify(currentFilters.tags) ||
        JSON.stringify(newFilters.natures) !==
          JSON.stringify(currentFilters.natures) ||
        JSON.stringify(newFilters.matchingSingers) !==
          JSON.stringify(currentFilters.matchingSingers) ||
        newFilters.hasEvents !== currentFilters.hasEvents;

      if (hasChanged) {
        updateSearchParams(newFilters);
      }
    },
    [updateSearchParams, currentFilters],
  );

  const handleDeleteSong = async (songId: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту песню?")) return;

    try {
      const response = await fetch(`/api/songs/${songId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSuccess("Песня удалена успешно");
        // Refresh the page to show updated data
        router.push(`/admin/songs?${searchParams.toString()}`);
      } else {
        const data = await response.json();
        setError(data.error || "Не удалось удалить песню");
      }
    } catch {
      setError("Ошибка удаления песны");
    }
  };

  const handleCreateSong = async (formData: SongFormData) => {
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Песня создана успешно");
        // Refresh the page to show new data
        router.push(`/admin/songs?${searchParams.toString()}`);
        return { success: true };
      } else {
        setError(data.error || "Не удалось создать песню");
        return { success: false, error: data.error };
      }
    } catch {
      setError("Ошибка создания песны");
      return { success: false, error: "Ошибка создания песны" };
    }
  };

  const handleUpdateSong = async (songId: string, formData: SongFormData) => {
    setError("");
    setSuccess("");

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
        setSuccess("Песня обновлена успешно");
        // Refresh the page to show updated data
        router.push(`/admin/songs?${searchParams.toString()}`);
        return { success: true };
      } else {
        setError(data.error || "Не удалось обновить песню");
        return { success: false, error: data.error };
      }
    } catch {
      setError("Ошибка обновления песны");
      return { success: false, error: "Ошибка обновления песны" };
    }
  };

  const handleSort = useCallback(
    (sortKey: string) => {
      const currentSortBy = searchParams.get("sortBy");
      const currentSortOrder = searchParams.get("sortOrder") as "asc" | "desc";

      let newSortOrder: "asc" | "desc" = "asc";

      if (currentSortBy === sortKey && currentSortOrder === "asc") {
        newSortOrder = "desc";
      }

      // Directly update URL params without going through updateSearchParams
      const params = new URLSearchParams(searchParams.toString());
      params.set("sortBy", sortKey);
      params.set("sortOrder", newSortOrder);
      params.delete("page"); // Reset to page 1 when sorting changes

      router.push(`/admin/songs?${params.toString()}`, { scroll: false });
    },
    [searchParams, router],
  );

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  return {
    error,
    success,
    handlePageChange,
    handlePageSizeChange,
    handleFiltersChange,
    handleSort,
    handleDeleteSong,
    handleCreateSong,
    handleUpdateSong,
    clearMessages,
  };
};
