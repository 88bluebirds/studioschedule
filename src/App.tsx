import React, { useState, useEffect } from 'react';
import { Booking, RoomId, StudioSettings, ViewMode } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DailyDualView } from './components/DailyDualView';
import { WeeklyGridView } from './components/WeeklyGridView';
import { QuickFilters } from './components/QuickFilters';
import { BookingModal } from './components/BookingModal';
import { BookingDetailModal } from './components/BookingDetailModal';
import { SettingsModal } from './components/SettingsModal';
import { PrintScheduleModal } from './components/PrintScheduleModal';
import { ExportBackupModal } from './components/ExportBackupModal';
import {
  DEFAULT_SETTINGS,
  INITIAL_SAMPLE_BOOKINGS,
  STORAGE_KEY_BOOKINGS,
  STORAGE_KEY_SETTINGS,
} from './types';
import {
  addDays,
  checkBookingConflict,
  getTodayDateString,
  randomIdSuffix,
} from './utils/dateUtils';

export function App() {
  // Settings & Bookings state with LocalStorage persistence
  const [settings, setSettings] = useState<StudioSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          studioName:
            !parsed.studioName || parsed.studioName.includes('RhythmCore')
              ? 'Athabasca Dance'
              : parsed.studioName,
          // Keep the saved hours; only fall back to defaults when missing or invalid.
          startHour:
            typeof parsed.startHour === 'number' && parsed.startHour >= 0 && parsed.startHour <= 23
              ? parsed.startHour
              : DEFAULT_SETTINGS.startHour,
          endHour:
            typeof parsed.endHour === 'number' && parsed.endHour > 0 && parsed.endHour <= 24
              ? parsed.endHour
              : DEFAULT_SETTINGS.endHour,
          // Keep saved room names (set in Settings); defaults only fill gaps.
          rooms: {
            'room-1': {
              ...DEFAULT_SETTINGS.rooms['room-1'],
              ...(parsed.rooms?.['room-1'] || {}),
              name: parsed.rooms?.['room-1']?.name?.trim() || DEFAULT_SETTINGS.rooms['room-1'].name,
            },
            'room-2': {
              ...DEFAULT_SETTINGS.rooms['room-2'],
              ...(parsed.rooms?.['room-2'] || {}),
              name: parsed.rooms?.['room-2']?.name?.trim() || DEFAULT_SETTINGS.rooms['room-2'].name,
            },
          },
        };
      }
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKINGS);
      return saved ? JSON.parse(saved) : INITIAL_SAMPLE_BOOKINGS;
    } catch {
      return INITIAL_SAMPLE_BOOKINGS;
    }
  });

  // Selected date & View mode
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [viewMode, setViewMode] = useState<ViewMode>('dual-day');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Filters (for Daily view)
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedGenreFilter, setSelectedGenreFilter] = useState<string>('all');
  const [selectedRoomFilter, setSelectedRoomFilter] = useState<string>('all');

  // Modals state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingModalInitialData, setBookingModalInitialData] = useState<Partial<Booking> | null>(null);

  const [selectedBookingForDetail, setSelectedBookingForDetail] = useState<Booking | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (err) {
      console.error('Failed to save studio settings to localStorage', err);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
    } catch (err) {
      console.error('Failed to save bookings to localStorage', err);
    }
  }, [bookings]);

  // Handler for creating / updating bookings
  const handleSaveBooking = (bookingData: Booking, recurringWeeks?: number) => {
    if (recurringWeeks && recurringWeeks > 1) {
      // Generate series of recurring bookings for N weeks
      const newSeries: Booking[] = [bookingData];
      for (let i = 1; i < recurringWeeks; i++) {
        const nextDate = addDays(bookingData.date, i * 7);
        newSeries.push({
          ...bookingData,
          id: `booking-${Date.now()}-${i}-${randomIdSuffix()}`,
          date: nextDate,
          notes: bookingData.notes
            ? `${bookingData.notes} (Recurrence ${i + 1}/${recurringWeeks})`
            : `Recurrence ${i + 1}/${recurringWeeks}`,
        });
      }

      setBookings((prev) => {
        const filtered = prev.filter((b) => b.id !== bookingData.id);
        return [...filtered, ...newSeries];
      });
    } else {
      setBookings((prev) => {
        const exists = prev.some((b) => b.id === bookingData.id);
        if (exists) {
          return prev.map((b) => (b.id === bookingData.id ? bookingData : b));
        } else {
          return [...prev, bookingData];
        }
      });
    }
  };

  // Handler for deleting a booking
  const handleDeleteBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    if (selectedBookingForDetail?.id === bookingId) {
      setSelectedBookingForDetail(null);
    }
  };

  // Handler for duplicating a booking.
  // Opens the booking form prefilled with a copy (no id), so the user picks a free slot and
  // the normal conflict check runs — saving a copy in the same slot would always clash.
  const handleDuplicateBooking = (booking: Booking) => {
    const { id: _id, createdAt: _createdAt, ...rest } = booking;
    setBookingModalInitialData({
      ...rest,
      title: `${booking.title} (Copy)`,
      status: 'confirmed',
    });
    setIsBookingModalOpen(true);
  };

  // Handler for toggling checked-in status
  const handleToggleCheckIn = (booking: Booking) => {
    const newStatus = booking.status === 'checked-in' ? 'confirmed' : 'checked-in';
    setBookings((prev) =>
      prev.map((b) => (b.id === booking.id ? { ...b, status: newStatus } : b))
    );
    if (selectedBookingForDetail?.id === booking.id) {
      setSelectedBookingForDetail({ ...selectedBookingForDetail, status: newStatus });
    }
  };

  // Handler for switching room
  const handleSwitchRoom = (booking: Booking) => {
    const newRoomId: RoomId = booking.roomId === 'room-1' ? 'room-2' : 'room-1';
    const conflict = checkBookingConflict(bookings, { ...booking, roomId: newRoomId });
    if (conflict.hasConflict && conflict.conflictingBooking) {
      const roomName = settings.rooms[newRoomId]?.name || newRoomId;
      window.alert(
        `Can't move this session: ${roomName} already has "${conflict.conflictingBooking.title}" at that time.`
      );
      return;
    }
    setBookings((prev) =>
      prev.map((b) => (b.id === booking.id ? { ...b, roomId: newRoomId } : b))
    );
    if (selectedBookingForDetail?.id === booking.id) {
      setSelectedBookingForDetail({ ...selectedBookingForDetail, roomId: newRoomId });
    }
  };

  // Open booking modal with optional prefilled slot
  const handleOpenBookingModal = (prefill?: {
    roomId?: RoomId;
    hour?: number;
    date?: string;
  }) => {
    if (prefill) {
      setBookingModalInitialData({
        roomId: prefill.roomId || 'room-1',
        startHour: prefill.hour !== undefined ? prefill.hour : settings.startHour,
        date: prefill.date || selectedDate,
        durationHours: 1,
      });
    } else {
      setBookingModalInitialData({
        roomId: 'room-1',
        startHour: settings.startHour,
        date: selectedDate,
        durationHours: 1,
      });
    }
    setIsBookingModalOpen(true);
  };

  // Filtered bookings for daily views
  const filteredBookings = bookings.filter((b) => {
    if (selectedRoomFilter !== 'all' && b.roomId !== selectedRoomFilter) return false;
    if (selectedGenreFilter !== 'all' && b.genre !== selectedGenreFilter) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchesTitle = b.title.toLowerCase().includes(q);
      const matchesInst = b.instructor.toLowerCase().includes(q);
      const matchesGenre = b.genre.toLowerCase().includes(q);
      return matchesTitle || matchesInst || matchesGenre;
    }
    return true;
  });

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Athabasca Dance Sidebar */}
      <Sidebar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        settings={settings}
        bookings={bookings}
        selectedDate={selectedDate}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenPrint={() => setIsPrintModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenBookingModal={() => handleOpenBookingModal()}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Execution Column */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <Header
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          settings={settings}
          onOpenBookingModal={handleOpenBookingModal}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onOpenPrint={() => setIsPrintModalOpen(true)}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Viewport Canvas Stage */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-50 flex flex-col">
          {viewMode === 'dual-day' ? (
            <div className="h-full flex flex-col space-y-3">
              <QuickFilters
                search={searchFilter}
                onSearchChange={setSearchFilter}
                selectedGenre={selectedGenreFilter}
                onGenreChange={setSelectedGenreFilter}
                selectedRoom={selectedRoomFilter}
                onRoomChange={setSelectedRoomFilter}
                settings={settings}
              />
              <div className="flex-1 min-h-0">
                <DailyDualView
                  selectedDate={selectedDate}
                  bookings={filteredBookings}
                  settings={settings}
                  onSelectBooking={(b) => setSelectedBookingForDetail(b)}
                  onOpenBookingModal={handleOpenBookingModal}
                  onDeleteBooking={handleDeleteBooking}
                  onDuplicateBooking={handleDuplicateBooking}
                  onToggleCheckIn={handleToggleCheckIn}
                />
              </div>
            </div>
          ) : (
            <div className="h-full">
              <WeeklyGridView
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                bookings={bookings}
                settings={settings}
                onSelectBooking={(b) => setSelectedBookingForDetail(b)}
                onOpenBookingModal={handleOpenBookingModal}
              />
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <footer className="h-10 bg-white border-t border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 text-[10px] text-slate-400 font-medium select-none">
          <div className="flex items-center gap-3 sm:gap-5 overflow-x-auto">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span> UPPER STUDIO
            </span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span> LOWER STUDIO
            </span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span> Operating: 8:00 AM – 10:00 PM
            </span>
          </div>
          <div className="hidden sm:block text-slate-400 font-mono">
            Instructor & Executive Timesheet Scheduler
          </div>
        </footer>
      </main>

      {/* Modals & Dialogs */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setBookingModalInitialData(null);
        }}
        onSave={handleSaveBooking}
        existingBookings={bookings}
        settings={settings}
        initialData={bookingModalInitialData}
      />

      <BookingDetailModal
        isOpen={!!selectedBookingForDetail}
        onClose={() => setSelectedBookingForDetail(null)}
        booking={selectedBookingForDetail}
        settings={settings}
        onEdit={(b) => {
          setSelectedBookingForDetail(null);
          setBookingModalInitialData(b);
          setIsBookingModalOpen(true);
        }}
        onDelete={(id) => {
          handleDeleteBooking(id);
        }}
        onDuplicate={(b) => {
          handleDuplicateBooking(b);
          setSelectedBookingForDetail(null);
        }}
        onSwitchRoom={handleSwitchRoom}
        onToggleCheckIn={(b) => handleToggleCheckIn(b)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={(newSettings) => setSettings(newSettings)}
        onResetSampleData={() => {
          setBookings(INITIAL_SAMPLE_BOOKINGS);
          setSettings(DEFAULT_SETTINGS);
        }}
        onClearAllData={() => {
          setBookings([]);
        }}
      />

      <PrintScheduleModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        bookings={bookings}
        selectedDate={selectedDate}
        settings={settings}
      />

      <ExportBackupModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        bookings={bookings}
        settings={settings}
        onImportBookings={(imported) => setBookings(imported)}
      />
    </div>
  );
}

export default App;
