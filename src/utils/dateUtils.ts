import { Booking, DanceRoom, RoomId } from '../types';

export const GENRE_COLORS: Record<string, { bg: string; text: string; border: string; accent: string; dot: string }> = {
  Ballet: {
    bg: 'bg-rose-50 hover:bg-rose-100/90 text-rose-900',
    text: 'text-rose-700',
    border: 'border-rose-200',
    accent: 'bg-rose-500',
    dot: 'bg-rose-400',
  },
  Contemporary: {
    bg: 'bg-indigo-50 hover:bg-indigo-100/90 text-indigo-900',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    accent: 'bg-indigo-500',
    dot: 'bg-indigo-400',
  },
  'Hip Hop': {
    bg: 'bg-amber-50 hover:bg-amber-100/90 text-amber-900',
    text: 'text-amber-700',
    border: 'border-amber-200',
    accent: 'bg-amber-500',
    dot: 'bg-amber-400',
  },
  Jazz: {
    bg: 'bg-violet-50 hover:bg-violet-100/90 text-violet-900',
    text: 'text-violet-700',
    border: 'border-violet-200',
    accent: 'bg-violet-500',
    dot: 'bg-violet-400',
  },
  Lyrical: {
    bg: 'bg-teal-50 hover:bg-teal-100/90 text-teal-900',
    text: 'text-teal-700',
    border: 'border-teal-200',
    accent: 'bg-teal-500',
    dot: 'bg-teal-400',
  },
  Tap: {
    bg: 'bg-orange-50 hover:bg-orange-100/90 text-orange-900',
    text: 'text-orange-700',
    border: 'border-orange-200',
    accent: 'bg-orange-500',
    dot: 'bg-orange-400',
  },
  'Creative Movement': {
    bg: 'bg-fuchsia-50 hover:bg-fuchsia-100/90 text-fuchsia-900',
    text: 'text-fuchsia-700',
    border: 'border-fuchsia-200',
    accent: 'bg-fuchsia-500',
    dot: 'bg-fuchsia-400',
  },
  Pointe: {
    bg: 'bg-sky-50 hover:bg-sky-100/90 text-sky-900',
    text: 'text-sky-700',
    border: 'border-sky-200',
    accent: 'bg-sky-500',
    dot: 'bg-sky-400',
  },
  'Tech Class': {
    bg: 'bg-indigo-50 hover:bg-indigo-100/90 text-indigo-900',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    accent: 'bg-indigo-600',
    dot: 'bg-indigo-500',
  },
  'Private Rental': {
    bg: 'bg-purple-50 hover:bg-purple-100/90 text-purple-900',
    text: 'text-purple-700',
    border: 'border-purple-200',
    accent: 'bg-purple-500',
    dot: 'bg-purple-400',
  },
  'Make Up Class': {
    bg: 'bg-emerald-50 hover:bg-emerald-100/90 text-emerald-900',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    accent: 'bg-emerald-500',
    dot: 'bg-emerald-400',
  },
  Ballroom: {
    bg: 'bg-teal-50 hover:bg-teal-100/90 text-teal-900',
    text: 'text-teal-700',
    border: 'border-teal-200',
    accent: 'bg-teal-500',
    dot: 'bg-teal-400',
  },
  'K-Pop': {
    bg: 'bg-fuchsia-50 hover:bg-fuchsia-100/90 text-fuchsia-900',
    text: 'text-fuchsia-700',
    border: 'border-fuchsia-200',
    accent: 'bg-fuchsia-500',
    dot: 'bg-fuchsia-400',
  },
  'Latin & Salsa': {
    bg: 'bg-red-50 hover:bg-red-100/90 text-red-900',
    text: 'text-red-700',
    border: 'border-red-200',
    accent: 'bg-red-500',
    dot: 'bg-red-400',
  },
  Maintenance: {
    bg: 'bg-stone-100 hover:bg-stone-200/90 text-stone-800',
    text: 'text-stone-600',
    border: 'border-stone-300',
    accent: 'bg-stone-500',
    dot: 'bg-stone-400',
  },
};

