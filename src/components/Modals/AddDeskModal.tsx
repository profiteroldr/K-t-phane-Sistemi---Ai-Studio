import { useState } from 'react';
import { Zone, DeskFeature, Desk } from '../../types/library';
import { PlusCircle, Zap, Sun, Monitor, Lightbulb, VolumeX, Maximize2 } from 'lucide-react';

interface AddDeskModalProps {
  zones: Zone[];
  isOpen: boolean;
  onClose: () => void;
  onAddDesk: (newDesk: Desk) => void;
  existingDeskNumbers: string[];
}

export function AddDeskModal({
  zones,
  isOpen,
  onClose,
  onAddDesk,
  existingDeskNumbers,
}: AddDeskModalProps) {
  const [number, setNumber] = useState('');
  const [zoneId, setZoneId] = useState(zones[0]?.id || '');
  const [row, setRow] = useState<number>(1);
  const [col, setCol] = useState<number>(1);
  const [features, setFeatures] = useState<DeskFeature[]>(['power']);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const toggleFeature = (f: DeskFeature) => {
    if (features.includes(f)) {
      setFeatures(features.filter((item) => item !== f));
    } else {
      setFeatures([...features, f]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = number.trim().toUpperCase();
    if (!cleanNumber) {
      setError('Lütfen bir masa numarası giriniz.');
      return;
    }
    if (existingDeskNumbers.map((n) => n.toUpperCase()).includes(cleanNumber)) {
      setError('Bu masa numarası zaten kayıtlı!');
      return;
    }

    const newDesk: Desk = {
      id: `desk-${Date.now()}`,
      number: cleanNumber,
      zoneId: zoneId || zones[0].id,
      row: row || 1,
      col: col || 1,
      features,
      status: 'available',
    };

    onAddDesk(newDesk);
    setNumber('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-inner">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                Yeni Masa Tanımlama
              </span>
              <h2 className="text-xl font-black text-slate-900">
                Sisteme Masa Ekle
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

        {error && (
          <div className="mt-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Masa Numarası / Kodu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={number}
              onChange={(e) => {
                setNumber(e.target.value);
                setError('');
              }}
              placeholder="Örn: A-15 veya B-08"
              autoFocus
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Bulunduğu Salon / Bölüm
            </label>
            <select
              value={zoneId}
              onChange={(e) => setZoneId(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {zones.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name} ({z.floor})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kroki Sıra (Satır)</label>
              <input
                type="number"
                min="1"
                max="20"
                value={row}
                onChange={(e) => setRow(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kroki Sütun</label>
              <input
                type="number"
                min="1"
                max="20"
                value={col}
                onChange={(e) => setCol(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Masa Özellikleri
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={features.includes('power')}
                  onChange={() => toggleFeature('power')}
                  className="rounded text-indigo-600"
                />
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Priz Donanımı</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={features.includes('window')}
                  onChange={() => toggleFeature('window')}
                  className="rounded text-indigo-600"
                />
                <Sun className="w-3.5 h-3.5 text-orange-400" />
                <span>Pencere Kenarı</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={features.includes('pc')}
                  onChange={() => toggleFeature('pc')}
                  className="rounded text-indigo-600"
                />
                <Monitor className="w-3.5 h-3.5 text-sky-500" />
                <span>PC / Ekran</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={features.includes('lamp')}
                  onChange={() => toggleFeature('lamp')}
                  className="rounded text-indigo-600"
                />
                <Lightbulb className="w-3.5 h-3.5 text-yellow-500" />
                <span>Masa Lambası</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={features.includes('quiet')}
                  onChange={() => toggleFeature('quiet')}
                  className="rounded text-indigo-600"
                />
                <VolumeX className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sessiz Salon</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={features.includes('double')}
                  onChange={() => toggleFeature('double')}
                  className="rounded text-indigo-600"
                />
                <Maximize2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>Geniş Masa</span>
              </label>
            </div>
          </div>

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
              <PlusCircle className="w-4 h-4" />
              <span>Masayı Sisteme Ekle</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
