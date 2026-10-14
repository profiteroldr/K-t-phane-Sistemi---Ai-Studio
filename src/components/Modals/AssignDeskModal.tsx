import { useState, useEffect } from 'react';
import { Desk, Zone } from '../../types/library';
import { UserPlus, User, Phone, Hash, Clock, FileText, Zap, Sun, Monitor } from 'lucide-react';

interface AssignDeskModalProps {
  desk: Desk | null;
  zone?: Zone;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    name: string;
    phone?: string;
    memberId?: string;
    expectedDurationHours?: number;
    notes?: string;
  }) => void;
}

export function AssignDeskModal({
  desk,
  zone,
  isOpen,
  onClose,
  onConfirm,
}: AssignDeskModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [memberId, setMemberId] = useState('');
  const [expectedHours, setExpectedHours] = useState<number>(2);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (desk) {
      setName(desk.pendingVisitorName || '');
      setPhone(desk.pendingVisitorPhone || '');
      setMemberId('');
      setExpectedHours(2);
      setNotes('');
    }
  }, [desk]);

  if (!isOpen || !desk) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onConfirm({
      name: name.trim(),
      phone: phone.trim() || undefined,
      memberId: memberId.trim() || undefined,
      expectedDurationHours: expectedHours || undefined,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Masa Giriş & Kullanıcı Kaydı
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

        {/* Info Banner */}
        <div className="mt-3 bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between text-xs text-slate-600">
          <div>
            <span className="font-bold text-slate-800">{zone?.name}</span> ({zone?.floor})
          </div>
          <div className="flex items-center gap-2">
            {desk.features.includes('power') && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                <Zap className="w-3 h-3 text-amber-500" /> Priz Var
              </span>
            )}
            {desk.features.includes('window') && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-orange-50 text-orange-800 border border-orange-200 px-2 py-0.5 rounded">
                <Sun className="w-3 h-3 text-orange-400" /> Pencere Kenarı
              </span>
            )}
            {desk.features.includes('pc') && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded">
                <Monitor className="w-3 h-3 text-sky-500" /> PC Donanımlı
              </span>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Ad Soyad */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>Adı ve Soyadı</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: Ayşe Demir"
              autoFocus
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Telefon */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-indigo-600" />
                <span>Telefon Numarası</span>
                <span className="text-slate-400 text-[10px] font-normal">(İsteğe bağlı)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Örn: 0532 123 4567"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Öğrenci/Üye No */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-indigo-600" />
                <span>Öğrenci / Üye No</span>
                <span className="text-slate-400 text-[10px] font-normal">(İsteğe bağlı)</span>
              </label>
              <input
                type="text"
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                placeholder="Örn: ÖGR-2024-55"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Tahmini Süre */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Tahmini Kalış Süresi</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 4, 8].map((hours) => (
                <button
                  type="button"
                  key={hours}
                  onClick={() => setExpectedHours(hours)}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border transition-all ${
                    expectedHours === hours
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {hours === 8 ? 'Tüm Gün' : `${hours} Saat`}
                </button>
              ))}
            </div>
          </div>

          {/* Not / Açıklama */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Açıklama / Not</span>
              <span className="text-slate-400 text-[10px] font-normal">(İsteğe bağlı)</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Örn: KPSS hazırlık, bilgisayar kullanımı..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Masayı Ver & Girişi Onayla</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
