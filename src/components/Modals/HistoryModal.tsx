import { useState, useMemo } from 'react';
import { SessionLog } from '../../types/library';
import { formatDateTime, formatDuration } from '../../utils/formatters';
import { History, Download, Trash2, Search, User, Clock, Coffee } from 'lucide-react';

interface HistoryModalProps {
  logs: SessionLog[];
  isOpen: boolean;
  onClose: () => void;
  onClearHistory: () => void;
}

export function HistoryModal({
  logs,
  isOpen,
  onClose,
  onClearHistory,
}: HistoryModalProps) {
  const [search, setSearch] = useState('');

  const filteredLogs = useMemo(() => {
    if (!search.trim()) return logs;
    const q = search.toLowerCase();
    return logs.filter(
      (l) =>
        l.userName.toLowerCase().includes(q) ||
        l.deskNumber.toLowerCase().includes(q) ||
        (l.userPhone && l.userPhone.includes(q))
    );
  }, [logs, search]);

  if (!isOpen) return null;

  // Export to CSV
  const handleExportCSV = () => {
    if (logs.length === 0) return;
    const headers = [
      'Masa No',
      'Salon',
      'Kullanıcı Adı Soyadı',
      'Telefon',
      'Giriş Zamanı',
      'Çıkış Zamanı',
      'Toplam Süre (Dk)',
      'Mola Süresi (Dk)',
      'Notlar',
    ];

    const rows = logs.map((log) => [
      `"${log.deskNumber}"`,
      `"${log.zoneName}"`,
      `"${log.userName}"`,
      `"${log.userPhone || ''}"`,
      `"${formatDateTime(log.checkInTime)}"`,
      `"${formatDateTime(log.checkOutTime)}"`,
      log.totalDurationMinutes,
      log.totalBreakMinutes,
      `"${(log.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `kutuphane_masa_gecmisi_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalMinutes = logs.reduce((acc, l) => acc + l.totalDurationMinutes, 0);
  const avgMinutes = logs.length > 0 ? Math.round(totalMinutes / logs.length) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-inner">
              <History className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                Rapor & Geçmiş
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                Kullanım ve Çıkış Kayıtları
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

        {/* Stats summary */}
        <div className="grid grid-cols-3 gap-3 my-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <p className="text-[11px] font-bold text-slate-500 uppercase">Toplam Kayıt</p>
            <p className="text-xl font-extrabold text-slate-900">{logs.length}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <p className="text-[11px] font-bold text-slate-500 uppercase">Ortalama Çalışma</p>
            <p className="text-xl font-extrabold text-indigo-600">{formatDuration(avgMinutes)}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <p className="text-[11px] font-bold text-slate-500 uppercase">Toplam Süre</p>
            <p className="text-xl font-extrabold text-emerald-600">{formatDuration(totalMinutes)}</p>
          </div>
        </div>

        {/* Search & Actions bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="İsim veya masa ara..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              disabled={logs.length === 0}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Excel (CSV) İndir</span>
            </button>
            {logs.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Tüm geçmiş kayıtları silmek istediğinize emin misiniz?')) {
                    onClearHistory();
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Temizle</span>
              </button>
            )}
          </div>
        </div>

        {/* Logs Table */}
        <div className="flex-1 overflow-y-auto border border-slate-200 rounded-xl">
          {filteredLogs.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-xs">
              Henüz tamamlanmış masa kullanım kaydı bulunmuyor.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Masa</th>
                  <th className="py-2.5 px-3">Kullanıcı</th>
                  <th className="py-2.5 px-3">İletişim</th>
                  <th className="py-2.5 px-3">Giriş / Çıkış</th>
                  <th className="py-2.5 px-3">Toplam Süre</th>
                  <th className="py-2.5 px-3">Mola</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-extrabold text-slate-900">
                      {log.deskNumber}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {log.zoneName}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      {log.userName}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                      {log.userPhone || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      <div>Giriş: {formatDateTime(log.checkInTime)}</div>
                      <div className="text-slate-400">Çıkış: {formatDateTime(log.checkOutTime)}</div>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-indigo-700">
                      {formatDuration(log.totalDurationMinutes)}
                    </td>
                    <td className="py-2.5 px-3 text-amber-800 font-medium">
                      {log.totalBreakMinutes > 0 ? `${log.totalBreakMinutes} dk` : 'Yok'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
