import React, { useState, useEffect } from 'react';
import {
  X,
  Settings as SettingsIcon,
  Clock,
  Building,
  RotateCcw,
  Save,
  Trash2,
  CheckCircle2,
  Lock,
  Unlock,
  CheckCircle,
} from 'lucide-react';
import { StudioSettings } from '../types';
import { formatHour } from '../utils/dateUtils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StudioSettings;
  onSaveSettings: (newSettings: StudioSettings) => void;
  onResetSampleData: () => void;
  onClearAllData: () => void;
}

const REQUIRED_ADMIN_PASSWORD = 'Admin1234';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onResetSampleData,
  onClearAllData,
}) => {
  const [formData, setFormData] = useState<StudioSettings>(settings);
  const [password, setPassword] = useState('');
  const [showSavedToast, setShowSavedToast] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(settings);
      setPassword('');
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const isPasswordValid = password === REQUIRED_ADMIN_PASSWORD;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return;

    onSaveSettings(formData);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center ring-1 ring-indigo-500/30">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">Studio Timesheet Configuration</h2>
              <p className="text-xs text-slate-400">Configure studio operating hours and room designations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* General Studio Info */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-indigo-600" />
              General Studio Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="settings-studioname-input" className="block text-xs font-semibold text-slate-600 mb-1">Studio Name</label>
                <input
                  id="settings-studioname-input"
                  type="text"
                  required
                  value={formData.studioName}
                  onChange={(e) => setFormData({ ...formData, studioName: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label htmlFor="settings-tagline-input" className="block text-xs font-semibold text-slate-600 mb-1">Tagline / Subtitle</label>
                <input
                  id="settings-tagline-input"
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>

          {/* Operating Hours & Time Format */}
          <div className="pt-2 border-t border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              Operating Hours & Time Slot Division
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="settings-starthour-select" className="block text-xs font-semibold text-slate-600 mb-1">Earliest Slot (Start)</label>
                <select
                  id="settings-starthour-select"
                  value={formData.startHour}
                  onChange={(e) => setFormData({ ...formData, startHour: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl font-mono"
                >
                  {[6, 7, 8, 9, 10].map((h) => (
                    <option key={h} value={h}>
                      {formatHour(h, formData.timeFormat)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="settings-endhour-select" className="block text-xs font-semibold text-slate-600 mb-1">Latest Slot (End)</label>
                <select
                  id="settings-endhour-select"
                  value={formData.endHour}
                  onChange={(e) => setFormData({ ...formData, endHour: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl font-mono"
                >
                  {[20, 21, 22, 23].map((h) => (
                    <option key={h} value={h}>
                      {formatHour(h, formData.timeFormat)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="settings-timeformat-select" className="block text-xs font-semibold text-slate-600 mb-1">Display Clock Format</label>
                <select
                  id="settings-timeformat-select"
                  value={formData.timeFormat}
                  onChange={(e) =>
                    setFormData({ ...formData, timeFormat: e.target.value as '12h' | '24h' })
                  }
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="12h">12-Hour (e.g. 8:00 AM / 10:00 PM)</option>
                  <option value="24h">24-Hour (e.g. 08:00 / 22:00)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Studio Rooms Configuration */}
          <div className="pt-2 border-t border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Studio Room Designations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Room 1 */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  <span className="text-xs font-bold text-slate-900">Studio 1 Room Name</span>
                </div>
                <input
                  id="settings-room1-name"
                  type="text"
                  required
                  value={formData.rooms['room-1'].name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rooms: {
                        ...formData.rooms,
                        'room-1': { ...formData.rooms['room-1'], name: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl font-bold text-slate-800"
                />
              </div>

              {/* Room 2 */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span className="text-xs font-bold text-slate-900">Studio 2 Room Name</span>
                </div>
                <input
                  id="settings-room2-name"
                  type="text"
                  required
                  value={formData.rooms['room-2'].name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rooms: {
                        ...formData.rooms,
                        'room-2': { ...formData.rooms['room-2'], name: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl font-bold text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Admin Authorization Password Field */}
          <div className={`p-4 rounded-xl border transition-all ${
            isPasswordValid
              ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400/30'
              : 'bg-slate-50 border-slate-300'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="settings-password-input" className="block text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                {isPasswordValid ? (
                  <Unlock className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Lock className="w-4 h-4 text-slate-600" />
                )}
                <span>Administrator Password *</span>
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
                id="settings-password-input"
                type="password"
                placeholder="Enter administrator password..."
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

          {/* Data Reset & Recovery Actions */}
          <div className="pt-4 border-t border-slate-200 bg-slate-50 -mx-5 -mb-5 p-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onResetSampleData}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Load Sample Timetable</span>
              </button>

              <button
                id="wipe-all-sessions-btn"
                type="button"
                disabled={!isPasswordValid}
                onClick={onClearAllData}
                title={!isPasswordValid ? 'Enter administrator password to wipe data' : 'Wipe all session bookings'}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-all ${
                  !isPasswordValid
                    ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed opacity-80 shadow-none'
                    : 'text-rose-600 hover:text-rose-800 bg-white border-rose-200 hover:bg-rose-50 cursor-pointer shadow-2xs'
                }`}
              >
                {!isPasswordValid ? (
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Wipe All Sessions</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {showSavedToast && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Saved!
                </span>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="save-settings-submit-btn"
                type="submit"
                disabled={!isPasswordValid}
                title={!isPasswordValid ? 'Enter administrator password to save' : 'Save settings'}
                className={`flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all ${
                  !isPasswordValid
                    ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed opacity-80 shadow-none'
                    : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white cursor-pointer ring-2 ring-indigo-600/20'
                }`}
              >
                {!isPasswordValid ? (
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Save Settings</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
