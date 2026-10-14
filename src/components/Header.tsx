import { useState, useEffect } from 'react';
import {
  Library,
  Monitor,
  UserCheck,
  History,
  Volume2,
  VolumeX,
  Wifi,
  Settings,
  Download,
  PlusCircle,
} from 'lucide-react';
import { LibrarySettings } from '../types/library';

interface HeaderProps {
  viewMode: 'admin' | 'kiosk';
  setViewMode: (mode: 'admin' | 'kiosk') => void;
  settings: LibrarySettings;
  onUpdateSettings: (settings: LibrarySettings) => void;
  onOpenHistory: () => void;
  onOpenNetworkGuide: () => void;
  onOpenSettings: () => void;
  onOpenAddDesk: () => void;
  onExportBackup: () => void;
  pendingRequestsCount: number;
}

export function Header({
  viewMode,
  setViewMode,
  settings,
  onUpdateSettings,
  onOpenHistory,
  onOpenNetworkGuide,
  onOpenSettings,
  onOpenAddDesk,
  onExportBackup,
  pendingRequestsCount,
}: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
      setCurrentDate(
        now.toLocaleDateString('tr-TR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    onUpdateSettings({
      ...settings,
      soundAlerts: !settings.soundAlerts,
    });
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Library className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 leading-tight">
                  {settings.libraryName || 'Kütüphane Masa Doluluk Sistemi'}
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                  Lokal / Çevrimdışı
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {currentDate} • <span className="font-mono font-medium text-slate-700">{currentTime}</span>
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('admin')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'admin'
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Görevli Paneli</span>
              {pendingRequestsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-purple-600 text-white rounded-full text-[10px] animate-bounce">
                  {pendingRequestsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setViewMode('kiosk')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'kiosk'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Kullanıcıların boş masaları görüp seçim yapabileceği büyük ekran veya ziyaretçi kiosk görünümü"
            >
              <Monitor className="w-4 h-4" />
              <span>Ziyaretçi Kiosk Ekranı</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {viewMode === 'admin' && (
              <button
                onClick={onOpenAddDesk}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                title="Yeni Masa Ekle"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Yeni Masa</span>
              </button>
            )}

            <button
              onClick={toggleSound}
              className={`p-2 rounded-lg text-xs border transition-colors ${
                settings.soundAlerts
                  ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
              }`}
              title={settings.soundAlerts ? 'Sesli Uyarılar Açık' : 'Sesli Uyarılar Kapalı'}
            >
              {settings.soundAlerts ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={onOpenHistory}
              className="p-2 rounded-lg text-xs border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
              title="Günlük Kullanım & Çıkış Geçmişi"
            >
              <History className="w-4 h-4" />
            </button>

            <button
              onClick={onExportBackup}
              className="p-2 rounded-lg text-xs border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
              title="Verileri Yedekle (JSON İndir)"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenNetworkGuide}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
              title="Yerel Ağda ve Başka Bilgisayarda Çalıştırma Rehberi"
            >
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ağ Rehberi</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg text-xs border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
              title="Kütüphane & Sistem Ayarları"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
