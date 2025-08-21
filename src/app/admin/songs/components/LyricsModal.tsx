"use client";

import { useModalContext } from "../contexts/ModalContext";

export const LyricsModal = () => {
  const { showLyricsModal, viewingLyrics, closeLyricsModal } =
    useModalContext();

  if (!showLyricsModal) return null;

  return (
    <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-medium text-gray-900">Текст песни</h3>
            <button
              onClick={closeLyricsModal}
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
          <div className="bg-gray-50 p-4 rounded-md">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
              {viewingLyrics}
            </pre>
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={closeLyricsModal}
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
