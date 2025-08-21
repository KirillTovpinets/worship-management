import { SongKey, SongPace } from "@prisma/client";

export interface Song {
  id: string;
  title: string;
  bpm: string;
  originalSinger: string;
  author: string;
  pace: SongPace;
  style: string;
  tags: string;
  nature: string;
  lyrics?: string | null;
  createdAt: Date;
  updatedAt: Date;
  events?: Array<{
    id: string;
    eventId: string;
    songId: string;
    order: number;
    createdAt: Date;
    event: {
      id: string;
      title: string;
      date: Date;
      description?: string | null;
      createdAt: Date;
      updatedAt: Date;
    };
  }>;
  matchingUsers?: Array<{
    id: string;
    name: string;
    email: string;
    key: string;
    role: string;
  }>;
  adaptations?: Array<{
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
  }>;
}

export interface PaginationData {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface FilterOptions {
  paces: string[];
  styles: string[];
  tags: string[];
  natures: string[];
}

export interface CurrentFilters {
  search: string;
  paces: string[];
  styles: string[];
  tags: string[];
  natures: string[];
  hasEvents?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface SongsClientProps {
  songs: Song[];
  pagination: PaginationData;
  filters: FilterOptions;
  currentFilters: CurrentFilters;
}

export interface SongFormData {
  title: string;
  bpm: string;
  originalSinger: string;
  author: string;
  pace: SongPace;
  style: string;
  tags: string;
  nature: string;
  lyrics: string;
}
