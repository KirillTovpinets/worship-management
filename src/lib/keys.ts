import { SongKey } from "@prisma/client";

export const SONG_KEYS: { value: SongKey; label: string }[] = [
  { value: "C", label: "C" },
  { value: "Cm", label: "Cm" },
  { value: "C_SHARP", label: "C#" },
  { value: "C_SHARP_M", label: "C#m" },
  { value: "D", label: "D" },
  { value: "Dm", label: "Dm" },
  { value: "Eb", label: "Eb" },
  { value: "Ebm", label: "Ebm" },
  { value: "E", label: "E" },
  { value: "Em", label: "Em" },
  { value: "F", label: "F" },
  { value: "Fm", label: "Fm" },
  { value: "F_SHARP", label: "F#" },
  { value: "F_SHARP_M", label: "F#m" },
  { value: "G", label: "G" },
  { value: "Gm", label: "Gm" },
  { value: "G_SHARP", label: "G#" },
  { value: "G_SHARP_M", label: "G#m" },
  { value: "A", label: "A" },
  { value: "Am", label: "Am" },
  { value: "Bb", label: "Bb" },
  { value: "Bbm", label: "Bbm" },
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
