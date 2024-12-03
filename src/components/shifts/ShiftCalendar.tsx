import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, addDays } from 'date-fns';
import type { CareShift } from '../../types/care';

interface ShiftCalendarProps {
  shifts: CareShift[];
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

export const ShiftCalendar: React.FC<ShiftCalendarProps> = ({
  shifts,
  onDateSelect,
  selectedDate
}) => {
  const startDate = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  const getShiftsForDate = (date: Date) => {
    return shifts.filter(shift => shift.date === format(date, 'yyyy-MM-dd'));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-secondary-900">
          {format(selectedDate, 'MMMM yyyy')}
        </h3>
        <div className="flex gap-2">
          <button className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-secondary-600 py-2">
            {day}
          </div>
        ))}

        {weekDays.map((date) => {
          const dayShifts = getShiftsForDate(date);
          const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');

          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateSelect(date)}
              className={`
                p-2 rounded-lg text-sm relative
                ${isSelected ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50'}
              `}
            >
              <span className="font-medium">{format(date, 'd')}</span>
              {dayShifts.length > 0 && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};