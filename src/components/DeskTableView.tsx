import { Desk, Zone } from '../types/library';
import { formatClock, formatDuration, getBreakRemaining } from '../utils/formatters';
import { Coffee, LogOut, UserPlus, CheckCircle2 } from 'lucide-react';

interface DeskTableViewProps {
  desks: Desk[];
  zones: Zone[];
  onAssign: (desk: Desk) => void;
  onStartBreak: (desk: Desk) => void;
  onEndBreak: (desk: Desk) => void;
  onRelease: (desk: Desk) => void;
  onClickDetail: (desk: Desk) => void;
}

export function DeskTableView({
  desks,
  zones,
  onAssign,
  onStartBreak,
  onEndBreak,
  onRelease,
  onClickDetail,
}: DeskTableViewProps) {
  const getZone = (zoneId: string) => zones.find((z) => z.id === zoneId);
  const now = Date.now();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Masa No</th>
              <th className="py-3 px-4">Salon / Bölüm</th>
              <th className="py-3 px-4">Durum</th>
              <th className="py-3 px-4">Kullanıcı (Ad Soyad)</th>
              <th className="py-3 px-4">İletişim</th>
              <th className="py-3 px-4">Giriş Saati</th>
              <th className="py-3 px-4">Kalış Süresi</th>
              <th className="py-3 px-4">Mola Durumu</th>
              <th className="py-3 px-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {desks.map((desk) => {
              const zone = getZone(desk.zoneId);
              const user = desk.currentUser;
              const breakInfo =
                desk.status === 'on_break' && user?.breakEndTime
                  ? getBreakRemaining(user.breakEndTime)
                  : null;
              const elapsedMinutes = user?.checkInTime
                ? Math.floor((now - user.checkInTime) / (1000 * 60))
                : 0;

              return (
                <tr
                  key={desk.id}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  onClick={() => onClickDetail(desk)}
                >
                  <td className="py-3 px-4 font-extrabold text-slate-900 text-sm">
                    {desk.number}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <span className="font-medium">{zone?.name}</span>
                    <span className="block text-[10px] text-slate-400">{zone?.floor}</span>
                  </td>
                  <td className="py-3 px-4">
                    {desk.status === 'available' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        BOŞ
                      </span>
                    )}
                    {desk.status === 'occupied' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                        DOLU
                      </span>
                    )}
                    {desk.status === 'on_break' && (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${
                          breakInfo?.isExpired
                            ? 'bg-red-600 text-white border-red-700 animate-pulse'
                            : 'bg-amber-100 text-amber-900 border-amber-300'
                        }`}
                      >
                        {breakInfo?.isExpired ? 'MOLA AŞILDI' : 'MOLADA'}
                      </span>
                    )}
                    {desk.status === 'reserved_pending' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
                        ONAY BEKLİYOR
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {user?.name || desk.pendingVisitorName || (
                      <span className="text-slate-400 font-normal">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">
                    {user?.phone || '—'}
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono">
                    {user?.checkInTime ? formatClock(user.checkInTime) : '—'}
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {user ? formatDuration(elapsedMinutes) : '—'}
                  </td>
                  <td className="py-3 px-4">
                    {desk.status === 'on_break' && breakInfo ? (
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${
                            breakInfo.isExpired
                              ? 'bg-red-600 text-white'
                              : 'bg-amber-200 text-amber-900'
                          }`}
                        >
                          {breakInfo.formatted}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          ({user?.breakReason || 'Mola'})
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td
                    className="py-3 px-4 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      {desk.status === 'available' && (
                        <button
                          onClick={() => onAssign(desk)}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] flex items-center gap-1"
                        >
                          <UserPlus className="w-3 h-3" />
                          <span>Masa Ver</span>
                        </button>
                      )}
                      {desk.status === 'occupied' && (
                        <>
                          <button
                            onClick={() => onStartBreak(desk)}
                            className="px-2 py-1 rounded bg-amber-500 hover:bg-amber-600 text-white font-semibold text-[11px] flex items-center gap-1"
                          >
                            <Coffee className="w-3 h-3" />
                            <span>Mola</span>
                          </button>
                          <button
                            onClick={() => onRelease(desk)}
                            className="px-2 py-1 rounded bg-slate-200 hover:bg-red-600 hover:text-white text-slate-700 font-semibold text-[11px] flex items-center gap-1"
                          >
                            <LogOut className="w-3 h-3" />
                            <span>Boşalt</span>
                          </button>
                        </>
                      )}
                      {desk.status === 'on_break' && (
                        <>
                          <button
                            onClick={() => onEndBreak(desk)}
                            className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Döndü</span>
                          </button>
                          <button
                            onClick={() => onRelease(desk)}
                            className="px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-semibold text-[11px] flex items-center gap-1"
                          >
                            <LogOut className="w-3 h-3" />
                            <span>Boşalt</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
