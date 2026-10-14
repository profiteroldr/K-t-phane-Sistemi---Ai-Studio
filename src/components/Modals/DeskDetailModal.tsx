import { useState } from 'react';
import { Desk, Zone } from '../../types/library';
import {
  User,
  Phone,
  Clock,
  Coffee,
  CheckCircle2,
  LogOut,
  Edit2,
  Save,
  Zap,
  Sun,
  Monitor,
  Lightbulb,
  VolumeX,
  Maximize2,
  Wrench,
  AlertTriangle,
} from 'lucide-react';
import { formatClock, formatDuration, getBreakRemaining } from '../../utils/formatters';

interface DeskDetailModalProps {
  desk: Desk | null;
  zone?: Zone;
  isOpen: boolean;
  onClose: () => void;
  onStartBreak: (desk: Desk) => void;
  onEndBreak: (desk: Desk) => void;
  onExtendBreak: (desk: Desk, minutes: number) => void;
  onRelease: (desk: Desk) => void;
  onAssign: (desk: Desk) => void;
  onUpdateDeskUser: (deskId: string, updatedUser: { name: string; phone?: string; notes?: string }) => void;
  onToggleOutOfService: (deskId: string) => void;
}

export function DeskDetailModal({
  desk,
  zone,
  isOpen,
  onClose,
  onStartBreak,
  onEndBreak,
  onExtendBreak,
  onRelease,
  onAssign,
  onUpdateDeskUser,
  onToggleOutOfService,
}: DeskDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editNotes, setEditNotes] = useState('');

  if (!isOpen || !desk) return null;

  const user = desk.currentUser;
  const now = Date.now();
  const elapsedMinutes = user?.checkInTime
    ? Math.max(0, Math.floor((now - user.checkInTime) / (1000 * 60)))
    : 0;

  const breakInfo =
    desk.status === 'on_break' && user?.breakEndTime
      ? getBreakRemaining(user.breakEndTime)
      : null;

  const handleStartEdit = () => {
    if (user) {
      setEditName(user.name);
      setEditPhone(user.phone || '');
      setEditNotes(user.notes || '');
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) return;
    onUpdateDeskUser(desk.id, {
      name: editName.trim(),
      phone: editPhone.trim() || undefined,
      notes: editNotes.trim() || undefined,
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-900">
                Masa {desk.number}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {zone?.name || 'Salon'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {zone?.floor} • Masa ve Kullanıcı Detayları
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Features Row */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {desk.features.includes('power') && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md">
              <Zap className="w-3 h-3 text-amber-500" /> Priz Var
            </span>
          )}
          {desk.features.includes('window') && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-orange-50 text-orange-800 border border-orange-200 px-2 py-0.5 rounded-md">
              <Sun className="w-3 h-3 text-orange-400" /> Pencere Kenarı
            </span>
          )}
          {desk.features.includes('pc') && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded-md">
              <Monitor className="w-3 h-3 text-sky-500" /> PC Donanımlı
            </span>
          )}
          {desk.features.includes('lamp') && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-yellow-50 text-yellow-800 border border-yellow-200 px-2 py-0.5 rounded-md">
              <Lightbulb className="w-3 h-3 text-yellow-500" /> Masa Lambası
            </span>
          )}
          {desk.features.includes('quiet') && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
              <VolumeX className="w-3 h-3 text-emerald-600" /> Sessiz Alan
            </span>
          )}
          {desk.features.includes('double') && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded-md">
              <Maximize2 className="w-3 h-3 text-indigo-500" /> Geniş Masa
            </span>
          )}
        </div>

        {/* Current State Box */}
        <div className="mt-4 space-y-4">
          {/* AVAILABLE */}
          {desk.status === 'available' && (
            <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-emerald-900">
                  Bu Masa Şu Anda Boş (Müsait)
                </h3>
                <p className="text-xs text-emerald-700 mt-1">
                  Kütüphaneye gelen ziyaretçiye bu masayı tahsis etmek için aşağıdaki butona basabilirsiniz.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onAssign(desk);
                }}
                className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm inline-flex items-center gap-2"
              >
                <span>Kullanıcı Ata / Masayı Ver</span>
              </button>
            </div>
          )}

          {/* OCCUPIED OR ON BREAK */}
          {(desk.status === 'occupied' || desk.status === 'on_break') && user && (
            <div className="space-y-4">
              {/* Break Alert banner if on break */}
              {desk.status === 'on_break' && breakInfo && (
                <div
                  className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                    breakInfo.isExpired
                      ? 'bg-red-50 border-red-300 text-red-900'
                      : 'bg-amber-50 border-amber-300 text-amber-900'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Coffee className="w-4 h-4" />
                      {breakInfo.isExpired ? 'Mola Süresi Doldu!' : 'Masa Ayrılmış / Molada'}
                    </span>
                    <p className="text-xs mt-0.5">
                      {user.breakReason || 'Mola'} ({user.breakDurationMinutes} dk)
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-mono text-base font-black px-2.5 py-1 rounded-lg ${
                        breakInfo.isExpired
                          ? 'bg-red-600 text-white animate-pulse'
                          : 'bg-white text-amber-900 border border-amber-300'
                      }`}
                    >
                      {breakInfo.formatted}
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">
                      {breakInfo.isExpired ? 'Süre Aşımı' : 'Kalan Süre'}
                    </span>
                  </div>
                </div>
              )}

              {/* User Info Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    Kullanıcı Bilgileri
                  </span>
                  {!isEditing ? (
                    <button
                      onClick={handleStartEdit}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Düzenle
                    </button>
                  ) : (
                    <button
                      onClick={handleSaveEdit}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
                    >
                      <Save className="w-3.5 h-3.5" /> Kaydet
                    </button>
                  )}
                </div>

                {!isEditing ? (
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" /> Ad Soyad:
                      </span>
                      <span className="font-extrabold text-slate-900 text-sm">{user.name}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> Telefon:
                      </span>
                      <span className="font-mono text-slate-700">
                        {user.phone || 'Kayıtlı değil'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> Giriş Saati:
                      </span>
                      <span className="font-mono text-slate-700">
                        {formatClock(user.checkInTime)} ({formatDuration(elapsedMinutes)} önce)
                      </span>
                    </div>

                    {user.notes && (
                      <div className="mt-2 pt-2 border-t border-slate-200/60">
                        <span className="text-slate-500 block text-[11px]">Not:</span>
                        <p className="text-slate-800 italic">{user.notes}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-3 space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700">Ad Soyad</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700">Telefon</label>
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700">Not</label>
                      <input
                        type="text"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons for Occupied / On Break */}
              <div className="space-y-2 pt-2">
                {desk.status === 'occupied' && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        onClose();
                        onStartBreak(desk);
                      }}
                      className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Coffee className="w-4 h-4" />
                      <span>Mola Ver (Ayrılmış)</span>
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onRelease(desk);
                      }}
                      className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Masayı Boşalt (Çıkış)</span>
                    </button>
                  </div>
                )}

                {desk.status === 'on_break' && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => {
                          onClose();
                          onEndBreak(desk);
                        }}
                        className="py-2 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Molayı Bitir</span>
                      </button>
                      <button
                        onClick={() => onExtendBreak(desk, 15)}
                        className="py-2 px-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold flex items-center justify-center"
                      >
                        +15 dk Uzat
                      </button>
                      <button
                        onClick={() => onExtendBreak(desk, 30)}
                        className="py-2 px-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold flex items-center justify-center"
                      >
                        +30 dk Uzat
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onRelease(desk);
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Masayı Boşalt (Kütüphaneden Ayrıldı)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Maintenance / Out of Service Toggle */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Masa Bakım / Arıza Durumu:</span>
            <button
              onClick={() => onToggleOutOfService(desk.id)}
              className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                desk.status === 'out_of_service'
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>
                {desk.status === 'out_of_service' ? 'Kullanıma Aç' : 'Kullanım Dışı Yap'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
