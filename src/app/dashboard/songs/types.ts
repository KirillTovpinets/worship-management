import { Song as PrismaSong, SongKey } from "@prisma/client";

export interface Song extends PrismaSong {
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
  styles: string[];
  tags: string[];
  natures: string[];
  albums: string[];
}

export interface CurrentFilters {
  search: string;
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

export type SongFormData = Omit<Song, "id" | "createdAt" | "updatedAt">;
