"use client";

import { WBadge, WButton, WModal } from "@/components/ui";
import { SONG_KEYS } from "@/lib/keys";
import { SongKey } from "@prisma/client";
import { useEffect, useState } from "react";
import { useModalContext } from "../contexts/ModalContext";
import { useAdaptations } from "../hooks/useAdaptations";

interface Singer {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdaptationsModal({
  onRefresh,
}: {
  onRefresh: () => void;
}) {
  const { viewingAdaptations, showAdaptationsModal, closeAdaptationsModal } =
    useModalContext();

  const [availableSingers, setAvailableSingers] = useState<
    Array<{
      id: string;
      name: string;
      email: string;
      role: string;
    }>
  >([]);

  // Fetch available singers
  useEffect(() => {
    const fetchSingers = async () => {
      try {
        const response = await fetch("/api/users/singers");
        if (response.ok) {
          const singers = await response.json();
          setAvailableSingers(singers);
        }
      } catch (error) {
        console.error("Failed to fetch singers:", error);
      }
    };

    fetchSingers();
  }, []);
  const {
    adaptations,
    loading,
    fetchAdaptations,
    addAdaptation,
    updateAdaptation,
    deleteAdaptation,
  } = useAdaptations(viewingAdaptations?.id || null);
  const songTitle = viewingAdaptations?.title;
  const [selectedSinger, setSelectedSinger] = useState<string>("");
  const [selectedKey, setSelectedKey] = useState<SongKey | "">("");
  const [isAdding, setIsAdding] = useState(false);

  // Fetch adaptations when modal opens
  useEffect(() => {
    if (showAdaptationsModal) {
      fetchAdaptations();
    }
  }, [showAdaptationsModal, fetchAdaptations]);

  // Get singers that are not yet assigned
  const unassignedSingers = availableSingers.filter(
    (singer) =>
      !adaptations.some((adaptation) => adaptation.singerId === singer.id),
  );

  const handleAddAdaptation = async () => {
    if (!selectedSinger || !selectedKey) {
      return;
    }

    setIsAdding(true);
    try {
      await addAdaptation(selectedSinger, selectedKey as SongKey);
      setSelectedSinger("");
      setSelectedKey("");
      onRefresh();
    } catch (err) {
      console.error("Failed to add adaptation:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdateKey = async (singerId: string, newKey: SongKey) => {
    try {
      await updateAdaptation(singerId, newKey);
      onRefresh();
    } catch (err) {
      console.error("Failed to update adaptation:", err);
    }
  };

  const handleDeleteAdaptation = async (singerId: string) => {
    if (confirm("Are you sure you want to remove this adaptation?")) {
      try {
        await deleteAdaptation(singerId);
        onRefresh();
      } catch (err) {
        console.error("Failed to delete adaptation:", err);
      }
    }
  };

  return (
    <WModal isOpen={showAdaptationsModal} onClose={closeAdaptationsModal}>
      <div className="mt-3">
        {/* Header */}
        <h3 className="text-xl font-medium text-gray-900 mb-6">
          Адаптации для песни {songTitle}
        </h3>

        {/* Content */}
        <div className="">
          {/* Current Adaptations */}
          <div className="mb-6">
            {loading ? (
              <div className="text-center py-4">
                <p className="text-gray-600">Загрузка...</p>
              </div>
            ) : adaptations.length === 0 ? (
              <p className="text-gray-500 text-sm">
                Нет адаптаций для этой песни
              </p>
            ) : (
              <div className="space-y-2">
                {adaptations.map((adaptation) => (
                  <div
                    key={adaptation.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {adaptation.singer.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {adaptation.singer.email}
                        </p>
                      </div>
                      <WBadge variant="default">{adaptation.key}</WBadge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select
                        value={adaptation.key}
                        onChange={(e) =>
                          handleUpdateKey(
                            adaptation.singerId,
                            e.target.value as SongKey,
                          )
                        }
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {SONG_KEYS.map((key) => (
                          <option key={key.value} value={key.value}>
                            {key.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() =>
                          handleDeleteAdaptation(adaptation.singerId)
                        }
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Удалить адаптацию"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Adaptation */}
          {unassignedSingers.length > 0 && (
            <div className="border-t border-gray-200 pt-6 pb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-3">
                Добавить адаптацию
              </h4>
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Исполнитель
                  </label>
                  <select
                    value={selectedSinger}
                    onChange={(e) => setSelectedSinger(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Выберите исполнителя</option>
                    {unassignedSingers.map((singer) => (
                      <option key={singer.id} value={singer.id}>
                        {singer.name} ({singer.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Тональность
                  </label>
                  <select
                    value={selectedKey}
                    onChange={(e) => setSelectedKey(e.target.value as SongKey)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Выберите тональность</option>
                    {SONG_KEYS.map((key) => (
                      <option key={key.value} value={key.value}>
                        {key.label}
                      </option>
                    ))}
                  </select>
                </div>
                <WButton
                  onClick={handleAddAdaptation}
                  disabled={!selectedSinger || !selectedKey || isAdding}
                  variant="primary"
                  size="sm"
                >
                  {isAdding ? "Добавление..." : "Добавить"}
                </WButton>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end py-6 border-t border-gray-200">
          <WButton onClick={closeAdaptationsModal} variant="secondary">
            Закрыть
          </WButton>
        </div>
      </div>
    </WModal>
  );
}
