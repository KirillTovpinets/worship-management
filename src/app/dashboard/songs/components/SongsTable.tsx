"use client";

import RoleGuard from "@/app/components/role-guard";
import {
  WBadge,
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
import { getKeyLabel } from "@/lib/keys";
import { useRouter, useSearchParams } from "next/navigation";
import { Song } from "../types";

interface SongsTableProps {
  songs: Song[];
  onDeleteSong: (songId: string) => void;
  onSort: (sortKey: string) => void;
}

export const SongsTable = ({
  songs,
  onDeleteSong,
  onSort,
}: SongsTableProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSortBy = searchParams.get("sortBy");
  const currentSortOrder = searchParams.get("sortOrder") as "asc" | "desc";
  const sortConfig = currentSortBy
    ? { key: currentSortBy, direction: currentSortOrder }
    : null;

  const handleRowClick = (song: Song) => {
    router.push(`/dashboard/songs/${song.id}`);
  };
  let maxAdoptations = 0;
  let songWithMaxAdoptations: Song | null = null;
  for (const song of songs) {
    if (song.adaptations?.length && song.adaptations?.length > maxAdoptations) {
      maxAdoptations = song.adaptations?.length;
      songWithMaxAdoptations = song;
    }
  }

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
            {songWithMaxAdoptations &&
              songWithMaxAdoptations.adaptations?.map((adaptation) => (
                <WTh key={adaptation.id}>{adaptation.singer.name}</WTh>
              ))}
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
            <WSortableTh
              sortKey="album"
              currentSort={sortConfig}
              onSort={onSort}
            >
              Альбом
            </WSortableTh>
            <WTh>Стиль</WTh>
            <WTh>Теги</WTh>
            <WTh>Заметки</WTh>

            <RoleGuard>
              <WTh>Действия</WTh>
            </RoleGuard>
          </WTr>
        </WThead>
        <WTbody>
          {songs.map((song: Song) => (
            <WTr
              key={song.id}
              className="hover:bg-gray-50"
              onClick={() => handleRowClick(song)}
            >
              <WTd>
                <div className="text-sm font-medium text-gray-900">
                  {song.title}
                </div>
              </WTd>
              {songWithMaxAdoptations &&
                songWithMaxAdoptations.adaptations &&
                songWithMaxAdoptations.adaptations.length > 0 &&
                songWithMaxAdoptations.adaptations.map((adaptation) => {
                  const songAdoptation = song.adaptations?.find(
                    (a, i) => a.singerId === adaptation.singerId,
                  );
                  if (songAdoptation) {
                    return (
                      <WTd key={`${song.id}-${songAdoptation.id}`}>
                        <WBadge variant="success" size="sm">
                          {getKeyLabel(songAdoptation.key)}
                        </WBadge>
                      </WTd>
                    );
                  } else {
                    return (
                      <WTd key={`${song.id}-empty`}>
                        <span className="text-gray-400 text-xs">Нет</span>
                      </WTd>
                    );
                  }
                })}
              <WTd>{song.bpm}</WTd>
              <WTd>{song.nature}</WTd>
              <WTd>{song.originalSinger}</WTd>
              <WTd>{song.author}</WTd>
              <WTd>{song.album}</WTd>
              <WTd>{song.style}</WTd>
              <WTd>
                <div className="flex gap-2 flex-wrap">
                  {song.tags.split(" / ").map((tag) => (
                    <WBadge key={tag} variant="info">
                      {tag}
                    </WBadge>
                  ))}
                </div>
              </WTd>
              <WTd>{song.notes}</WTd>
              <RoleGuard>
                <WTd className="text-sm font-medium">
                  <div className="flex items-center space-x-2">
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
              </RoleGuard>
            </WTr>
          ))}
        </WTbody>
      </WTable>
    </WTableContainer>
  );
};
