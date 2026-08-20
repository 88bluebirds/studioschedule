import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { DanceGenre, RoomId, StudioSettings } from '../types';
import { getGenreTheme } from '../utils/dateUtils';

interface QuickFiltersProps {
  search: string;
  onSearchChange: (search: string) => void;
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  selectedRoom: string;
  onRoomChange: (room: string) => void;
  settings: StudioSettings;
}

const POPULAR_GENRES: DanceGenre[] = [
  'Ballet',
  'Contemporary',
  'Hip Hop',
  'Jazz',
  'Lyrical',
  'Tap',
  'Creative Movement',
  'Pointe',
  'Tech Class',
  'Make Up Class',
];

export const QuickFilters: React.FC<QuickFiltersProps> = ({
  search,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  selectedRoom,
  onRoomChange,
  settings,
}) => {
  const hasActiveFilters = search || selectedGenre !== 'all' || selectedRoom !== 'all';

  const handleClearFilters = () => {
    onSearchChange('');
    onGenreChange('all');
    onRoomChange('all');
  };

  return (
    <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative w-full md:w-72">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          id="quick-search-input"
          type="text"
          placeholder="Filter by class, instructor, style..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Genre Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
        <button
          onClick={() => onGenreChange('all')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            selectedGenre === 'all'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
          }`}
        >
          All Styles
        </button>

        {POPULAR_GENRES.map((g) => {
          const isSelected = selectedGenre === g;
          const theme = getGenreTheme(g);
          return (
            <button
              key={g}
              onClick={() => onGenreChange(isSelected ? 'all' : g)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                isSelected
                  ? `${theme.accent} text-white shadow-2xs font-bold`
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : theme.accent}`} />
              {g}
            </button>
          );
        })}

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded-lg whitespace-nowrap font-semibold transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
};
