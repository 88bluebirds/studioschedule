import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  AlertTriangle,
  CheckCircle,
  Repeat,
  Lock,
  Unlock,
} from 'lucide-react';
import { Booking, DanceGenre, RoomId, BookingType, StudioSettings } from '../types';
import {
  checkSeriesConflict,
  formatDateDisplay,
  formatHour,
  formatTimeRange,
  generateHoursArray,
  getGenreTheme,
  getMaxDurationHours,
  getTodayDateString,
  randomIdSuffix,
} from '../utils/dateUtils';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (booking: Booking, recurringWeeks?: number) => void;
  existingBookings: Booking[];
  settings: StudioSettings;
  initialData?: Partial<Booking> | null;
}

const GENRES: DanceGenre[] = [
  'Ballet',
  'Contemporary',
  'Hip Hop',
  'Jazz',
  'Lyrical',
  'Tap',
  'Creative Movement',
  'Pointe',
  'Tech Class',
  'Private Rental',
  'Make Up Class',
];

const TYPES: { value: BookingType; label: string }[] = [
  { value: 'class', label: 'Group Class' },
  { value: 'rehearsal', label: 'Rehearsal' },
  { value: 'private', label: 'Private Coaching' },
  { value: 'regular', label: 'Regular Class' },
  { value: 'conditioning', label: 'Conditioning' },
  { value: 'makeup', label: 'Make Up Class' },
];

