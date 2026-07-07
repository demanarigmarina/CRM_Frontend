import React from 'react';
import { getDaysInMonth } from './utils/calendarUtils';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function MeetingCalendar({ currentMonth, meetings, onSelectMeeting, activeMeetingId, activeView = 'Month' }) {
  const calendarCells = getDaysInMonth(currentMonth);

  const getDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };

  const getMeetingsForDate = (date) => meetings.filter((meeting) => meeting.date === getDateKey(date));

  const renderMeetingCard = (meeting) => {
    const accentClass = meeting.color.includes('red')
      ? 'bg-red-500'
      : meeting.color.includes('purple')
        ? 'bg-purple-500'
        : meeting.color.includes('green')
          ? 'bg-green-500'
          : 'bg-blue-500';

    return (
      <button
        key={meeting.id}
        type="button"
        onClick={() => onSelectMeeting(meeting)}
        className={`flex w-full items-start gap-1.5 rounded-md border px-2 py-1.5 text-left text-[11px] transition-colors hover:brightness-95 ${meeting.color} ${
          activeMeetingId === meeting.id ? 'ring-2 ring-red-200' : ''
        }`}
      >
        <span className={`mt-0.5 h-7 w-1.5 shrink-0 rounded-full ${accentClass}`} />
        <span className="min-w-0">
          <div className="truncate font-semibold">{meeting.time}</div>
          <div className="truncate">{meeting.title}</div>
        </span>
      </button>
    );
  };

  if (activeView === 'Day') {
    const dayMeetings = getMeetingsForDate(currentMonth);

    return (
      <div className="h-full overflow-auto bg-white p-4">
        <div className="mb-4 rounded-md border border-gray-100 bg-gray-50 px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Day view</p>
          <p className="text-sm font-semibold text-gray-700">
            {currentMonth.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="space-y-2">
          {dayMeetings.length > 0 ? (
            dayMeetings.map((meeting) => renderMeetingCard(meeting))
          ) : (
            <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 p-3 text-sm text-gray-500">
              No meetings for this day.
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeView === 'Week') {
    const startOfWeek = new Date(currentMonth);
    startOfWeek.setDate(currentMonth.getDate() - currentMonth.getDay());

    const weekDays = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + index);
      return day;
    });

    return (
      <div className="h-full overflow-auto bg-white p-4">
        <div className="mb-3 grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const dayMeetings = getMeetingsForDate(day);
            return (
              <div key={day.toISOString()} className="rounded-md border border-gray-100 bg-gray-50 p-2">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <p className="text-sm font-semibold text-gray-700">{day.getDate()}</p>
                <div className="mt-2 space-y-1">
                  {dayMeetings.length > 0 ? (
                    dayMeetings.slice(0, 2).map((meeting) => renderMeetingCard(meeting))
                  ) : (
                    <p className="text-[10px] text-gray-400">No events</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-white">
      <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/70 py-2 text-center">
        {WEEKDAYS.map((day) => (
          <span key={day} className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            {day}
          </span>
        ))}
      </div>

      <div className="grid min-h-180 grid-cols-7 grid-rows-6">
        {calendarCells.map((cell, idx) => {
          const dateStr = getDateKey(cell.date);
          const dayMeetings = meetings.filter((m) => m.date === dateStr);

          return (
            <div
              key={idx}
              className={`flex min-h-30 flex-col gap-1 border-r border-b border-gray-100 p-2 ${
                cell.isCurrentMonth ? 'bg-white' : 'bg-gray-50/70 text-gray-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-semibold ${cell.isCurrentMonth ? 'text-gray-600' : 'text-gray-400'}`}>
                  {cell.date.getDate()}
                </span>
                {dayMeetings.length > 0 && (
                  <span className="text-[10px] text-gray-400">{dayMeetings.length}</span>
                )}
              </div>

              <div className="flex-1 space-y-1 overflow-y-auto">
                {dayMeetings.map((meeting) => renderMeetingCard(meeting))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}