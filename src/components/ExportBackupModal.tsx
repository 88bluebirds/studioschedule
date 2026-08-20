import React, { useState, useRef } from 'react';
import { X, Download, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Booking, StudioSettings } from '../types';

interface ExportBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  settings: StudioSettings;
  onImportBookings: (imported: Booking[]) => void;
}

export const ExportBackupModal: React.FC<ExportBackupModalProps> = ({
  isOpen,
  onClose,
  bookings,
  settings,
  onImportBookings,
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Export JSON
  const handleExportJSON = () => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings,
      bookings,
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dance_studio_schedule_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Date',
      'Start Hour',
      'Duration (Hours)',
      'Studio Room',
      'Class Title',
      'Instructor',
      'Genre',
      'Level',
      'Type',
      'Status',
      'Notes',
    ];

    const rows = bookings.map((b) => [
      b.id,
      b.date,
      `${b.startHour}:00`,
      b.durationHours,
      b.roomId === 'room-1' ? settings.rooms['room-1'].name : settings.rooms['room-2'].name,
      `"${(b.title || '').replace(/"/g, '""')}"`,
      `"${(b.instructor || '').replace(/"/g, '""')}"`,
      b.genre,
      b.level,
      b.type,
      b.status,
      `"${(b.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dance_schedule_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed.bookings)) {
          onImportBookings(parsed.bookings);
          setImportStatus(`Successfully restored ${parsed.bookings.length} bookings!`);
        } else if (Array.isArray(parsed)) {
          onImportBookings(parsed);
          setImportStatus(`Successfully imported ${parsed.length} bookings!`);
        } else {
          setImportStatus('Invalid schedule format in JSON file.');
        }
      } catch (err) {
        setImportStatus('Error reading file. Please provide valid JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center ring-1 ring-indigo-500/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                Export & Backup
              </h2>
              <p className="text-xs text-slate-400">Download reports or backup timetable data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {importStatus && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                importStatus.includes('Successfully')
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {importStatus.includes('Successfully') ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{importStatus}</span>
            </div>
          )}

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="w-full p-3.5 bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 rounded-xl text-left flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                CSV
              </div>
              <div>
                <p className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-indigo-950">
                  Export to Excel / CSV Spreadsheet
                </p>
                <p className="text-[11px] text-slate-500">
                  Full timetable database for reports and finance
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExportJSON}
            className="w-full p-3.5 bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 rounded-xl text-left flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                JSON
              </div>
              <div>
                <p className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-indigo-950">
                  Download Full Backup (.json)
                </p>
                <p className="text-[11px] text-slate-500">
                  Includes studio settings, room config, and all bookings
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
          </button>

          {/* Import JSON */}
          <div className="pt-2 border-t border-slate-200">
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-3.5 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 rounded-xl text-left flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-xs sm:text-sm text-slate-900">
                    Restore from Backup (.json)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Upload a previously exported schedule file
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
