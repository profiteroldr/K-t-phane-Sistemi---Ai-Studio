import { useState } from 'react';
import { Desk } from '../../types/library';
import { Coffee, Clock, AlertCircle } from 'lucide-react';
import { formatClock } from '../../utils/formatters';

interface BreakModalProps {
  desk: Desk | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (durationMinutes: number, reason: string) => void;
}

export function BreakModal({
  desk,
  isOpen,
  onClose,
  onConfirm,
}: BreakModalProps) {
  const [duration, setDuration] = useState<number>(30);
  const [customDuration, setCustomDuration] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('Öğle Yemeği');

  if (!isOpen || !desk || !desk.currentUser) return null;

  const effectiveDuration = isCustom
    ? Math.max(1, parseInt(customDuration, 10) || 15)
    : duration;

  const projectedEndTime = Date.now() + effectiveDuration * 60 * 1000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(effectiveDuration, reason);
    onClose();
  };

  const PRESET_DURATIONS = [
    { minutes: 15, label: '15 dk', desc: 'Kahve / Çay' },
    { minutes: 30, label: '30 dk', desc: 'Standart Mola' },
    { minutes: 45, label: '45 dk', desc: 'Yemek Molası' },
    { minutes: 60, label: '60 dk', desc: 'Öğle Arası' },
  ];

  const PRESET_REASONS = [
    'Öğle Yemeği',
    'Çay / Kahve Molası',
    'Telefon Görüşmesi',
    'İbadet / Namaz',
    'Kısa İhtiyaç Arası',
    'Dışarıda İş',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-inner">
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                Masa Mola & Ayrılmış Durumu
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                Masa {desk.number}
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

        {/* Current Occupant Info */}
        <div className="mt-3 bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 flex items-center justify-between text-xs text-amber-900">
          <div>
            <span className="text-slate-500 block text-[11px]">Kullanıcı:</span>
            <span className="font-extrabold text-sm">{desk.currentUser.name}</span>
          </div>
          {desk.currentUser.phone && (
            <span className="font-mono text-xs text-amber-800 bg-amber-100/80 px-2 py-1 rounded">
              {desk.currentUser.phone}
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Duration Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                Mola Süresi Seçin
              </span>
              <span className="text-amber-800 font-mono font-bold text-xs">
                {effectiveDuration} dakika
              </span>
            </label>

            <div className="grid grid-cols-4 gap-2">
              {PRESET_DURATIONS.map((preset) => (
                <button
                  type="button"
                  key={preset.minutes}
                  onClick={() => {
                    setIsCustom(false);
                    setDuration(preset.minutes);
                  }}
                  className={`py-2 px-1 text-center rounded-xl border transition-all ${
                    !isCustom && duration === preset.minutes
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="block font-bold text-xs">{preset.label}</span>
                  <span
                    className={`block text-[10px] truncate ${
                      !isCustom && duration === preset.minutes ? 'text-amber-100' : 'text-slate-400'
                    }`}
                  >
                    {preset.desc}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Duration Toggle */}
            <div className="mt-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCustom(!isCustom)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                  isCustom
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                Özel Süre Gir
              </button>
              {isCustom && (
                <div className="flex-1 flex items-center gap-1.5">
                  <input
                    type="number"
                    min="1"
                    max="180"
                    placeholder="Dakika (örn: 20)"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    className="w-full px-3 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    autoFocus
                  />
                  <span className="text-xs text-slate-500 font-semibold">dk</span>
                </div>
              )}
            </div>
          </div>

          {/* Reason Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Mola Nedeni
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_REASONS.map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setReason(r)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                    reason === r
                      ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Projected End Time Notification */}
          <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-600 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Masa Ayrılma Bitiş Saati:
            </span>
            <span className="font-mono font-black text-slate-900 text-sm">
              {formatClock(projectedEndTime)}
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="flex-2 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <Coffee className="w-4 h-4" />
              <span>Molayı Başlat & Masayı Ayır</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
