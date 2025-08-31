"use client";

import { useSongEntity } from "@/app/admin/songs/hooks/useSongEntity";
import { WTextarea } from "@/components/ui";
import { WModal } from "@/components/ui/WModal";
import { useEffect, useState } from "react";
import { useModalContext } from "./contexts/ModalContext";
import { SongFormData } from "./types";

export const EditSongModal = () => {
  const { showEditModal, editingSong, closeEditModal } = useModalContext();
  const { handleUpdateSong } = useSongEntity();

  const [formData, setFormData] = useState<SongFormData>({
    title: "",
    bpm: "",
    originalSinger: "",
    author: "",
    style: "",
    tags: "",
    nature: "",
    lyrics: "",
    notes: "",
  });

  useEffect(() => {
    if (editingSong) {
      setFormData({
        title: editingSong.title,
        bpm: editingSong.bpm,
        originalSinger: editingSong.originalSinger,
        author: editingSong.author,
        style: editingSong.style,
        tags: editingSong.tags,
        nature: editingSong.nature,
        lyrics: editingSong.lyrics || "",
        notes: editingSong.notes || "",
      });
    }
  }, [editingSong]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSong) return;
    const result = await handleUpdateSong(editingSong.id, formData);
    if (result.success) {
      closeEditModal();
    }
  };

  const handleClose = () => {
    closeEditModal();
  };

  if (!showEditModal || !editingSong) return null;

  return (
    <WModal isOpen={showEditModal} onClose={closeEditModal}>
      <div className="mt-3">
        <h3 className="text-xl font-medium text-gray-900 mb-6">
          Редактировать песню
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
                Теги (разделитель /) *
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
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Заметки
              </label>
              <WTextarea
                placeholder="e.g., upbeat, reflective, powerful"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="mt-1 block text-black w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
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
              Обновить песню
            </button>
          </div>
        </form>
      </div>
    </WModal>
  );
};
