import React from 'react';
import {
  Users,
  Volume2,
  Sparkles,
  Layers,
  CheckCircle2,
  Clock,
  Plus,
  AlertCircle,
  MoreVertical,
  Edit2,
  Copy,
  Trash2,
} from 'lucide-react';
import { Booking, DanceRoom, RoomId, StudioSettings } from '../types';
import {
  formatHour,
  formatTimeRange,
  generateHoursArray,
  getTodayDateString,
} from '../utils/dateUtils';

interface DailyDualViewProps {
  selectedDate: string;
  bookings: Booking[];
  settings: StudioSettings;
  onSelectBooking: (booking: Booking) => void;
  onOpenBookingModal: (prefill: { roomId: RoomId; hour: number; date: string }) => void;
  onDeleteBooking: (bookingId: string) => void;
  onDuplicateBooking: (booking: Booking) => void;
  onToggleCheckIn: (booking: Booking) => void;
}

export const DailyDualView: React.FC<DailyDualViewProps> = ({
  selectedDate,
  bookings,
  settings,
  onSelectBooking,
  onOpenBookingModal,
  onDeleteBooking,
  onDuplicateBooking,
  onToggleCheckIn,
}) => {
  const hours = generateHoursArray(settings.startHour, settings.endHour);
  const isToday = selectedDate === getTodayDateString();
  const currentHour = new Date().getHours();

  // Filter bookings for this day
  const dayBookings = bookings.filter((b) => b.date === selectedDate && b.status !== 'cancelled');

  const room1 = settings.rooms['room-1'];
  const room2 = settings.rooms['room-2'];

  // Helper to find booking starting at this specific hour
  const getBookingStartingAt = (roomId: RoomId, hour: number) => {
    return dayBookings.find((b) => b.roomId === roomId && b.startHour === hour);
  };

  // Helper to check if this hour is covered by an ongoing multi-hour booking that started earlier
  const isHourCoveredByPrevious = (roomId: RoomId, hour: number) => {
    return dayBookings.some(
      (b) => b.roomId === roomId && b.startHour < hour && b.startHour + b.durationHours > hour
    );
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
      {/* Studio Room Headers */}
      <div className="grid grid-cols-[70px_1fr_1fr] sm:grid-cols-[100px_1fr_1fr] border-b border-slate-200 shrink-0 bg-white">
        <div className="p-3 sm:p-4 bg-slate-50 border-r border-slate-200 flex items-center justify-center">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
            Time
          </span>
        </div>

        <div className="p-3 sm:p-4 text-center border-r border-slate-200">
          <span className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider block">
            UPPER STUDIO
          </span>
        </div>

        <div className="p-3 sm:p-4 text-center">
          <span className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider block">
            LOWER STUDIO
          </span>
        </div>
      </div>

      {/* Timetable Body (3-Column Grid) */}
      <div className="flex-1 grid grid-cols-[70px_1fr_1fr] sm:grid-cols-[100px_1fr_1fr] divide-x divide-slate-100 overflow-y-auto">
        {/* Time Labels Column */}
        <div className="flex flex-col divide-y divide-slate-100 bg-slate-50/50">
          {hours.map((hour) => {
            const isCurrentSlot = isToday && currentHour === hour;
            return (
              <div
                key={hour}
                className={`h-16 flex items-center justify-center text-xs font-semibold font-mono ${
                  isCurrentSlot ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-400'
                }`}
              >
                {formatHour(hour, settings.timeFormat)}
              </div>
            );
          })}
        </div>

        {/* Room 1 Column */}
        <div className="flex flex-col divide-y divide-slate-100 relative">
          {hours.map((hour) => {
            const booking = getBookingStartingAt('room-1', hour);
            const isCovered = isHourCoveredByPrevious('room-1', hour);

            if (isCovered) {
              return null; // Multi-hour booking height spans down
            }

            return (
              <div
                key={`room-1-${hour}`}
                className={`p-1 transition-colors ${
                  booking && booking.durationHours > 1
                    ? `h-${booking.durationHours * 16}`
                    : 'h-16'
                }`}
                style={
                  booking && booking.durationHours > 1
                    ? { height: `${booking.durationHours * 64}px` }
                    : { height: '64px' }
                }
              >
                {booking ? (
                  <SessionCard
                    booking={booking}
                    room={room1}
                    timeFormat={settings.timeFormat}
                    onSelect={() => onSelectBooking(booking)}
                    onDuplicate={() => onDuplicateBooking(booking)}
                    onDelete={() => onDeleteBooking(booking.id)}
                    onToggleCheckIn={() => onToggleCheckIn(booking)}
                  />
                ) : (
                  <button
                    onClick={() =>
                      onOpenBookingModal({
                        roomId: 'room-1',
                        hour,
                        date: selectedDate,
                      })
                    }
                    className="w-full h-full bg-slate-50 border border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/30 rounded-md flex items-center justify-center text-[10px] text-slate-400 hover:text-indigo-600 transition-colors group cursor-pointer"
                  >
                    <span className="flex items-center gap-1">
                      <Plus className="w-3 h-3 group-hover:scale-110 transition-transform" />
                      <span>Available</span>
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Room 2 Column */}
        <div className="flex flex-col divide-y divide-slate-100 relative">
          {hours.map((hour) => {
            const booking = getBookingStartingAt('room-2', hour);
            const isCovered = isHourCoveredByPrevious('room-2', hour);

            if (isCovered) {
              return null; // Multi-hour booking height spans down
            }

            return (
              <div
                key={`room-2-${hour}`}
                className="p-1 transition-colors"
                style={
                  booking && booking.durationHours > 1
                    ? { height: `${booking.durationHours * 64}px` }
                    : { height: '64px' }
                }
              >
                {booking ? (
                  <SessionCard
                    booking={booking}
                    room={room2}
                    timeFormat={settings.timeFormat}
                    onSelect={() => onSelectBooking(booking)}
                    onDuplicate={() => onDuplicateBooking(booking)}
                    onDelete={() => onDeleteBooking(booking.id)}
                    onToggleCheckIn={() => onToggleCheckIn(booking)}
                  />
                ) : (
                  <button
                    onClick={() =>
                      onOpenBookingModal({
                        roomId: 'room-2',
                        hour,
                        date: selectedDate,
                      })
                    }
                    className="w-full h-full bg-slate-50 border border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/30 rounded-md flex items-center justify-center text-[10px] text-slate-400 hover:text-indigo-600 transition-colors group cursor-pointer"
                  >
                    <span className="flex items-center gap-1">
                      <Plus className="w-3 h-3 group-hover:scale-110 transition-transform" />
                      <span>Available</span>
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* --- Clean Professional Session Card --- */

interface SessionCardProps {
  booking: Booking;
  room: DanceRoom;
  timeFormat: '12h' | '24h';
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleCheckIn: () => void;
}

const SessionCard: React.FC<SessionCardProps> = ({
  booking,
  room,
  timeFormat,
  onSelect,
  onDuplicate,
  onDelete,
  onToggleCheckIn,
}) => {
  // Theme color mapping based on genre / type
  const isMaintenance = booking.genre === 'Maintenance' || booking.type === 'maintenance';
  const isBalletOrBallroom =
    booking.genre === 'Ballet' || booking.genre === 'Ballroom' || booking.genre === 'Yoga & Stretch';
  const isContemporaryOrWorkshop =
    booking.genre === 'Contemporary' || booking.genre === 'Jazz' || booking.genre === 'K-Pop';
  const isPrivateOrRehearsal =
    booking.genre === 'Hip Hop' ||
    booking.genre === 'Tap' ||
    booking.genre === 'Private Rental' ||
    booking.type === 'private' ||
    booking.type === 'rehearsal';

  let cardStyle = {
    container: 'bg-indigo-50 border-indigo-100 hover:border-indigo-200',
    title: 'text-indigo-800',
    sub: 'text-indigo-600',
    dot: 'bg-indigo-500',
  };

  if (isMaintenance) {
    cardStyle = {
      container: 'bg-rose-50 border-rose-100 hover:border-rose-200',
      title: 'text-rose-800',
      sub: 'text-rose-600',
      dot: 'bg-rose-500',
    };
  } else if (isBalletOrBallroom) {
    cardStyle = {
      container: 'bg-emerald-50 border-emerald-100 hover:border-emerald-200',
      title: 'text-emerald-800',
      sub: 'text-emerald-600',
      dot: 'bg-emerald-500',
    };
  } else if (isPrivateOrRehearsal) {
    cardStyle = {
      container: 'bg-amber-50 border-amber-100 hover:border-amber-200',
      title: 'text-amber-800',
      sub: 'text-amber-600',
      dot: 'bg-amber-500',
    };
  }

  const isCheckedIn = booking.status === 'checked-in';
  const isOverCapacity = (booking.dancersCount || 0) > room.capacity;

  return (
    <div
      onClick={onSelect}
      className={`h-full border rounded-md p-2 flex flex-col justify-center cursor-pointer transition-all hover:shadow-xs group select-none relative ${cardStyle.container}`}
    >
      <div className="flex items-center justify-between gap-1 mb-0.5">
        <span className={`text-[11px] font-bold leading-tight truncate ${cardStyle.title}`}>
          {booking.title}
        </span>
        {booking.durationHours > 1 && (
          <span className="text-[9px] font-mono font-bold text-slate-500 bg-white/80 px-1 rounded">
            {booking.durationHours}h
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-1 text-[9px] truncate">
        <span className={`${cardStyle.sub} truncate`}>
          {isMaintenance ? (booking.notes || 'Make Up Class') : `Instructor: ${booking.instructor}`}
        </span>
        <span className="text-slate-500 shrink-0 font-medium font-mono text-[9px]">
          {booking.genre}
        </span>
      </div>

      {/* Floating Quick Action Overlay on hover */}
      <div
        className="absolute top-1 right-1 hidden group-hover:flex items-center gap-1 bg-white/90 backdrop-blur-2xs p-0.5 rounded shadow-2xs border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onToggleCheckIn}
          className={`p-1 rounded transition-colors ${
            isCheckedIn ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-700'
          }`}
          title={isCheckedIn ? 'Checked in' : 'Mark checked in'}
        >
          <CheckCircle2 className="w-3 h-3" />
        </button>
        <button
          onClick={onDuplicate}
          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
          title="Duplicate session"
        >
          <Copy className="w-3 h-3" />
        </button>
        <button
          onClick={onDelete}
          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
          title="Delete booking"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
