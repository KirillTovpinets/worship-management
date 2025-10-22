interface DatePickerProps {
  tempYear: number;
  setTempYear: (year: number) => void;
  tempMonth: number;
  setTempMonth: (month: number) => void;
  setShowDatePicker: (show: boolean) => void;
  handleDatePickerSubmit: () => void;
}

export default function DatePicker({
  tempYear,
  setTempYear,
  tempMonth,
  setTempMonth,
  setShowDatePicker,
  handleDatePickerSubmit,
}: DatePickerProps) {
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
  return (
    <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-72">
      <h3 className="text-sm font-medium text-gray-900 mb-3">
        Выберите месяц и год
      </h3>
      <div className="space-y-3">
        {/* Year Selector */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Год
          </label>
          <select
            value={tempYear}
            onChange={(e) => setTempYear(parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
          >
            {Array.from({ length: 30 }, (_, i) => {
              const year = new Date().getFullYear() - 20 + i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>

        {/* Month Selector */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Месяц
          </label>
          <select
            value={tempMonth}
            onChange={(e) => setTempMonth(parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
          >
            {monthNames.map((month, index) => (
              <option key={index + 1} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={() => setShowDatePicker(false)}
          className="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
        >
          Отмена
        </button>
        <button
          type="button"
          onClick={handleDatePickerSubmit}
          className="px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
        >
          Применить
        </button>
      </div>
    </div>
  );
}
