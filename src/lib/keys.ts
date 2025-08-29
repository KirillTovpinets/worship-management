import { SongKey } from "@prisma/client";

export const SONG_KEYS: { value: SongKey; label: string }[] = [
  { value: "C", label: "C" },
  { value: "C_SHARP", label: "Db" },
  { value: "D", label: "D" },
  { value: "D_SHARP", label: "Eb" },
  { value: "E", label: "E" },
  { value: "F", label: "F" },
  { value: "F_SHARP", label: "Gb" },
  { value: "G", label: "G" },
  { value: "G_SHARP", label: "Ab" },
  { value: "A", label: "A" },
  { value: "A_SHARP", label: "Bb" },
  { value: "B", label: "B" },
];

export const getKeyLabel = (key: SongKey | null | undefined): string => {
  if (!key) return "";
  const keyOption = SONG_KEYS.find((k) => k.value === key);
  return keyOption ? keyOption.label : key;
};

export const getKeyValue = (label: string): SongKey | null => {
  const keyOption = SONG_KEYS.find(
    (k) => k.label === label || k.value === label,
  );
  return keyOption ? keyOption.value : null;
};

export const SONG_PACES: { value: string; label: string }[] = [
  { value: "SLOW", label: "Медленный" },
  { value: "MEDIUM", label: "Средний" },
  { value: "FAST", label: "Быстрый" },
];
