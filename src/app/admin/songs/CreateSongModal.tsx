"use client";

import { WModal } from "@/components/ui/WModal";
import { SONG_KEYS, SONG_PACES } from "@/lib/songs";
import { SongKey, SongPace } from "@prisma/client";
import { useState } from "react";
import { useModalContext } from "./contexts/ModalContext";
import { useSongsManagementContext } from "./contexts/SongsManagementContext";
import { SongFormData } from "./types";

export const CreateSongModal = () => {
  const { showCreateModal, closeCreateModal } = useModalContext();
  const { handleCreateSong } = useSongsManagementContext();

  const [formData, setFormData] = useState<SongFormData>({
    title: "",
    tone: "C" as SongKey,
    bpm: "",
    originalSinger: "",
    author: "",
    pace: "MODERATE" as SongPace,
    style: "",
    tags: "",
    nature: "",
    lyrics: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await handleCreateSong(formData);
    if (result.success) {
      closeCreateModal();
    }
  };

  const handleClose = () => {
    closeCreateModal();
  };

  if (!showCreateModal) return null;

  return (
    <WModal isOpen={showCreateModal} onClose={closeCreateModal}>
      <div className="mt-3">
        <h3 className="text-xl font-medium text-gray-900 mb-6">
          Создать новую песню
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Название *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="mt-1 block text-black w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Тональность *
              </label>
              <select
                required
                value={formData.tone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tone: e.target.value as SongKey,
                  })
                }
                className="mt-1 block text-black w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {SONG_KEYS.map((keyOption) => (
                  <option key={keyOption.value} value={keyOption.value}>
                    {keyOption.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Темп *
              </label>
              <input
                type="text"
                required
                value={formData.bpm}
                onChange={(e) =>
                  setFormData({ ...formData, bpm: e.target.value })
                }
                className="mt-1 block text-black w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Исполнитель *
              </label>
              <input
                type="text"
                required
                value={formData.originalSinger}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    originalSinger: e.target.value,
                  })
                }
                className="mt-1 block text-black w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Автор *
              </label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                className="mt-1 block text-black w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Темп *
              </label>
              <select
                required
                value={formData.pace}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pace: e.target.value as SongPace,
                  })
                }
                className="mt-1 block text-black w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                {SONG_PACES.map((paceOption) => (
                  <option key={paceOption.value} value={paceOption.value}>
                    {paceOption.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Стиль *
              </label>
              <input
                type="text"
                required
                value={formData.style}
                onChange={(e) =>
                  setFormData({ ...formData, style: e.target.value })
                }
                className="mt-1 block text-black w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Теги *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., worship, contemporary, gospel"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                className="mt-1 block text-black w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Характер *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., upbeat, reflective, powerful"
                value={formData.nature}
                onChange={(e) =>
                  setFormData({ ...formData, nature: e.target.value })
                }
                className="mt-1 block text-black w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Текст песни (загрузите TXT файл или вставьте текст)
              </label>
              <div className="space-y-3">
                <div>
                  <input
                    type="file"
                    accept=".txt"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const text = event.target?.result as string;
                          setFormData({ ...formData, lyrics: text });
                        };
                        reader.readAsText(file);
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 text-black"
                  />
                </div>
                <div>
                  <textarea
                    value={formData.lyrics}
                    onChange={(e) =>
                      setFormData({ ...formData, lyrics: e.target.value })
                    }
                    placeholder="Вставьте текст песни или загрузите TXT файл выше..."
                    rows={8}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Создать песню
            </button>
          </div>
        </form>
      </div>
    </WModal>
  );
};
