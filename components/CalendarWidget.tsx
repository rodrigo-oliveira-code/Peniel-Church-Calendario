import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarWidgetProps {
  title: string;
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  renderCell: (date: Date, isCurrentMonth: boolean) => React.ReactNode;
  headerColorClass?: string;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  title,
  currentDate,
  onPrevMonth,
  onNextMonth,
  renderCell,
  headerColorClass = 'text-slate-800'
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday

  // Generate grid array
  const blanks = Array(firstDayOfMonth).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalSlots = [...blanks, ...days];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <h2 className={`text-lg font-bold ${headerColorClass} capitalize`}>
          {title} - {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-1">
          <button onClick={onPrevMonth} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500">
            <ChevronLeft size={20} />
          </button>
          <button onClick={onNextMonth} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
          <div key={d} className="p-2 text-center text-xs font-semibold text-slate-500">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-fr">
        {totalSlots.map((day, index) => {
          if (day === null) {
            return <div key={`blank-${index}`} className="min-h-[80px] border-b border-r border-slate-50 bg-slate-50/20"></div>;
          }

          const cellDate = new Date(year, month, day);
          return (
            <div key={day} className="min-h-[80px] border-b border-r border-slate-100 relative p-1">
              <span className={`text-xs font-medium w-5 h-5 flex items-center justify-center rounded-full mb-1 ${
                new Date().toDateString() === cellDate.toDateString() ? 'bg-blue-600 text-white' : 'text-slate-400'
              }`}>
                {day}
              </span>
              <div className="space-y-1">
                {renderCell(cellDate, true)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};