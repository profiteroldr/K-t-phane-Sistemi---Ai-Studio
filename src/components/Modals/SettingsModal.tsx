import { useState, useRef } from 'react';
import { LibrarySettings } from '../../types/library';
import { Settings, Save, Download, Upload, RotateCcw, Volume2, Shield } from 'lucide-react';

interface SettingsModalProps {
  settings: LibrarySettings;
  isOpen: boolean;
  onClose: () => void;
  onSaveSettings: (settings: LibrarySettings) => void;
  onExportBackup: () => void;
  onImportBackup: (jsonStr: string) => boolean;
  onResetData: () => void;
}

export function SettingsModal({
  settings,
  isOpen,
  onClose,
  onSaveSettings,
  onExportBackup,
  onImportBackup,
  onResetData,
}: SettingsModalProps) {
  const [libraryName, setLibraryName] = useState(settings.libraryName);
  const [defaultBreakMinutes, setDefaultBreakMinutes] = useState(settings.defaultBreakMinutes);
  const [maxBreakMinutes, setMaxBreakMinutes] = useState(settings.maxBreakMinutes);
  const [soundAlerts, setSoundAlerts] = useState(settings.soundAlerts);
  const [kioskSelfSelection, setKioskSelfSelection] = useState(settings.kioskSelfSelection);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      libraryName: libraryName.trim() || 'Kütüphane',
      defaultBreakMinutes: Number(defaultBreakMinutes),
      maxBreakMinutes: Number(maxBreakMinutes),
      soundAlerts,
      kioskSelfSelection,
    });
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = onImportBackup(content);
      if (success) {
        setImportStatus('Yedek başarıyla yüklendi! Sayfa yenileniyor...');
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setImportStatus('Geçersiz yedek dosyası formatı!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shadow-inner">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Sistem & Yapılandırma
              </span>
              <h2 className="text-xl font-black text-slate-900">
                Kütüphane Ayarları
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {importStatus && (
          <div className="mt-3 p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold">
            {importStatus}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 overflow-y-auto pr-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Kütüphane Başlığı / Kurum Adı
            </label>
            <input
              type="text"
              value={libraryName}
              onChange={(e) => setLibraryName(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Varsayılan Mola (Dk)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={defaultBreakMinutes}
                onChange={(e) => setDefaultBreakMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Maksimum Mola Limiti (Dk)
              </label>
              <input
                type="number"
                min="10"
                max="240"
                value={maxBreakMinutes}
                onChange={(e) => setMaxBreakMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-slate-600" />
                <div>
                  <span className="block text-xs font-bold text-slate-800">Sesli Uyarılar</span>
                  <span className="block text-[11px] text-slate-500">Mola süresi dolduğunda ve onayda hafif ses çal</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={soundAlerts}
                onChange={(e) => setSoundAlerts(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-600" />
                <div>
                  <span className="block text-xs font-bold text-slate-800">Ziyaretçi Kiosk Ön Seçimi</span>
                  <span className="block text-[11px] text-slate-500">Okuyucular ekrandan boş masayı seçip isim bırakabilir</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={kioskSelfSelection}
                onChange={(e) => setKioskSelfSelection(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
            </label>
          </div>

          {/* Backup & Restore section */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Yedekleme ve Bilgisayar Aktarımı
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onExportBackup}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Yedek İndir (JSON)</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Yedek Yükle</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            <button
              type="button"
              onClick={() => {
                if (confirm('Tüm ayarları ve masaları başlangıç örnek durumuna sıfırlamak istediğinize emin misiniz?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="w-full py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-red-200 mt-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Örnek Başlangıç Verilerine Sıfırla</span>
            </button>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="flex-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Ayarları Kaydet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