// Set VITE_BOOKING_PASSWORD in your environment (e.g. .env.local). It is not stored in the repo.
// Note: this is a deterrent only; anything in a Vite env var still ships in the browser bundle.
const REQUIRED_PASSWORD: string = import.meta.env.VITE_BOOKING_PASSWORD ?? '';
const IS_PASSWORD_CONFIGURED = REQUIRED_PASSWORD.length > 0;

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingBookings,
  settings,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [roomId, setRoomId] = useState<RoomId>('room-1');
  const [date, setDate] = useState('');
  const [startHour, setStartHour] = useState<number>(settings.startHour);
  const [durationHours, setDurationHours] = useState<number>(1);
  const [instructor, setInstructor] = useState('');
  const [genre, setGenre] = useState<DanceGenre>('Contemporary');
  const [type, setType] = useState<BookingType>('class');
  const [notes, setNotes] = useState('');
  const [password, setPassword] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringWeeks, setRecurringWeeks] = useState(4);

  // Sync state when initialData changes
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setRoomId(initialData.roomId || 'room-1');
      setDate(initialData.date || getTodayDateString());
      setStartHour(initialData.startHour !== undefined ? initialData.startHour : settings.startHour);
      setDurationHours(initialData.durationHours || 1);
      setInstructor(initialData.instructor || '');
      setGenre(initialData.genre || 'Contemporary');
      setType(initialData.type || 'class');
      setNotes(initialData.notes || '');
      setPassword('');
      setIsRecurring(false);
    }
  }, [initialData, settings]);

  if (!isOpen) return null;

  // Check conflicts — for a new weekly series, every week is checked, not just the first.
  const seriesWeeks = isRecurring && !initialData?.id ? recurringWeeks : 1;
  const conflict = checkSeriesConflict(
    existingBookings,
    {
      id: initialData?.id,
      roomId,
      date,
      startHour,
      durationHours,
    },
    seriesWeeks
  );
  const conflictIsLaterWeek = !!conflict.conflictDate && conflict.conflictDate !== date;

  // Bookings must finish by closing time.
  const maxDuration = getMaxDurationHours(startHour, settings.endHour);
  const durationOptions = Array.from({ length: maxDuration }, (_, i) => i + 1);
  const exceedsClosing = startHour + durationHours > settings.endHour;

  const isPasswordValid = IS_PASSWORD_CONFIGURED && password === REQUIRED_PASSWORD;
  const isSubmitDisabled = conflict.hasConflict || exceedsClosing || !date || !isPasswordValid;

  const selectedRoom = settings.rooms[roomId];
  const hours = generateHoursArray(settings.startHour, settings.endHour - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitDisabled) {
      return;
    }

    const newBooking: Booking = {
      id: initialData?.id || `booking-${Date.now()}-${randomIdSuffix()}`,
      title: title.trim() || `${genre} Session`,
      roomId,
      date,
      startHour: Number(startHour),
      durationHours: Number(durationHours),
      instructor: instructor.trim() || 'Staff Instructor',
      genre,
      level: initialData?.level || 'All Levels',
      type,
      status: initialData?.status || 'confirmed',
      notes: notes.trim(),
      createdAt: initialData?.createdAt || new Date().toISOString(),
    };

    onSave(newBooking, isRecurring ? recurringWeeks : undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center ring-1 ring-indigo-500/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                {initialData?.id ? 'Edit Dance Session' : 'Schedule Dance Room Slot'}
              </h2>
              <p className="text-xs text-slate-400">
                Book timesheet slot in UPPER STUDIO or LOWER STUDIO
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conflict Warning Banner */}
        {conflict.hasConflict && conflict.conflictingBooking && (
          <div className="bg-rose-50 border-b border-rose-200 p-3.5 flex items-start gap-3 text-xs text-rose-900">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Booking Conflict Detected!</p>
              <p className="mt-0.5">
                {selectedRoom?.name || roomId} already has{' '}
                <strong>"{conflict.conflictingBooking.title}"</strong> ({conflict.conflictingBooking.instructor})
                {conflictIsLaterWeek && conflict.conflictDate && (
                  <> on <strong>{formatDateDisplay(conflict.conflictDate)}</strong> (a later week of this series)</>
                )}{' '}
                scheduled from{' '}
                {formatTimeRange(
                  conflict.conflictingBooking.startHour,
                  conflict.conflictingBooking.durationHours,
                  settings.timeFormat
                )}. Please choose a different hour or studio room.
              </p>
            </div>
          </div>
        )}

        {/* Closing Time Warning Banner */}
        {exceedsClosing && (
          <div className="bg-amber-50 border-b border-amber-200 p-3.5 flex items-start gap-3 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              This session would run past closing time ({formatHour(settings.endHour, settings.timeFormat)}).
              Please choose a shorter duration or an earlier start.
            </p>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Room Selector Cards */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Select Dance Studio Room *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(['room-1', 'room-2'] as RoomId[]).map((rId) => {
                const r = settings.rooms[rId];
                const isSelected = roomId === rId;
                return (
                  <button
                    type="button"
                    key={rId}
                    onClick={() => setRoomId(rId)}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all text-left w-full ${
                      isSelected
                        ? rId === 'room-1'
                          ? 'border-indigo-600 bg-indigo-50/60 shadow-xs ring-1 ring-indigo-500/20'
                          : 'border-emerald-600 bg-emerald-50/60 shadow-xs ring-1 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-3 h-3 rounded-full ${
                            rId === 'room-1' ? 'bg-indigo-600' : 'bg-emerald-600'
                          }`}
                        />
                        <h4 className="font-bold text-sm text-slate-900">{r?.name || (rId === 'room-1' ? 'UPPER STUDIO' : 'LOWER STUDIO')}</h4>
                      </div>
                      {isSelected && (
                        <CheckCircle
                          className={`w-4 h-4 ${
                            rId === 'room-1' ? 'text-indigo-600' : 'text-emerald-600'
                          }`}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label htmlFor="session-title-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Class / Session Title *
              </label>
              <input
                id="session-title-input"
                type="text"
                required
                placeholder="e.g. Lyrical Repertoire, Tech Class"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label htmlFor="session-type-select" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Booking Type
              </label>
              <select
                id="session-type-select"
                value={type}
                onChange={(e) => setType(e.target.value as BookingType)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date, Start Hour, Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="session-date-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Date *
              </label>
              <input
                id="session-date-input"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label htmlFor="session-starthour-select" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Start Time Block *
              </label>
              <select
                id="session-starthour-select"
                value={startHour}
                onChange={(e) => {
                  const newStart = Number(e.target.value);
                  setStartHour(newStart);
                  // Keep the duration within closing time for the new start.
                  const newMax = getMaxDurationHours(newStart, settings.endHour);
                  setDurationHours((d) => Math.max(1, Math.min(d, newMax)));
                }}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 font-mono"
              >
                {hours.map((h) => (
                  <option key={h} value={h}>
                    {formatHour(h, settings.timeFormat)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="session-duration-select" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Duration (Hours)
              </label>
              <select
                id="session-duration-select"
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 font-mono"
              >
                {durationOptions.map((d) => (
                  <option key={d} value={d}>
                    {d} {d === 1 ? 'Hour' : 'Hours'} ({formatTimeRange(startHour, d, settings.timeFormat)})
                  </option>
                ))}
                {exceedsClosing && (
                  <option value={durationHours} disabled>
                    {durationHours} Hours (past closing)
                  </option>
                )}
              </select>
            </div>
          </div>

          {/* Dance Genre Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Dance Style / Genre *
            </label>
            <div className="flex flex-wrap gap-1.5">
              {GENRES.map((g) => {
                const isSelected = genre === g;
                const style = getGenreTheme(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGenre(g)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? `${style.accent} text-white shadow-2xs font-bold ring-2 ring-indigo-500/20`
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-white' : style.accent
                      }`}
                    />
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Instructor Field */}
          <div>
            <label htmlFor="session-instructor-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Instructor Name *
            </label>
            <input
              id="session-instructor-input"
              type="text"
              required
              placeholder="e.g. Elena Rostova"
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="session-notes-textarea" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Session Notes / Rehearsal Instructions
            </label>
            <textarea
              id="session-notes-textarea"
              rows={2}
              placeholder="e.g. Center work rehearsal, tech drills, choreography review..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Password Spot */}
          <div className={`p-4 rounded-xl border transition-all ${
            isPasswordValid
              ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400/30'
              : 'bg-slate-50 border-slate-300'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="booking-password-input" className="block text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                {isPasswordValid ? (
                  <Unlock className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-600" />
                )}
                <span>Authorization Password *</span>
              </label>
              {isPasswordValid ? (
                <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Password Verified
                </span>
              ) : (
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Required
                </span>
              )}
            </div>

            <div className="relative">
              <input
                id="booking-password-input"
                type="password"
                placeholder={
                  IS_PASSWORD_CONFIGURED
                    ? 'Enter authorization password...'
                    : 'Booking password not configured (set VITE_BOOKING_PASSWORD)'
                }
                disabled={!IS_PASSWORD_CONFIGURED}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-white focus:ring-2 transition-all font-mono ${
                  isPasswordValid
                    ? 'border-emerald-400 focus:ring-emerald-500/20 text-emerald-950'
                    : password
                    ? 'border-slate-400 focus:ring-indigo-500/20 text-slate-900'
                    : 'border-slate-300 focus:ring-indigo-500/20 text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Weekly Recurrence Toggle (for new bookings) */}
          {!initialData?.id && (
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Repeat className="w-4 h-4 text-indigo-600" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Repeat weekly?</p>
                  <p className="text-[11px] text-slate-500">
                    Automatically book this time block every week
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="recurring-checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="rounded text-indigo-600 w-4 h-4"
                />
                {isRecurring && (
                  <select
                    value={recurringWeeks}
                    onChange={(e) => setRecurringWeeks(Number(e.target.value))}
                    className="text-xs bg-white border border-slate-300 rounded-lg px-2 py-1"
                  >
                    <option value={4}>For 4 weeks</option>
                    <option value={8}>For 8 weeks</option>
                    <option value={12}>For 12 weeks</option>
                  </select>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <div className="text-[11px] text-slate-500">
              {!isPasswordValid && (
                <span className="text-slate-500 flex items-center gap-1 font-medium">
                  <Lock className="w-3 h-3 shrink-0" /> Password required to confirm
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                id="confirm-booking-submit-btn"
                type="submit"
                disabled={isSubmitDisabled}
                title={
                  !isSubmitDisabled
                    ? 'Confirm and save booking'
                    : !isPasswordValid
                    ? 'Enter authorization password to enable'
                    : exceedsClosing
                    ? 'Session runs past closing time'
                    : !date
                    ? 'Choose a date'
                    : 'Time slot has conflicts'
                }
                className={`px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all flex items-center gap-2 ${
                  isSubmitDisabled
                    ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed opacity-80 shadow-none'
                    : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white cursor-pointer ring-2 ring-indigo-600/20'
                }`}
              >
                {isSubmitDisabled && !isPasswordValid ? (
                  <Lock className="w-4 h-4 text-slate-400" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                <span>{initialData?.id ? 'Update Session' : 'Confirm Booking'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
