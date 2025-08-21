"use client";

import {
  WBadge,
  WBadgeGroup,
  WIconButton,
  WSortableTh,
  WTable,
  WTableContainer,
  WTbody,
  WTd,
  WTh,
  WThead,
  WTr,
} from "@/components/ui";
import { getKeyLabel } from "@/lib/songs";
import { useSearchParams } from "next/navigation";
import { useModalContext } from "../contexts/ModalContext";
import { Song } from "../types";

interface SongsTableProps {
  songs: Song[];
  onDeleteSong: (songId: string) => void;
  onSort: (sortKey: string) => void;
  onOpenAdaptations: (song: Song) => void;
}

export const SongsTable = ({
  songs,
  onDeleteSong,
  onSort,
  onOpenAdaptations,
}: SongsTableProps) => {
  const { openEditModal, openLyricsModal, openHistoryModal } =
    useModalContext();
  const searchParams = useSearchParams();

  const currentSortBy = searchParams.get("sortBy");
  const currentSortOrder = searchParams.get("sortOrder") as "asc" | "desc";
  const sortConfig = currentSortBy
    ? { key: currentSortBy, direction: currentSortOrder }
    : null;

  return (
    <WTableContainer>
      <WTable>
        <WThead>
          <WTr>
            <WSortableTh
              sortKey="title"
              currentSort={sortConfig}
              onSort={onSort}
            >
              Название
            </WSortableTh>
            <WTh>Тональности</WTh>
            <WSortableTh sortKey="bpm" currentSort={sortConfig} onSort={onSort}>
              BPM
            </WSortableTh>
            <WTh>Характер</WTh>
            <WSortableTh
              sortKey="originalSinger"
              currentSort={sortConfig}
              onSort={onSort}
            >
              Исполнитель
            </WSortableTh>
            <WSortableTh
              sortKey="author"
              currentSort={sortConfig}
              onSort={onSort}
            >
              Автор
            </WSortableTh>
            <WTh>Стиль</WTh>
            <WTh>Теги</WTh>

            <WTh>Действия</WTh>
          </WTr>
        </WThead>
        <WTbody>
          {songs.map((song: Song) => (
            <WTr key={song.id} className="hover:bg-gray-50">
              <WTd>
                <div className="text-sm font-medium text-gray-900">
                  {song.title}
                </div>
              </WTd>
              <WTd>
                {song.adaptations && song.adaptations.length > 0 ? (
                  <div className="flex items-center space-x-2">
                    <WBadgeGroup>
                      {song.adaptations.slice(0, 2).map((adaptation) => (
                        <WBadge key={adaptation.id} variant="success" size="sm">
                          {adaptation.singer.name} (
                          {getKeyLabel(adaptation.key)})
                        </WBadge>
                      ))}
                    </WBadgeGroup>
                    {song.adaptations.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{song.adaptations.length - 2} ещё
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400 text-xs">Нет адаптаций</span>
                )}
              </WTd>
              <WTd>{song.bpm}</WTd>
              <WTd>{song.nature}</WTd>
              <WTd>{song.originalSinger}</WTd>
              <WTd>{song.author}</WTd>
              <WTd>{song.style}</WTd>
              <WTd>{song.tags}</WTd>

              <WTd className="text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <WIconButton
                    variant="success"
                    onClick={() => onOpenAdaptations(song)}
                    title={`Адаптации (${song.adaptations?.length || 0})`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </WIconButton>
                  <WIconButton
                    variant="primary"
                    onClick={() => openLyricsModal(song.lyrics || "")}
                    title={
                      song.lyrics ? "Посмотреть текст" : "Текст отсутствует"
                    }
                    disabled={!song.lyrics}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </WIconButton>
                  <WIconButton
                    variant="info"
                    onClick={() => openHistoryModal(song)}
                    title={`История исполнения${
                      song.events && song.events.length > 0
                        ? `(${song.events.length})`
                        : ""
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </WIconButton>
                  <WIconButton
                    variant="primary"
                    onClick={() => openEditModal(song)}
                    title="Редактировать"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </WIconButton>
                  <WIconButton
                    variant="danger"
                    onClick={() => onDeleteSong(song.id)}
                    title="Удалить"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </WIconButton>
                </div>
              </WTd>
            </WTr>
          ))}
        </WTbody>
      </WTable>
    </WTableContainer>
  );
};
