import React from 'react';
import { Building2, CalendarDays, Clock3, MapPin, Trash2, UserRound, Users } from 'lucide-react';

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatDateTime = (date, time) => {
  if (!date) return '—';
  const formattedDate = formatDate(date);
  return time ? `${formattedDate} · ${time}` : formattedDate;
};

const splitTimeRange = (timeRange, index) => {
  if (!timeRange) return '—';
  const parts = timeRange.split(' - ').map((part) => part.trim());
  return parts[index] || '—';
};

export default function MeetingDetails({ meeting, onClose, onEdit, onDelete }) {
  if (!meeting) {
    return (
      <div className="flex min-h-90 items-center justify-center rounded-md border border-gray-200 bg-white p-6 text-sm text-gray-400 shadow-sm">
        Select a meeting to view its details.
      </div>
    );
  }

  const details = [
    {
      icon: <Building2 size={14} />,
      label: 'Meeting Venue',
      value: meeting.venue || meeting.client || 'Client location',
    },
    {
      icon: <MapPin size={14} />,
      label: 'Location',
      value: meeting.location || 'Enter location...',
    },
    {
      icon: <CalendarDays size={14} />,
      label: 'All day',
      value: meeting.allDay ? 'Yes' : 'No',
    },
    {
      icon: <CalendarDays size={14} />,
      label: 'From',
      value: meeting.startDate
        ? formatDateTime(meeting.startDate, meeting.startTime)
        : formatDate(meeting.date) + (meeting.time ? ` · ${splitTimeRange(meeting.time, 0)}` : ''),
    },
    {
      icon: <Clock3 size={14} />,
      label: 'To',
      value: meeting.endDate
        ? formatDateTime(meeting.endDate, meeting.endTime)
        : meeting.time
        ? splitTimeRange(meeting.time, 1)
        : '—',
    },
    {
      icon: <UserRound size={14} />,
      label: 'Host',
      value: meeting.organizer,
    },
  ];

  return (
    <div className="flex h-full flex-col overflow-y-auto rounded-md border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-600">
          {meeting.type}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-xl font-light text-gray-400 transition-colors hover:text-gray-600"
        >
          ×
        </button>
      </div>

      <h3 className="mt-4 text-sm font-semibold text-gray-800">{meeting.title}</h3>

      <div className="mt-5 grid gap-4 text-sm text-gray-600">
        {details.map((item) => (
          <div key={item.label} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-gray-500">
              <div>{item.icon}</div>
              <p className="text-[11px] uppercase tracking-wide text-gray-400">{item.label}</p>
            </div>
            <p className="mt-2 text-sm font-medium text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center gap-2">
          <Users size={14} className="text-gray-400" />
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Participants ({meeting.participants?.length || 0})
          </h4>
        </div>
        <div className="space-y-2">
          {meeting.participants?.map((person, index) => (
            <div key={`${person}-${index}`} className="flex items-center gap-2 rounded-md bg-gray-50 px-2.5 py-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-gray-600 shadow-sm">
                {person.split(' ').map((n) => n[0]).join('')}
              </div>
              <span className="text-sm text-gray-700">{person}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-md border border-gray-100 bg-gray-50 p-3">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Notes</h4>
        <p className="mt-1 text-sm leading-relaxed text-gray-600">{meeting.notes}</p>
      </div>

      <div className="mt-6 flex gap-2 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={onEdit}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
}