import React from 'react';
import {
  X,
  Clock,
  Calendar,
  Edit,
  Trash2,
  Copy,
  ArrowRightLeft,
  User,
} from 'lucide-react';
import { Booking, BookingStatus, DanceRoom, RoomId, StudioSettings } from '../types';
import {
  formatDateDisplay,
  formatTimeRange,
  getGenreTheme,
} from '../utils/dateUtils';

interface BookingDetailModalProps {
  booking: Booking | null;
  settings: StudioSettings;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (booking: Booking) => void;
  onDelete: (id: string) => void;
  onDuplicate: (booking: Booking) => void;
  onSwitchRoom?: (booking: Booking) => void;
  onToggleCheckIn?: (booking: Booking) => void;
  onUpdateStatus?: (id: string, status: BookingStatus) => void;
}

const TYPE_LABEL_MAP: Record<string, string> = {
  class: 'Group Class',
  rehearsal: 'Rehearsal',
  private: 'Private Coaching',
  regular: 'Regular Class',
  conditioning: 'Conditioning',
  makeup: 'Make Up Class',
  workshop: 'Regular Class',
  audition: 'Conditioning',
  maintenance: 'Make Up Class',
};

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  booking,
  settings,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onDuplicate,
  onSwitchRoom,
  onToggleCheckIn,
  onUpdateStatus,
}) => {
  if (!isOpen || !booking) return null;

  const room: DanceRoom = settings.rooms[booking.roomId] || {
    id: booking.roomId,
    name: booking.roomId === 'room-1' ? 'UPPER STUDIO' : 'LOWER STUDIO',
    color: booking.roomId === 'room-1' ? 'indigo' : 'emerald',
  };
  const otherRoomId: RoomId = booking.roomId === 'room-1' ? 'room-2' : 'room-1';
  const otherRoom = settings.rooms[otherRoomId] || {
    id: otherRoomId,
    name: otherRoomId === 'room-1' ? 'UPPER STUDIO' : 'LOWER STUDIO',
    color: otherRoomId === 'room-1' ? 'indigo' : 'emerald',
  };
  const genreStyle = getGenreTheme(booking.genre);

  const displayType = TYPE_LABEL_MAP[booking.type] || booking.type;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header with Genre styling */}
        <div className="bg-slate-900 text-white p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${genreStyle.accent} text-white`}>
                {booking.genre}
              </span>
              <span className="text-xs font-medium uppercase bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                {displayType}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">
            {booking.title}
          </h2>

          <div className="flex items-center gap-2 text-xs text-slate-300 mt-2 flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              {formatDateDisplay(booking.date)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              {formatTimeRange(booking.startHour, booking.durationHours, settings.timeFormat)} ({booking.durationHours}h)
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Room Location Card */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`w-3 h-3 rounded-full ${
                  booking.roomId === 'room-1' ? 'bg-indigo-600' : 'bg-emerald-600'
                }`}
              />
              <div>
                <p className="font-bold text-sm text-slate-900">{room.name}</p>
                <p className="text-xs text-slate-500">Reserved Studio Space</p>
              </div>
            </div>

            {onSwitchRoom && (
              <button
                onClick={() => onSwitchRoom(booking)}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs hover:bg-indigo-50 transition-all"
                title={`Move session to ${otherRoom.name}`}
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Move to {otherRoom.name}</span>
              </button>
            )}
          </div>

          {/* Instructor Details */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <User className="w-3 h-3 text-slate-400" /> Instructor
            </span>
            <p className="font-bold text-sm text-slate-900 mt-1">{booking.instructor}</p>
          </div>

          {/* Notes */}
          {booking.notes && (
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Session Notes / Instructions
              </span>
              <p className="text-xs text-slate-800 leading-relaxed">{booking.notes}</p>
            </div>
          )}

          {/* Status Changer */}
          {onUpdateStatus && (
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Session Status
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['confirmed', 'checked-in', 'completed'] as BookingStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => onUpdateStatus(booking.id, st)}
                    className={`py-1.5 text-xs font-semibold rounded-xl border capitalize transition-all ${
                      booking.status === st
                        ? 'bg-slate-900 text-white border-slate-900 shadow-2xs font-bold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {st === 'checked-in' ? 'Checked In' : st}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-5 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() => onDelete(booking.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Cancel Session</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onDuplicate(booking)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-2xs"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Duplicate</span>
            </button>

            <button
              onClick={() => onEdit(booking)}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
