"use client";

import { useModalContext } from "../contexts/ModalContext";
import { useImportSongs } from "../hooks/useImportSongs";

export const ImportModal = () => {
  const { showImportModal, closeImportModal } = useModalContext();
  const {
    importFile,
    importResults,
    isImporting,
    handleDownloadTemplate,
    handleFileChange,
    handleImportSongs,
    resetImport,
  } = useImportSongs();

  if (!showImportModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleImportSongs();
  };

  const handleClose = () => {
    resetImport();
    closeImportModal();
  };

  return (
    <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-medium text-gray-900">
              Импорт песен из Excel
            </h3>
            <button
              onClick={handleClose}
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
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="font-medium text-blue-900 mb-2">Инструкции:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>
                  • Скачайте шаблон ниже, чтобы увидеть необходимый формат
                </li>
                <li>• Заполните данные песни в соответствии с шаблоном</li>
                <li>• Загрузите Excel файл (.xlsx, .xls) или CSV файл</li>
                <li>• Песни с одинаковыми названиями будут пропущены</li>
                <li>• Все обязательные поля должны быть заполнены</li>
              </ul>
            </div>

            {/* Template Download */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleDownloadTemplate}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Скачать шаблон
              </button>
              <span className="text-sm text-gray-600">
                Скачайте пример Excel шаблона с правильным форматом
              </span>
            </div>

            {/* File Upload */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Загрузить Excel файл
                  </label>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  {importFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Выбранный файл: {importFile.name}
                    </p>
                  )}
                </div>

                {/* Expected Columns Info */}
                {importResults?.expectedColumns && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <h4 className="font-medium text-yellow-900 mb-2">
                      Ожидаемые колонки:
                    </h4>
                    <div className="text-sm text-yellow-800">
                      {Object.entries(importResults.expectedColumns).map(
                        ([key, values]) => (
                          <div key={key} className="mb-1">
                            <span className="font-medium">{key}:</span>{" "}
                            {Array.isArray(values)
                              ? values.join(", ")
                              : String(values)}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Import Results */}
                {importResults && !importResults.expectedColumns && (
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Результаты импорта:
                    </h4>
                    <div className="text-sm text-gray-700 space-y-1">
                      <div>
                        Общее количество строк: {importResults.totalRows}
                      </div>
                      <div className="text-green-600">
                        Успешно импортировано: {importResults.success}
                      </div>
                      <div className="text-yellow-600">
                        Пропущено (дубликаты): {importResults.skipped}
                      </div>
                      {importResults.errors &&
                        importResults.errors.length > 0 && (
                          <div className="text-red-600">
                            Ошибки: {importResults.errors.length}
                          </div>
                        )}
                    </div>

                    {/* Error Details */}
                    {importResults.errors &&
                      importResults.errors.length > 0 && (
                        <div className="mt-3">
                          <h5 className="font-medium text-red-900 mb-2">
                            Детали ошибки:
                          </h5>
                          <div className="max-h-40 overflow-y-auto bg-red-50 border border-red-200 rounded-md p-3">
                            {importResults.errors.map(
                              (error: string, index: number) => (
                                <div
                                  key={index}
                                  className="text-sm text-red-800 mb-1"
                                >
                                  {error}
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={!importFile || isImporting}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    {isImporting ? "Импорт..." : "Импорт песен"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
