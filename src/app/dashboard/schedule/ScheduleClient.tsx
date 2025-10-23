"use client";

import DatePicker from "@/app/dashboard/schedule/datePicker";
import { Event, EventSong, Song } from "@prisma/client";
import { toZonedTime } from "date-fns-tz";
import { CalendarIcon, PencilIcon, TrashIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface ScheduleClientProps {
  events: (Event & {
    songs: (EventSong & {
      song: Song;
    })[];
  })[];
  songs: Song[];
  currentYear: number;
  currentMonth: number;
}

const belarusTimezone = "Europe/Minsk";

export default function ScheduleClient({
  events,
  songs,
  currentYear,
  currentMonth,
}: ScheduleClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [tempYear, setTempYear] = useState(currentYear);
  const [tempMonth, setTempMonth] = useState(currentMonth);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    selectedSongs: [] as string[],
  });

  // State for song ordering
  const [songOrder, setSongOrder] = useState<
    Array<{ id: string; title: string }>
  >([]);

  // Filter states
  const [songFilters, setSongFilters] = useState({
    tags: "",
    styles: "",
    nature: "",
  });

  // Get unique filter options from songs
  const uniqueTags = Array.from(
    new Set(
      songs
        .flatMap((song) => song.tags.split("/").map((tag) => tag.trim()))
        .filter((tag) => tag.length > 0),
    ),
  ).sort();

  const uniqueStyles = Array.from(
    new Set(
      songs.map((song) => song.style).filter((style) => style.length > 0),
    ),
  ).sort();

  const uniqueNatures = Array.from(
    new Set(
      songs.map((song) => song.nature).filter((nature) => nature.length > 0),
    ),
  ).sort();

  // Filter songs based on selected filters
  const filteredSongs = songs.filter((song) => {
    const matchesTags =
      !songFilters.tags ||
      song.tags.toLowerCase().includes(songFilters.tags.toLowerCase());
    const matchesStyles =
      !songFilters.styles ||
      song.style.toLowerCase().includes(songFilters.styles.toLowerCase());
    const matchesNature =
      !songFilters.nature ||
      song.nature.toLowerCase().includes(songFilters.nature.toLowerCase());

    return matchesTags && matchesStyles && matchesNature;
  });

  // Generate calendar data
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth, 0);
  const startDate = new Date(firstDayOfMonth);

  // Adjust to start on Monday (getDay: 0=Sunday, 1=Monday, etc.)
  // If Sunday (0), go back 6 days; if Monday (1), go back 0 days, etc.
  const dayOffset = (firstDayOfMonth.getDay() + 6) % 7;
  startDate.setDate(startDate.getDate() - dayOffset);

  const calendarDays = [];
  const currentDate = new Date(startDate);

  // Continue until we complete the week (end on Sunday, then stop on Monday)
  while (currentDate <= lastDayOfMonth || currentDate.getDay() !== 1) {
    calendarDays.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  // Handle click outside to close date picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
    };

    if (showDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDatePicker]);

  const navigateMonth = (direction: "prev" | "next") => {
    let newYear = currentYear;
    let newMonth = currentMonth;

    if (direction === "prev") {
      if (currentMonth === 1) {
        newMonth = 12;
        newYear = currentYear - 1;
      } else {
        newMonth = currentMonth - 1;
      }
    } else {
      if (currentMonth === 12) {
        newMonth = 1;
        newYear = currentYear + 1;
      } else {
        newMonth = currentMonth + 1;
      }
    }

    const params = new URLSearchParams(searchParams);
    params.set("year", newYear.toString());
    params.set("month", newMonth.toString());
    router.push(`/dashboard/schedule?${params.toString()}`);
  };

  const openDatePicker = () => {
    setTempYear(currentYear);
    setTempMonth(currentMonth);
    setShowDatePicker(true);
  };

  const handleDatePickerSubmit = () => {
    const params = new URLSearchParams(searchParams);
    params.set("year", tempYear.toString());
    params.set("month", tempMonth.toString());
    router.push(`/dashboard/schedule?${params.toString()}`);
    setShowDatePicker(false);
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = toZonedTime(new Date(event.date), belarusTimezone);
      return (
        eventDate.toDateString() ===
        toZonedTime(date, belarusTimezone).toDateString()
      );
    });
  };

  const openEventModal = (date: Date) => {
    setSelectedDate(date);
    setIsEditMode(false);
    setEditingEvent(null);
    setEventForm({
      title: "",
      description: "",
      selectedSongs: [],
    });
    setSongOrder([]);
    setSongFilters({
      tags: "",
      styles: "",
      nature: "",
    });
    setShowEventModal(true);
  };

  const openEditModal = (
    event: Event & { songs: (EventSong & { song: Song })[] },
  ) => {
    setSelectedDate(new Date(event.date));
    setIsEditMode(true);
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description || "",
      selectedSongs: event.songs.map((es) => es.songId),
    });
    setSongOrder(
      event.songs.map((es) => ({ id: es.songId, title: es.song.title })),
    );
    setSongFilters({
      tags: "",
      styles: "",
      nature: "",
    });
    setShowEventModal(true);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !eventForm.title) return;

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: eventForm.title,
          description: eventForm.description,
          date: selectedDate,
          songIds: songOrder.map((song) => song.id),
        }),
      });

      if (response.ok) {
        setShowEventModal(false);
        router.refresh();
      } else {
        console.error("Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleEditEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !selectedDate || !eventForm.title) return;

    try {
      const response = await fetch(`/api/events/${editingEvent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: eventForm.title,
          description: eventForm.description,
          date: selectedDate.toISOString(),
          songIds: songOrder.map((song) => song.id),
        }),
      });

      if (response.ok) {
        setShowEventModal(false);
        setIsEditMode(false);
        setEditingEvent(null);
        router.refresh();
      } else {
        console.error("Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        console.error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            {/* Calendar Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-4 justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => navigateMonth("prev")}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <div className="relative" ref={datePickerRef}>
                    <button
                      onClick={openDatePicker}
                      className="flex items-center gap-2 text-2xl font-semibold text-gray-900 hover:text-indigo-600 transition-colors cursor-pointer group"
                    >
                      {monthNames[currentMonth - 1]} {currentYear}
                      <CalendarIcon className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                    </button>

                    {/* Date Picker Tooltip */}
                    {showDatePicker && (
                      <DatePicker
                        tempYear={tempYear}
                        setTempYear={setTempYear}
                        tempMonth={tempMonth}
                        setTempMonth={setTempMonth}
                        setShowDatePicker={setShowDatePicker}
                        handleDatePickerSubmit={handleDatePickerSubmit}
                      />
                    )}
                  </div>
                  <button
                    onClick={() => navigateMonth("next")}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={() => openEventModal(new Date())}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Добавить событие
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-gray-500 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, index) => {
                  const isCurrentMonth = date.getMonth() === currentMonth - 1;
                  const isToday =
                    date.toDateString() === new Date().toDateString();
                  const dayEvents = getEventsForDate(date);

                  return (
                    <div
                      key={index}
                      className={`min-h-[120px] p-2 border border-gray-200 ${
                        isCurrentMonth ? "bg-white" : "bg-gray-50"
                      } ${isToday ? "ring-2 ring-indigo-500" : ""}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-sm font-medium ${
                            isCurrentMonth ? "text-gray-900" : "text-gray-400"
                          } ${isToday ? "text-indigo-600" : ""}`}
                        >
                          {date.getDate()}
                        </span>
                        {isCurrentMonth && (
                          <button
                            onClick={() => openEventModal(date)}
                            className="text-gray-400 hover:text-gray-600 text-xs"
                          >
                            +
                          </button>
                        )}
                      </div>

                      {/* Event Indicators */}
                      {dayEvents.length > 0 && (
                        <div className="space-y-1">
                          {dayEvents.slice(0, 3).map((event) => (
                            <div
                              key={event.id}
                              className="text-xs bg-indigo-100 text-indigo-800 px-1 py-0.5 rounded truncate cursor-pointer hover:bg-indigo-200 flex items-center justify-between group"
                              title={`${event.title} (${event.songs.length} songs) - Нажмите для редактирования`}
                            >
                              <span
                                className="truncate cursor-pointer flex-1"
                                onClick={() => openEditModal(event)}
                              >
                                {event.title}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditModal(event);
                                }}
                                className="ml-1 opacity-0 group-hover:opacity-100 text-indigo-600 hover:text-indigo-800 transition-opacity flex-shrink-0"
                                title="Редактировать событие"
                              >
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </button>
                            </div>
                          ))}
                          {dayEvents.length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{dayEvents.length - 3} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Event List Section */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                События для {monthNames[currentMonth - 1]} {currentYear}
              </h2>
            </div>
            <div className="p-6">
              {events.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Нет событий, запланированных на этот месяц.
                </p>
              ) : (
                <div className="space-y-4">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {event.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {toZonedTime(
                              event.date,
                              belarusTimezone,
                            ).toLocaleDateString("ru-RU", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openEditModal(event)}
                            className="text-indigo-600 hover:text-indigo-800 text-sm"
                          >
                            <PencilIcon className="w-4 h-4" />
                            <span className="sr-only">Редактировать</span>
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            <TrashIcon className="w-4 h-4" />
                            <span className="sr-only">Удалить</span>
                          </button>
                        </div>
                      </div>
                      {event.description && (
                        <p className="text-gray-600 mb-3">
                          {event.description}
                        </p>
                      )}
                      {event.songs.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Песни ({event.songs.length})
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {event.songs.map((eventSong, index) => (
                              <span
                                key={eventSong.id}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 cursor-pointer hover:bg-green-200"
                                onClick={() =>
                                  router.push(
                                    `/dashboard/songs/${eventSong.songId}`,
                                  )
                                }
                              >
                                {index + 1}. {eventSong.song.title}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Event Modal */}
      {showEventModal && selectedDate && (
        <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-gray-900">
                  {isEditMode ? "Редактировать событие" : "Создать событие"} для{" "}
                  {selectedDate.toLocaleDateString()}
                </h3>
                <button
                  onClick={() => {
                    setShowEventModal(false);
                    setIsEditMode(false);
                    setEditingEvent(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
              <form onSubmit={isEditMode ? handleEditEvent : handleCreateEvent}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Название события *
                    </label>
                    <input
                      type="text"
                      required
                      value={eventForm.title}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, title: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Описание
                    </label>
                    <textarea
                      value={eventForm.description}
                      onChange={(e) =>
                        setEventForm({
                          ...eventForm,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Выберите песни
                    </label>

                    {/* Filter Controls */}
                    <div className="mb-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Фильтровать по тегам
                          </label>
                          <select
                            value={songFilters.tags}
                            onChange={(e) =>
                              setSongFilters({
                                ...songFilters,
                                tags: e.target.value,
                              })
                            }
                            className="block w-full text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="">Все теги</option>
                            {uniqueTags.map((tag) => (
                              <option key={tag} value={tag}>
                                {tag}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Фильтровать по стилю
                          </label>
                          <select
                            value={songFilters.styles}
                            onChange={(e) =>
                              setSongFilters({
                                ...songFilters,
                                styles: e.target.value,
                              })
                            }
                            className="block w-full text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="">Все стили</option>
                            {uniqueStyles.map((style) => (
                              <option key={style} value={style}>
                                {style}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Фильтровать по характеру
                          </label>
                          <select
                            value={songFilters.nature}
                            onChange={(e) =>
                              setSongFilters({
                                ...songFilters,
                                nature: e.target.value,
                              })
                            }
                            className="block w-full text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="">Все характеры</option>
                            {uniqueNatures.map((nature) => (
                              <option key={nature} value={nature}>
                                {nature}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Clear Filters Button */}
                      {(songFilters.tags ||
                        songFilters.styles ||
                        songFilters.nature) && (
                        <div>
                          <button
                            type="button"
                            onClick={() =>
                              setSongFilters({
                                tags: "",
                                styles: "",
                                nature: "",
                              })
                            }
                            className="text-xs text-indigo-600 hover:text-indigo-800 underline"
                          >
                            Очистить все фильтры
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Song List */}
                    <div className="mt-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md p-2">
                      {filteredSongs.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">
                          Нет песен, соответствующих выбранным фильтрам.
                        </p>
                      ) : (
                        filteredSongs.map((song) => (
                          <label
                            key={song.id}
                            className="flex items-center space-x-2 py-1 hover:bg-gray-50 rounded px-1"
                          >
                            <input
                              type="checkbox"
                              checked={eventForm.selectedSongs.includes(
                                song.id,
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  const newSelectedSongs = [
                                    ...eventForm.selectedSongs,
                                    song.id,
                                  ];
                                  setEventForm({
                                    ...eventForm,
                                    selectedSongs: newSelectedSongs,
                                  });
                                  // Add to song order
                                  setSongOrder([
                                    ...songOrder,
                                    { id: song.id, title: song.title },
                                  ]);
                                } else {
                                  const newSelectedSongs =
                                    eventForm.selectedSongs.filter(
                                      (id) => id !== song.id,
                                    );
                                  setEventForm({
                                    ...eventForm,
                                    selectedSongs: newSelectedSongs,
                                  });
                                  // Remove from song order
                                  setSongOrder(
                                    songOrder.filter(
                                      (item) => item.id !== song.id,
                                    ),
                                  );
                                }
                              }}
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-sm text-gray-700 block truncate">
                                {song.title}
                              </span>
                              <span className="text-xs text-gray-500 block truncate">
                                {song.style} • {song.nature}
                              </span>
                            </div>
                          </label>
                        ))
                      )}
                    </div>

                    {/* Selected Songs Count */}
                    {eventForm.selectedSongs.length > 0 && (
                      <div className="mt-2 text-xs text-gray-600">
                        {eventForm.selectedSongs.length} песни выбраны
                      </div>
                    )}
                  </div>

                  {/* Song Order Section */}
                  {songOrder.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Порядок песен (перетащите для изменения)
                      </label>
                      <div className="border border-gray-300 rounded-md p-3 bg-gray-50">
                        {songOrder.map((song, index) => (
                          <div
                            key={song.id}
                            className="flex items-center justify-between py-2 px-3 bg-white rounded border mb-2 last:mb-0"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex flex-col items-center justify-center w-6 h-6 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                                {index + 1}
                              </div>
                              <span className="text-sm text-gray-700">
                                {song.title}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => {
                                  if (index > 0) {
                                    const newOrder = [...songOrder];
                                    [newOrder[index], newOrder[index - 1]] = [
                                      newOrder[index - 1],
                                      newOrder[index],
                                    ];
                                    setSongOrder(newOrder);
                                  }
                                }}
                                disabled={index === 0}
                                className={`p-1 rounded ${
                                  index === 0
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                                }`}
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 15l7-7 7 7"
                                  />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (index < songOrder.length - 1) {
                                    const newOrder = [...songOrder];
                                    [newOrder[index], newOrder[index + 1]] = [
                                      newOrder[index + 1],
                                      newOrder[index],
                                    ];
                                    setSongOrder(newOrder);
                                  }
                                }}
                                disabled={index === songOrder.length - 1}
                                className={`p-1 rounded ${
                                  index === songOrder.length - 1
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                                }`}
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSongOrder(
                                    songOrder.filter((_, i) => i !== index),
                                  );
                                  setEventForm({
                                    ...eventForm,
                                    selectedSongs:
                                      eventForm.selectedSongs.filter(
                                        (id) => id !== song.id,
                                      ),
                                  });
                                }}
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEventModal(false);
                      setIsEditMode(false);
                      setEditingEvent(null);
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    {isEditMode ? "Обновить событие" : "Создать событие"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
