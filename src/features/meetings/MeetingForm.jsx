import React, { useState, useMemo } from 'react';
import Select from 'react-select';
import { Plus, X } from 'lucide-react';

import FormDrawer from '../../components/form/FormDrawer';
import FormSection from '../../components/form/FormSection';
import { FormLabel, FormInput, FormTextarea } from '../../components/form/FormField';
import { getSelectProps } from '../../components/select/selectConfig';

import { useUsers } from '../users/hooks/useUsers';
import { getDisplayName } from '../../utils/name';

const MEETING_TYPES = [
  { value: "Online", label: "Online" },
  { value: "Client Meeting", label: "Client Meeting" },
  { value: "Internal", label: "Internal" },
  { value: "Presentation", label: "Presentation" },
];

function MeetingFormContent({ meeting, users, usersLoading, onSubmit, onClose }) {
  // --- Form Local State ---
  const [title, setTitle] = useState(meeting?.title ?? '');
  const [location, setLocation] = useState(meeting?.location ?? '');
  const [type, setType] = useState(meeting?.type ?? 'Online');
  const [client, setClient] = useState(meeting?.client ?? '');
  const [allDay, setAllDay] = useState(meeting?.allDay ?? false);
  const [startDate, setStartDate] = useState(meeting?.startDate ?? meeting?.date ?? '');
  const [startTime, setStartTime] = useState(meeting?.startTime ?? '');
  const [endDate, setEndDate] = useState(meeting?.endDate ?? '');
  const [endTime, setEndTime] = useState(meeting?.endTime ?? '');
  const [notes, setNotes] = useState(meeting?.notes ?? '');
  const [host, setHost] = useState(meeting?.host ?? '');
  const [participants, setParticipants] = useState(meeting?.participants ?? []);
  const [participantName, setParticipantName] = useState('');
  const [isAddingParticipant, setIsAddingParticipant] = useState(false);

  // --- Memoized Select Options ---
  const hostOptions = useMemo(
    () =>
      users.map((u) => {
        const name = getDisplayName(u, { includeMiddleInitial: true, includeSuffix: true });
        return {
          label: `${name}${u.role ? ` — ${u.role}` : ''}`,
          value: name,
        };
      }),
    [users]
  );

  // --- Participant Handling Actions ---
  const addParticipant = () => {
    const trimmedName = participantName.trim();
    if (!trimmedName) return;
    setParticipants((prev) => [...prev, trimmedName]);
    setParticipantName('');
    setIsAddingParticipant(false);
  };

  const handleParticipantKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      addParticipant();
    }
  };

  const removeParticipant = (index) => {
    setParticipants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !startDate) return;

    onSubmit({
      title,
      date: startDate,
      startDate,
      startTime,
      endDate,
      endTime,
      allDay,
      location,
      type,
      client,
      host,
      participants,
      notes,
    });
    onClose();
  };

  return (
    <form id="meeting-form" onSubmit={handleSubmit} className="flex flex-col h-full min-h-0">
      <div className="flex-1 overflow-y-auto min-h-0 space-y-6 px-1">
        
        {/* Section 1: Meeting Information */}
        <FormSection title="Meeting Information">
          <div className="space-y-4">
            <div>
              <FormLabel required>Meeting Title</FormLabel>
              <FormInput
                type="text"
                required
                value={title}
                placeholder="e.g. Discovery Call & Product Demo"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <FormLabel>Meeting Type</FormLabel>
                <Select
                  {...getSelectProps({ isSearchable: false })}
                  placeholder="Select type..."
                  options={MEETING_TYPES}
                  value={MEETING_TYPES.find((t) => t.value === type) || null}
                  onChange={(opt) => setType(opt?.value || "")}
                />
              </div>
              <div>
                <FormLabel>Client</FormLabel>
                <FormInput
                  type="text"
                  value={client}
                  placeholder="Enter client name..."
                  onChange={(e) => setClient(e.target.value)}
                />
              </div>
            </div>

            <div>
              <FormLabel>Location</FormLabel>
              <FormInput
                type="text"
                value={location}
                placeholder="e.g. Google Meet, Conference Room A"
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
        </FormSection>

        {/* Section 2: Schedule */}
        <FormSection title="Schedule">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FormLabel required>Start Date</FormLabel>
                <FormInput
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <FormLabel>Start Time</FormLabel>
                <FormInput
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  disabled={allDay}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <FormLabel>End Date</FormLabel>
                <FormInput
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div>
                <FormLabel>End Time</FormLabel>
                <FormInput
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  disabled={allDay}
                />
              </div>
            </div>

            <div>
              <FormLabel>Host</FormLabel>
              <Select
                {...getSelectProps({ isClearable: true })}
                placeholder="Select host..."
                options={hostOptions}
                isLoading={usersLoading}
                value={hostOptions.find((h) => h.value === host) || null}
                onChange={(opt) => setHost(opt?.value || "")}
              />
            </div>

            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none w-max">
                <input 
                  type="checkbox" 
                  checked={allDay} 
                  onChange={(e) => setAllDay(e.target.checked)} 
                  className="rounded text-red-500 focus:ring-red-400 h-4 w-4 border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">All Day Event</span>
              </label>
            </div>
          </div>
        </FormSection>

        {/* Section 3: Participants */}
        <FormSection title="Participants">
          <div className="space-y-3">
            {isAddingParticipant ? (
              <div className="flex items-center gap-2 max-w-md animate-in fade-in duration-150">
                <FormInput
                  type="text"
                  autoFocus
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  onKeyDown={handleParticipantKeyDown}
                  placeholder="Enter participant name..."
                />
                <button
                  type="button"
                  onClick={addParticipant}
                  className="h-9 px-4 text-xs font-semibold bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors cursor-pointer shrink-0"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingParticipant(false);
                    setParticipantName('');
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingParticipant(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-dashed border-gray-300 text-gray-600 rounded-md hover:border-gray-400 hover:text-gray-800 transition-all cursor-pointer bg-white"
              >
                <Plus size={14} /> Add Participant
              </button>
            )}

            <div className="flex flex-wrap gap-1.5 pt-1">
              {participants.length > 0 ? (
                participants.map((person, index) => (
                  <span 
                    key={`${person}-${index}`} 
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 pl-3 pr-1 py-1 text-xs font-medium text-gray-600 shadow-sm"
                  >
                    <span className="truncate max-w-45">{person}</span>
                    <button 
                      type="button" 
                      onClick={() => removeParticipant(index)} 
                      className="flex h-4 w-4 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic">No external participants added yet.</p>
              )}
            </div>
          </div>
        </FormSection>

        {/* Section 4: Notes */}
        <FormSection title="Notes">
          <div>
            <FormTextarea
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              placeholder="Add agendas, links, meeting summaries, or context details..."
            />
          </div>
        </FormSection>

      </div>
    </form>
  );
}

export default function MeetingForm({ isOpen, onClose, onSubmit, meeting = null }) {
  const { users = [], loading: usersLoading } = useUsers();

  if (!isOpen) return null;

  const formKey = meeting?.id || meeting?._id || 'new-meeting';

  return (
    <FormDrawer
      open={isOpen}
      title={meeting ? 'Edit Meeting Details' : 'Schedule New Meeting'}
      formId="meeting-form"
      loading={false}
      onClose={onClose}
      onCancel={onClose}
      footer={null} 
    >
      <MeetingFormContent
        key={formKey}
        meeting={meeting}
        users={users}
        usersLoading={usersLoading}
        onSubmit={onSubmit}
        onClose={onClose}
      />
    </FormDrawer>
  );
}