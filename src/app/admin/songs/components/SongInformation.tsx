import AdaptationsModal from "@/app/admin/songs/components/AdaptationsModal";
import { useModalContext } from "@/app/admin/songs/contexts/ModalContext";
import { EditSongModal } from "@/app/admin/songs/EditSongModal";
import { useAdaptations } from "@/app/admin/songs/hooks/useAdaptations";
import { WBadge, WButton } from "@/components/ui";
import { getKeyLabel } from "@/lib/keys";
import { Song } from "../types";
import { PDFUpload } from "@/app/admin/songs/components/PDFUpload";

interface SongInformationProps {
  song: Song;
}

export default function SongInformation({ song }: SongInformationProps) {
  const { adaptations, loading, fetchAdaptations } = useAdaptations(song.id);

  const { openAdaptationsModal, openEditModal } = useModalContext();

  const handleOpenAdaptations = () => {
    openAdaptationsModal(song);
  };

  const handleOpenEditModal = () => {
    openEditModal(song);
  };

  return (
    <div className="flex flex-col gap-5 max-w-sm">
      <div>
        <div className="flex gap-2 items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Информация о песне
          </h3>

          <WButton variant="tertiary" size="none" onClick={handleOpenEditModal}>
            Изменить
          </WButton>
        </div>
        <div className="px-6 py-4">
          <p>BPM: {song.bpm}</p>
          <p>Исполнитель: {song.originalSinger}</p>
          <p>Автор: {song.author}</p>
          <p>Стиль: {song.style}</p>
          <p>
            Теги:{" "}
            <div className="flex gap-2 flex-wrap">
              {song.tags.split(" / ").map((tag) => (
                <WBadge key={tag} variant="info">
                  {tag}
                </WBadge>
              ))}
            </div>
          </p>
          <p>Характер песни: {song.nature}</p>
        </div>
      </div>
      <PDFUpload songId={song.id} songTitle={song.title} />
      {/* Adaptations Section */}
      <div>
        <div className="flex gap-2 items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Тональности</h3>
          <WButton
            variant="tertiary"
            size="none"
            onClick={handleOpenAdaptations}
          >
            Изменить
          </WButton>
        </div>
        <div className="px-6 py-4">
          {loading ? (
            <div className="text-center py-4">
              <p className="text-gray-600">Загрузка тональностей...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {adaptations.length === 0 ? (
                <p className="text-gray-500">Нет тональностей для этой песни</p>
              ) : (
                <div className="space-y-4">
                  {adaptations.map((adaptation) => (
                    <div
                      key={adaptation.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {adaptation.singer.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {adaptation.singer.email}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <WBadge variant="default">
                            {getKeyLabel(adaptation.key)}
                          </WBadge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* History Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          История исполнения
        </h3>
        <div className="px-6 py-4">
          {song.events && song.events.length > 0 ? (
            <div className="space-y-4">
              {song.events.map((event) => (
                <div
                  key={event.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {event.event.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {new Date(event.event.date).toLocaleDateString("ru-RU")}
                      </p>
                      {event.event.description && (
                        <p className="text-sm text-gray-500 mt-1">
                          {event.event.description}
                        </p>
                      )}
                    </div>
                    <WBadge variant="default">Порядок: {event.order}</WBadge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Нет истории исполнения</p>
          )}
        </div>
      </div>
      <AdaptationsModal onRefresh={fetchAdaptations} />
      <EditSongModal />
    </div>
  );
}
