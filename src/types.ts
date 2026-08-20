export type RoomId = 'room-1' | 'room-2';

export interface DanceRoom {
  id: RoomId;
  name: string;
  subtitle?: string;
  color: string;
  capacity?: number;
  flooring?: string;
  features?: string[];
  hourlyRate?: number;
}

export type DanceGenre =
  | 'Ballet'
  | 'Contemporary'
  | 'Hip Hop'
  | 'Jazz'
  | 'Lyrical'
  | 'Tap'
  | 'Creative Movement'
  | 'Pointe'
  | 'Tech Class'
  | 'Private Rental'
  | 'Make Up Class'
  | 'Ballroom'
  | 'K-Pop'
  | 'Latin & Salsa'
  | 'Heels'
  | 'Yoga & Stretch'
  | 'Acro & Gymnastics'
  | 'Maintenance';

export type BookingStatus = 'confirmed' | 'checked-in' | 'in-progress' | 'completed' | 'cancelled';

export type BookingType =
  | 'class'
  | 'rehearsal'
  | 'private'
  | 'regular'
  | 'conditioning'
  | 'makeup'
  | 'workshop'
  | 'audition'
  | 'maintenance';

export type SkillLevel = 'All Levels' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';

export interface Booking {
  id: string;
  title: string;
  roomId: RoomId;
  date: string; // YYYY-MM-DD
  startHour: number; // 0-23, e.g., 8 for 8:00 AM
  durationHours: number; // 1, 2, 3, etc.
  instructor: string;
  instructorEmail?: string;
  instructorPhone?: string;
  genre: DanceGenre;
  level: SkillLevel;
  type: BookingType;
  status: BookingStatus;
  dancersCount?: number;
  maxDancers?: number;
  pricePerPerson?: number;
  rentalFee?: number;
  equipment?: {
    soundSystem?: boolean;
    mirrors?: boolean;
    barres?: boolean;
    mats?: boolean;
    specialLighting?: boolean;
    aerialRig?: boolean;
  };
  notes?: string;
  recurringWeekly?: boolean;
  recurringWeeks?: number;
  colorTag?: string;
  createdAt: string;
}

export interface StudioSettings {
  studioName: string;
  tagline: string;
  startHour: number; // e.g. 8 for 8:00 AM
  endHour: number; // e.g. 22 for 10:00 PM
  timeFormat: '12h' | '24h';
  rooms: {
    'room-1': DanceRoom;
    'room-2': DanceRoom;
  };
}

export type ViewMode = 'dual-day' | 'weekly';

export interface FilterState {
  searchQuery: string;
  roomId: 'all' | RoomId;
  genre: 'all' | DanceGenre;
  status: 'all' | BookingStatus;
  type: 'all' | BookingType;
}

export const STORAGE_KEY_SETTINGS = 'dance_studio_settings_v1';
export const STORAGE_KEY_BOOKINGS = 'dance_studio_bookings_v1';

export const DEFAULT_SETTINGS: StudioSettings = {
  studioName: 'Athabasca Dance',
  tagline: 'Dual Studio Scheduling & Space Management',
  startHour: 8, // 8:00 AM
  endHour: 22, // 10:00 PM (22:00)
  timeFormat: '12h',
  rooms: {
    'room-1': {
      id: 'room-1',
      name: 'UPPER STUDIO',
      color: 'indigo',
    },
    'room-2': {
      id: 'room-2',
      name: 'LOWER STUDIO',
      color: 'emerald',
    },
  },
};

const today = new Date();
const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

export const INITIAL_SAMPLE_BOOKINGS: Booking[] = [
  {
    id: 'b-1',
    title: 'Ballet Technique & Center',
    roomId: 'room-1',
    date: todayStr,
    startHour: 9,
    durationHours: 2,
    instructor: 'Mikhail B.',
    genre: 'Ballet',
    level: 'Advanced',
    type: 'regular',
    status: 'confirmed',
    notes: 'Pointe shoes required for second half.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b-2',
    title: 'Contemporary Flow Lab',
    roomId: 'room-2',
    date: todayStr,
    startHour: 9,
    durationHours: 2,
    instructor: 'Maya Lin',
    genre: 'Contemporary',
    level: 'Intermediate',
    type: 'class',
    status: 'confirmed',
    notes: 'Floorwork sequence; knee pads suggested.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b-3',
    title: 'Commercial Hip Hop Rehearsal',
    roomId: 'room-1',
    date: todayStr,
    startHour: 11,
    durationHours: 2,
    instructor: 'Marcus Vega',
    genre: 'Hip Hop',
    level: 'Advanced',
    type: 'rehearsal',
    status: 'confirmed',
    notes: 'Team competition video rehearsal.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b-4',
    title: 'Private Lyrical Coaching',
    roomId: 'room-2',
    date: todayStr,
    startHour: 12,
    durationHours: 1,
    instructor: 'Elena Rostova',
    genre: 'Lyrical',
    level: 'Professional',
    type: 'private',
    status: 'confirmed',
    notes: 'Solo routine polishing.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b-5',
    title: 'Pointe Variations Workshop',
    roomId: 'room-1',
    date: todayStr,
    startHour: 14,
    durationHours: 2,
    instructor: 'Carlos & Sofia',
    genre: 'Pointe',
    level: 'Intermediate',
    type: 'regular',
    status: 'confirmed',
    notes: 'Classical repertoire study.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b-6',
    title: 'Tap Foundation & Rhythm Drills',
    roomId: 'room-2',
    date: todayStr,
    startHour: 14,
    durationHours: 1,
    instructor: 'Chloe Bennett',
    genre: 'Tap',
    level: 'Beginner',
    type: 'class',
    status: 'confirmed',
    notes: 'Rhythm combinations.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b-7',
    title: 'Conditioning & Core Strength',
    roomId: 'room-2',
    date: todayStr,
    startHour: 15,
    durationHours: 1,
    instructor: 'Claire Dupont',
    genre: 'Ballet',
    level: 'All Levels',
    type: 'conditioning',
    status: 'confirmed',
    notes: 'Dancer core and flexibility drills.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b-8',
    title: 'Creative Movement Performance',
    roomId: 'room-1',
    date: todayStr,
    startHour: 17,
    durationHours: 2,
    instructor: 'Jayden Park',
    genre: 'Creative Movement',
    level: 'Intermediate',
    type: 'class',
    status: 'confirmed',
    notes: 'Filming full group in final 20 minutes.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b-9',
    title: 'Jazz Funk Routine',
    roomId: 'room-2',
    date: todayStr,
    startHour: 18,
    durationHours: 2,
    instructor: 'Zoe Kravitz',
    genre: 'Jazz',
    level: 'Intermediate',
    type: 'regular',
    status: 'confirmed',
    notes: 'Fast paced energetic combo.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'b-10',
    title: 'Make Up Class: Lyrical Express',
    roomId: 'room-1',
    date: todayStr,
    startHour: 19,
    durationHours: 1,
    instructor: 'Elena Rostova',
    genre: 'Lyrical',
    level: 'All Levels',
    type: 'makeup',
    status: 'confirmed',
    notes: 'Make-up session for Tuesday missed class.',
    createdAt: new Date().toISOString(),
  },
];

