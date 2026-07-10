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

// const MOCK_MEETINGS = [
//   {
//     id: 1,
//     title: 'ABC Corporation Consultation',
//     type: 'Client Consultation',
//     date: '2026-07-17',
//     time: '10:00 AM - 11:30 AM',
//     location: 'Conference Room A',
//     organizer: 'John Doe (Sales Manager)',
//     client: 'ABC Corporation',
//     color: 'bg-blue-50 text-blue-600 border-blue-200',
//     notes: 'Discuss project requirements, quotation details, and expected timeline for the upcoming campaign.',
//     participants: ['John Doe', 'Jane Smith', 'Michael Cruz', 'Sarah Santos', 'Kevin Reyes'],
//   },
// ];

const getMeetingColor = (type = "") => {
  switch (type.trim().toLowerCase()) {
    case "client consultation":
      return "bg-blue-50 text-blue-600 border-blue-200";

    case "client meeting":
      return "bg-blue-50 text-blue-600 border-blue-200";

    case "internal meeting":
      return "bg-green-50 text-green-600 border-green-200";

    case "presentation":
      return "bg-purple-50 text-purple-600 border-purple-200";

    case "training":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";

    case "online":
      return "bg-cyan-50 text-cyan-600 border-cyan-200";

    case "sales meeting":
      return "bg-orange-50 text-orange-600 border-orange-200";

    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
};

export function useMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
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
      startTime: meetingData.startTime,
      endTime: meetingData.endTime,
      allDay: meetingData.allDay || false,
      type: meetingData.type,
      client: meetingData.client,
      time:
        meetingData.startTime && meetingData.endTime
          ? `${meetingData.startTime} - ${meetingData.endTime}`
          : meetingData.time,
      location: meetingData.location,
      locationScope: meetingData.locationScope,
      organizer: meetingData.host || meetingData.organizer,
      color: getMeetingColor(meetingData.type),
      notes: meetingData.notes,
      participants: meetingData.participants,
    };

    if (meetingToEdit) {
      setMeetings((prev) => prev.map((meeting) => (meeting.id === meetingToEdit.id ? payload : meeting)));
      setSelectedMeeting(payload);
      Toast.fire({ icon: 'success', title: 'Meeting updated successfully' });
    } else {
      setMeetings((prev) => [payload, ...prev]);
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