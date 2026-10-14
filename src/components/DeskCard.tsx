import { useEffect, useState } from 'react';
import {
  Zap,
  Sun,
  Monitor,
  Lightbulb,
  VolumeX,
  Maximize2,
  Clock,
  User,
  Coffee,
  CheckCircle2,
  LogOut,
  AlertTriangle,
  UserPlus,
} from 'lucide-react';
import { Desk, Zone, DeskFeature } from '../types/library';
import { getBreakRemaining, formatClock, formatDuration } from '../utils/formatters';

interface DeskCardProps {
  desk: Desk;
  zone?: Zone;
  onAssign: (desk: Desk) => void;
  onStartBreak: (desk: Desk) => void;
  onEndBreak: (desk: Desk) => void;
  onExtendBreak: (desk: Desk, minutes: number) => void;
  onRelease: (desk: Desk) => void;
  onApprovePending: (desk: Desk) => void;
  onCancelPending: (desk: Desk) => void;
  onClickDetail: (desk: Desk) => void;
}

export function DeskCard({
  desk,
  zone,
  onAssign,
  onStartBreak,
  onEndBreak,
  onExtendBreak,
  onRelease,
  onApprovePending,
  onCancelPending,
  onClickDetail,
}: DeskCardProps) {
  // Tick every second to update break countdown and elapsed work time
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const now = Date.now();
  const user = desk.currentUser;

  // Render Feature Icons
  const renderFeatureIcon = (feature: DeskFeature) => {
    switch (feature) {
      case 'power':
        return (
          <span key="power" title="Priz Var">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
          </span>
        );
      case 'window':
        return (
          <span key="window" title="Pencere Kenarı">
            <Sun className="w-3.5 h-3.5 text-orange-400" />
          </span>
        );
      case 'pc':
        return (
          <span key="pc" title="Bilgisayar Donanımlı">
            <Monitor className="w-3.5 h-3.5 text-sky-500" />
          </span>
        );
      case 'lamp':
        return (
          <span key="lamp" title="Masa Lambası">
            <Lightbulb className="w-3.5 h-3.5 text-yellow-500" />
          </span>
        );
      case 'quiet':
        return (
          <span key="quiet" title="Sessiz Alan">
            <VolumeX className="w-3.5 h-3.5 text-emerald-600" />
          </span>
        );
      case 'double':
        return (
          <span key="double" title="Geniş Çalışma Masası">
            <Maximize2 className="w-3.5 h-3.5 text-indigo-500" />
          </span>
        );
      default:
        return null;
    }
  };

  // Break countdown logic
  const breakInfo =
    desk.status === 'on_break' && user?.breakEndTime
      ? getBreakRemaining(user.breakEndTime)
      : null;

  // Elapsed study time
  const elapsedMinutes = user?.checkInTime
    ? Math.max(0, Math.floor((now - user.checkInTime) / (1000 * 60)))
    : 0;

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
        desk.status === 'available'
          ? 'bg-white border-emerald-300/80 hover:border-emerald-500 hover:ring-2 hover:ring-emerald-500/20'
          : desk.status === 'occupied'
          ? 'bg-white border-blue-200 hover:border-blue-400'
          : desk.status === 'on_break'
          ? breakInfo?.isExpired
            ? 'bg-red-50/50 border-red-400 ring-2 ring-red-400/30'
            : 'bg-amber-50/40 border-amber-300 hover:border-amber-400'
          : desk.status === 'reserved_pending'
          ? 'bg-purple-50/50 border-purple-300 ring-2 ring-purple-300/40'
          : 'bg-slate-50 border-slate-200 opacity-70'
      }`}
    >
      {/* Top Banner / Header */}
      <div className="p-3.5 pb-2.5">
        <div className="flex items-start justify-between gap-2">
          {/* Desk Number & Zone */}
          <div className="cursor-pointer" onClick={() => onClickDetail(desk)}>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                {desk.number}
              </span>
              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {zone?.name || 'Salon'}
              </span>
            </div>
            {/* Features badges */}
            <div className="flex items-center gap-1.5 mt-1.5">
              {desk.features.map(renderFeatureIcon)}
            </div>
          </div>

          {/* Status Badge */}
          <div>
            {desk.status === 'available' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                BOŞ
              </span>
            )}

            {desk.status === 'occupied' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                DOLU
              </span>
            )}

            {desk.status === 'on_break' && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                  breakInfo?.isExpired
                    ? 'bg-red-600 text-white border-red-700 animate-pulse'
                    : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}
              >
                <Coffee className="w-3 h-3" />
                {breakInfo?.isExpired ? 'SÜRE DOLDU' : 'MOLADA'}
              </span>
            )}

            {desk.status === 'reserved_pending' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300 animate-bounce">
                ONAY BEKLİYOR
              </span>
            )}
          </div>
        </div>

        {/* Content Body based on Status */}
        <div className="mt-3 min-h-[72px]">
          {/* AVAILABLE STATE */}
          {desk.status === 'available' && (
            <div
              onClick={() => onAssign(desk)}
              className="cursor-pointer py-3 px-2 rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/50 transition-colors flex flex-col items-center justify-center text-center"
            >
              <UserPlus className="w-5 h-5 text-emerald-600 mb-1" />
              <p className="text-xs font-bold text-emerald-800">Masa Kullanıma Hazır</p>
              <p className="text-[11px] text-emerald-600">Giriş yapmak için tıklayın</p>
            </div>
          )}

          {/* OCCUPIED STATE */}
          {desk.status === 'occupied' && user && (
            <div
              className="space-y-1.5 cursor-pointer p-2 rounded-lg hover:bg-blue-50/50 transition-colors"
              onClick={() => onClickDetail(desk)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm truncate">
                  <User className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="truncate">{user.name}</span>
                </div>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded">
                  {formatDuration(elapsedMinutes)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Giriş: {formatClock(user.checkInTime)}
                </span>
                {user.phone && <span className="font-mono text-[11px]">{user.phone}</span>}
              </div>

              {user.notes && (
                <p className="text-[11px] text-slate-500 italic truncate bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                  {user.notes}
                </p>
              )}
            </div>
          )}

          {/* ON BREAK STATE */}
          {desk.status === 'on_break' && user && (
            <div
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                breakInfo?.isExpired
                  ? 'bg-red-100/80 border-red-300 text-red-900'
                  : 'bg-amber-100/70 border-amber-200 text-amber-900'
              }`}
              onClick={() => onClickDetail(desk)}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm truncate flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                  {user.name}
                </span>
                {/* Live Countdown Clock Badge */}
                <span
                  className={`font-mono text-xs font-bold px-2 py-0.5 rounded shadow-xs ${
                    breakInfo?.isExpired
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-white text-amber-900 border border-amber-300'
                  }`}
                >
                  {breakInfo?.formatted}
                </span>
              </div>

              <div className="mt-1 flex items-center justify-between text-[11px]">
                <span className="truncate">
                  {user.breakReason ? user.breakReason : 'Mola'} ({user.breakDurationMinutes} dk)
                </span>
                {breakInfo?.isExpired ? (
                  <span className="font-bold text-red-700 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Aşıldı!
                  </span>
                ) : (
                  <span className="text-amber-800">
                    Bitiş: {user.breakEndTime ? formatClock(user.breakEndTime) : ''}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* RESERVED PENDING (FROM KIOSK) */}
          {desk.status === 'reserved_pending' && (
            <div className="p-2.5 rounded-xl border border-purple-200 bg-purple-100/60 text-purple-950">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm truncate">
                  {desk.pendingVisitorName || 'Kullanıcı Masayı Seçti'}
                </span>
                <span className="text-[10px] bg-purple-200 text-purple-800 px-1.5 py-0.5 rounded font-bold">
                  Kiosk Talebi
                </span>
              </div>
              <p className="text-[11px] text-purple-700 mt-1">
                Kullanıcı bankoya geliyor, onay bekliyor.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="p-2.5 bg-slate-50/90 border-t border-slate-100 rounded-b-2xl">
        {/* AVAILABLE: 1-click Check-in */}
        {desk.status === 'available' && (
          <button
            onClick={() => onAssign(desk)}
            className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Kullanıcı Ata / Masayı Ver</span>
          </button>
        )}

        {/* OCCUPIED: Mola Ver & Masayı Boşalt */}
        {desk.status === 'occupied' && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onStartBreak(desk)}
              className="py-1.5 px-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-xs"
              title="Kullanıcı mola veya öğle arasına çıktığında süre belirleyin"
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>Mola Ver</span>
            </button>
            <button
              onClick={() => onRelease(desk)}
              className="py-1.5 px-2 rounded-lg bg-slate-200 hover:bg-red-600 hover:text-white text-slate-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              title="Kullanıcı kütüphaneden ayrıldı, masayı boşalt"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Boşalt</span>
            </button>
          </div>
        )}

        {/* ON BREAK: Molayı Bitir, Uzat, Boşalt */}
        {desk.status === 'on_break' && (
          <div className="space-y-1.5">
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => onEndBreak(desk)}
                className="py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-xs"
                title="Kullanıcı masasına geri döndü"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Döndü</span>
              </button>
              <button
                onClick={() => onExtendBreak(desk, 15)}
                className="py-1.5 px-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                title="Mola süresini 15 dakika uzat"
              >
                <span>+15 dk</span>
              </button>
            </div>
            {breakInfo?.isExpired && (
              <button
                onClick={() => onRelease(desk)}
                className="w-full py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs animate-bounce"
                title="Mola süresi dolduğu için masayı yeni kullanıcılara aç"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Süre Doldu - Masayı Boşalt</span>
              </button>
            )}
          </div>
        )}

        {/* RESERVED PENDING: Approve or Cancel */}
        {desk.status === 'reserved_pending' && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onApprovePending(desk)}
              className="py-1.5 px-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Onayla</span>
            </button>
            <button
              onClick={() => onCancelPending(desk)}
              className="py-1.5 px-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
            >
              <span>İptal</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
