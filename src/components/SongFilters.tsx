"use client";

import { SONG_KEYS, SONG_PACES } from "@/lib/songs";
import { useEffect, useState } from "react";

interface FilterOptions {
  tones: string[];
  paces: string[];
  styles: string[];
  tags: string[];
  natures: string[];
}

interface SongFiltersProps {
  filters: FilterOptions;
  currentFilters: {
    search: string;
    tones: string[];
    paces: string[];
    styles: string[];
    tags: string[];
    natures: string[];
    hasEvents?: boolean;
  };
  onFiltersChange: (filters: {
    search: string;
    tones: string[];
    paces: string[];
    styles: string[];
    tags: string[];
    natures: string[];
    hasEvents?: boolean;
  }) => void;
}

export default function SongFilters({
  filters,
  currentFilters,
  onFiltersChange,
}: SongFiltersProps) {
  const [search, setSearch] = useState(currentFilters.search);
  const [selectedTones, setSelectedTones] = useState<string[]>(
    currentFilters.tones,
  );
  const [selectedPaces, setSelectedPaces] = useState<string[]>(
    currentFilters.paces,
  );
  const [selectedStyles, setSelectedStyles] = useState<string[]>(
    currentFilters.styles,
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    currentFilters.tags,
  );
  const [selectedNatures, setSelectedNatures] = useState<string[]>(
    currentFilters.natures,
  );
  const [hasEvents, setHasEvents] = useState<boolean | undefined>(
    currentFilters.hasEvents,
  );
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search effect for search input only
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({
        search,
        tones: selectedTones,
        paces: selectedPaces,
        styles: selectedStyles,
        tags: selectedTags,
        natures: selectedNatures,
        hasEvents,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Trigger filter change when checkboxes/selects change (immediate)
  useEffect(() => {
    onFiltersChange({
      search,
      tones: selectedTones,
      paces: selectedPaces,
      styles: selectedStyles,
      tags: selectedTags,
      natures: selectedNatures,
      hasEvents,
    });
  }, [
    selectedTones,
    selectedPaces,
    selectedStyles,
    selectedTags,
    selectedNatures,
    hasEvents,
  ]);

  const handleToneToggle = (tone: string) => {
    setSelectedTones((prev) =>
      prev.includes(tone) ? prev.filter((t) => t !== tone) : [...prev, tone],
    );
  };

  const handlePaceToggle = (pace: string) => {
    setSelectedPaces((prev) =>
      prev.includes(pace) ? prev.filter((p) => p !== pace) : [...prev, pace],
    );
  };

  const handleStyleToggle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style],
    );
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleNatureToggle = (nature: string) => {
    setSelectedNatures((prev) =>
      prev.includes(nature)
        ? prev.filter((n) => n !== nature)
        : [...prev, nature],
    );
  };

  const clearAllFilters = () => {
    setSearch("");
    setSelectedTones([]);
    setSelectedPaces([]);
    setSelectedStyles([]);
    setSelectedTags([]);
    setSelectedNatures([]);
    setHasEvents(undefined);
  };

  const hasActiveFilters =
    search ||
    selectedTones.length > 0 ||
    selectedPaces.length > 0 ||
    selectedStyles.length > 0 ||
    selectedTags.length > 0 ||
    selectedNatures.length > 0 ||
    hasEvents !== undefined;

  return (
    <>
      {/* Filter Toggle Button */}
      <div className="fixed top-20 right-4 z-40">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-lg flex items-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
            />
          </svg>
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {selectedTones.length +
                selectedPaces.length +
                selectedStyles.length +
                selectedTags.length +
                selectedNatures.length +
                (search ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Overlay */}
      {showFilters && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setShowFilters(false)}
        />
      )}

      {/* Sliding Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          showFilters ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Filters</h3>
              <div className="flex items-center space-x-2">
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Title
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search songs..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Tone Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key ({selectedTones.length} selected)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {SONG_KEYS.map((keyOption) => (
                  <label key={keyOption.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedTones.includes(keyOption.value)}
                      onChange={() => handleToneToggle(keyOption.value)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {keyOption.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pace Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pace ({selectedPaces.length} selected)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {SONG_PACES.map((paceOption) => (
                  <label key={paceOption.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedPaces.includes(paceOption.value)}
                      onChange={() => handlePaceToggle(paceOption.value)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {paceOption.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Style Filter */}
            {filters.styles.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Style ({selectedStyles.length} selected)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {filters.styles.map((style) => (
                    <label key={style} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedStyles.includes(style)}
                        onChange={() => handleStyleToggle(style)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {style}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Tags Filter */}
            {filters.tags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags ({selectedTags.length} selected)
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {filters.tags.map((tag) => (
                    <label key={tag} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => handleTagToggle(tag)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Nature Filter */}
            {filters.natures.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nature ({selectedNatures.length} selected)
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {filters.natures.map((nature) => (
                    <label key={nature} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedNatures.includes(nature)}
                        onChange={() => handleNatureToggle(nature)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {nature}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Events Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Status
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="events"
                    checked={hasEvents === true}
                    onChange={() => setHasEvents(true)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Songs with events only
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="events"
                    checked={hasEvents === false}
                    onChange={() => setHasEvents(false)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Songs without events only
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="events"
                    checked={hasEvents === undefined}
                    onChange={() => setHasEvents(undefined)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">All songs</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
