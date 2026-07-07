import { useState, useMemo } from 'react';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  width: 'auto',
});

const MOCK_MEETINGS = [
  {
    id: 1,
    title: 'ABC Corporation Consultation',
    type: 'Client Consultation',
    date: '2025-09-02',
    time: '10:00 AM - 11:30 AM',
    location: 'Conference Room A',
    organizer: 'John Doe (Sales Manager)',
    client: 'ABC Corporation',
    color: 'bg-blue-50 text-blue-600 border-blue-200',
    notes: 'Discuss project requirements, quotation details, and expected timeline for the upcoming campaign.',
    participants: ['John Doe', 'Jane Smith', 'Michael Cruz', 'Sarah Santos', 'Kevin Reyes'],
  },
];

export function useMeetings() {
  const [meetings, setMeetings] = useState(MOCK_MEETINGS);
  const [selectedMeeting, setSelectedMeeting] = useState(MOCK_MEETINGS[0]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [meetingToEdit, setMeetingToEdit] = useState(null);
  const [activeView, setActiveView] = useState('Month');
  const [filterPreset, setFilterPreset] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredMeetings = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return meetings.filter((meeting) => {
      const matchesSearch =
        !query ||
        meeting.title.toLowerCase().includes(query) ||
        meeting.client.toLowerCase().includes(query) ||
        meeting.type.toLowerCase().includes(query);

      const meetingDate = new Date(meeting.date);
      const today = new Date();
      const isUpcoming = meetingDate >= new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isCompleted = meetingDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());

      const matchesFilter =
        filterPreset === 'all' ||
        (filterPreset === 'upcoming' && isUpcoming) ||
        (filterPreset === 'completed' && isCompleted) ||
        (filterPreset === 'cancelled' && meeting.type.toLowerCase().includes('cancel'));

      return matchesSearch && matchesFilter;
    });
  }, [meetings, searchQuery, filterPreset]);

  const openCreateMeeting = () => {
    setMeetingToEdit(null);
    setIsFormOpen(true);
  };

  const openEditMeeting = (meeting) => {
    setMeetingToEdit(meeting);
    setIsFormOpen(true);
  };

  const closeMeetingForm = () => {
    setIsFormOpen(false);
    setMeetingToEdit(null);
  };

  const handleAddMeeting = (meetingData) => {
    const payload = {
      id: meetingToEdit?.id ?? Date.now(),
      title: meetingData.title,
      date: meetingData.date,
      startDate: meetingData.startDate,
      startTime: meetingData.startTime,
      endDate: meetingData.endDate,
      endTime: meetingData.endTime,
      allDay: meetingData.allDay || false,
      type: meetingData.type,
      client: meetingData.client,
      time:
        (meetingData.startTime && meetingData.endTime && `${meetingData.startTime} - ${meetingData.endTime}`) ||
        meetingData.time ||
        '12:00 PM - 1:00 PM',
      location: meetingData.location || 'Main Office',
      organizer: meetingData.host || meetingData.organizer || 'John Doe',
      color: meetingData.color || 'bg-blue-50 text-blue-600 border-blue-200',
      notes: meetingData.notes || 'Prepared for backend integration',
      participants: meetingData.participants || ['John Doe'],
    };

    if (meetingToEdit) {
      setMeetings((prev) => prev.map((meeting) => (meeting.id === meetingToEdit.id ? payload : meeting)));
      setSelectedMeeting(payload);
      Toast.fire({ icon: 'success', title: 'Meeting updated successfully' });
    } else {
      setMeetings((prev) => [payload, ...prev]);
      setSelectedMeeting(payload);
      Toast.fire({ icon: 'success', title: 'Meeting added successfully' });
    }
  };

  const handleDeleteMeeting = (meetingId) => {
    setMeetings((prev) => prev.filter((meeting) => meeting.id !== meetingId));
    setSelectedMeeting(null);
    Toast.fire({ icon: 'success', title: 'Meeting deleted successfully' });
  };

  const stats = useMemo(() => {
    const today = new Date();
    const upcoming = meetings.filter((meeting) => new Date(meeting.date) >= new Date(today.getFullYear(), today.getMonth(), today.getDate())).length;
    const completed = meetings.filter((meeting) => new Date(meeting.date) < new Date(today.getFullYear(), today.getMonth(), today.getDate())).length;
    const cancelled = meetings.filter((meeting) => meeting.type.toLowerCase().includes('cancel')).length;

    return {
      total: meetings.length,
      upcoming,
      completed,
      cancelled,
    };
  }, [meetings]);

  return {
    meetings: filteredMeetings,
    selectedMeeting,
    setSelectedMeeting,
    currentMonth,
    setCurrentMonth,
    searchQuery,
    setSearchQuery,
    isFormOpen,
    setIsFormOpen,
    meetingToEdit,
    activeView,
    setActiveView,
    filterPreset,
    setFilterPreset,
    isFilterOpen,
    setIsFilterOpen,
    openCreateMeeting,
    openEditMeeting,
    closeMeetingForm,
    handleAddMeeting,
    handleDeleteMeeting,
    stats,
  };
}