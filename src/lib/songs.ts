import { SongPace } from "@prisma/client";

export const SONG_PACES: { value: SongPace; label: string }[] = [
  { value: "SLOW", label: "Slow" },
  { value: "MODERATE", label: "Moderate" },
  { value: "FAST", label: "Fast" },
];

export const getPaceLabel = (pace: SongPace | null | undefined): string => {
  if (!pace) return "";
  const paceOption = SONG_PACES.find((p) => p.value === pace);
  return paceOption ? paceOption.label : pace;
};

export const getPaceValue = (label: string): SongPace | null => {
  const paceOption = SONG_PACES.find(
    (p) => p.label === label || p.value === label
  );
  return paceOption ? paceOption.value : null;
};

// Re-export key functions for convenience
export { SONG_KEYS, getKeyLabel, getKeyValue } from "./keys";
