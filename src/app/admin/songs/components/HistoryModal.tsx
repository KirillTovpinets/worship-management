"use client";

import { useModalContext } from "../contexts/ModalContext";

// Helper function to format date
const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Helper function to check if event is in the past
const isPastEvent = (date: Date) => {
  return new Date(date) < new Date();
};

export const HistoryModal = () => {
  const { showHistoryModal, viewingSongHistory, closeHistoryModal } =
    useModalContext();

  if (!showHistoryModal || !viewingSongHistory) return null;

  return (
    <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-medium text-gray-900">
              История исполнения - {viewingSongHistory.title}
            </h3>
            <button
              onClick={closeHistoryModal}
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

          <div className="space-y-6">
            {/* Song Info */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-900 mb-2">
                Информация о песне
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Темп:</span>{" "}
                  <span className="ml-2 text-gray-900">
                    {viewingSongHistory.bpm}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Стиль исполнения:
                  </span>{" "}
                  <span className="ml-2 text-gray-900">
                    {viewingSongHistory.style}
                  </span>
                </div>
              </div>
            </div>

            {/* Event History */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">
                История исполнения и расписание
              </h4>
              {viewingSongHistory.events &&
              viewingSongHistory.events.length > 0 ? (
                <>
                  {/* Summary Statistics */}
                  <div className="mb-4 flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-600">
                        Общее количество событий:
                      </span>
                      <span className="bg-gray-200 px-3 py-1 rounded-full text-gray-800">
                        {viewingSongHistory.events.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-600">
                        Прошедшие события:
                      </span>
                      <span className="bg-gray-200 px-3 py-1 rounded-full text-gray-800">
                        {
                          viewingSongHistory.events.filter((e) =>
                            isPastEvent(e.event.date),
                          ).length
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-600">
                        Будущие события:
                      </span>
                      <span className="bg-blue-200 px-3 py-1 rounded-full text-blue-800">
                        {
                          viewingSongHistory.events.filter(
                            (e) => !isPastEvent(e.event.date),
                          ).length
                        }
                      </span>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-3">
                    {viewingSongHistory.events.map((eventSong) => (
                      <div
                        key={eventSong.id}
                        className={`p-4 rounded-lg border ${
                          isPastEvent(eventSong.event.date)
                            ? "bg-gray-50 border-gray-200"
                            : "bg-blue-50 border-blue-200"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h5 className="font-medium text-gray-900">
                                {eventSong.event.title}
                              </h5>
                              {isPastEvent(eventSong.event.date) ? (
                                <span className="px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-600">
                                  Прошедшее
                                </span>
                              ) : (
                                <span className="px-2 py-1 rounded-full text-xs bg-blue-200 text-blue-800">
                                  Запланированное
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              <span className="font-medium">Дата:</span>{" "}
                              {formatDate(eventSong.event.date)}
                              {eventSong.order > 0 && (
                                <span className="ml-4">
                                  <span className="font-medium">Порядок:</span>{" "}
                                  {eventSong.order}
                                </span>
                              )}
                            </div>
                            {eventSong.event.description && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Описание:</span>{" "}
                                {eventSong.event.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Нет запланированных событий
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Эта песня ещё не запланирована ни на одно событие.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={closeHistoryModal}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