export const getGenreTheme = (genre: string) => {
  return (
    GENRE_COLORS[genre] || {
      bg: 'bg-slate-50 hover:bg-slate-100 text-slate-900',
      text: 'text-slate-700',
      border: 'border-slate-200',
      accent: 'bg-slate-500',
      dot: 'bg-slate-400',
    }
  );
};

export function formatHour(hour: number, format: '12h' | '24h' = '12h'): string {
  if (format === '24h') {
    return `${hour.toString().padStart(2, '0')}:00`;
  }
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:00 ${period}`;
}

export function formatTimeRange(startHour: number, durationHours: number, format: '12h' | '24h' = '12h'): string {
  const endHour = startHour + durationHours;
  return `${formatHour(startHour, format)} – ${formatHour(endHour, format)}`;
}

export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateDisplay(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatShortDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'numeric',
    day: 'numeric',
  });
}

export function addDays(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getWeekDays(dateStr: string): string[] {
  const [year, month, day] = dateStr.split('-').map(Number);
  const current = new Date(year, month - 1, day);
  const dayOfWeek = current.getDay(); // 0 is Sunday
  // Let week start on Monday (index 1)
  const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(current);
  monday.setDate(current.getDate() + distanceToMonday);

  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dayNum = String(d.getDate()).padStart(2, '0');
    days.push(`${y}-${m}-${dayNum}`);
  }
  return days;
}

export function checkBookingConflict(
  existingBookings: Booking[],
  candidate: {
    id?: string;
    roomId: RoomId;
    date: string;
    startHour: number;
    durationHours: number;
  }
): { hasConflict: boolean; conflictingBooking?: Booking } {
  const candidateEnd = candidate.startHour + candidate.durationHours;

  for (const b of existingBookings) {
    // Skip self when editing
    if (candidate.id && b.id === candidate.id) continue;
    // Skip canceled bookings
    if (b.status === 'cancelled') continue;

    if (b.roomId === candidate.roomId && b.date === candidate.date) {
      const bEnd = b.startHour + b.durationHours;
      // Overlap condition: startA < endB and endA > startB
      if (candidate.startHour < bEnd && candidateEnd > b.startHour) {
        return { hasConflict: true, conflictingBooking: b };
      }
    }
  }

  return { hasConflict: false };
}

/**
 * Check every occurrence of a weekly series (week 1 = candidate.date).
 * Returns the first clash, with the date of the occurrence that clashed.
 */
export function checkSeriesConflict(
  existingBookings: Booking[],
  candidate: {
    id?: string;
    roomId: RoomId;
    date: string;
    startHour: number;
    durationHours: number;
  },
  weeks: number
): { hasConflict: boolean; conflictingBooking?: Booking; conflictDate?: string } {
  const total = Math.max(1, weeks);
  for (let i = 0; i < total; i++) {
    const date = i === 0 ? candidate.date : addDays(candidate.date, i * 7);
    const result = checkBookingConflict(existingBookings, { ...candidate, date });
    if (result.hasConflict) {
      return { ...result, conflictDate: date };
    }
  }
  return { hasConflict: false };
}

/** Longest booking (in whole hours, capped at maxHours) that still ends by closing time. */
export function getMaxDurationHours(startHour: number, endHour: number, maxHours = 5): number {
  return Math.max(0, Math.min(maxHours, endHour - startHour));
}

/** Short random suffix for generated booking ids. */
export function randomIdSuffix(): string {
  return Math.random().toString(36).slice(2, 6);
}

export function generateHoursArray(startHour: number, endHour: number): number[] {
  const hours: number[] = [];
  for (let h = startHour; h <= endHour; h++) {
    hours.push(h);
  }
  return hours;
}
