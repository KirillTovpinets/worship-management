"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export const useImportSongs = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importResults, setImportResults] = useState<{
    success?: number;
    failed?: number;
    totalRows?: number;
    skipped?: number;
    errors?: string[];
    expectedColumns?: Record<string, string[] | string>;
  } | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch("/api/songs/import/template");
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "songs-import-template.xlsx";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error("Failed to download template");
      }
    } catch {
      throw new Error("Error downloading template");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
      setImportResults(null);
    }
  };

  const handleImportSongs = async () => {
    if (!importFile) return;

    setIsImporting(true);

    try {
      const formData = new FormData();
      formData.append("file", importFile);

      const response = await fetch("/api/songs/import", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setImportResults(data.results);
        if (data.results.success > 0) {
          // Refresh the page to show new data
          router.push(`/dashboard/songs?${searchParams.toString()}`);
        }
        return { success: true, data };
      } else {
        setImportResults({ expectedColumns: data.expectedColumns });
        return { success: false, error: data.error, data };
      }
    } catch {
      return { success: false, error: "Error importing songs" };
    } finally {
      setIsImporting(false);
    }
  };

  const resetImport = () => {
    setImportFile(null);
    setImportResults(null);
    setIsImporting(false);
  };

  return {
    importFile,
    importResults,
    isImporting,
    handleDownloadTemplate,
    handleFileChange,
    handleImportSongs,
    resetImport,
  };
};
