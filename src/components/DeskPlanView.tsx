import { Desk, Zone } from '../types/library';
import { getBreakRemaining } from '../utils/formatters';
import { Zap, Sun, Monitor, Coffee } from 'lucide-react';

interface DeskPlanViewProps {
  desks: Desk[];
  zones: Zone[];
  selectedZoneId: string;
  onSelectDesk: (desk: Desk) => void;
}

export function DeskPlanView({
  desks,
  zones,
  selectedZoneId,
  onSelectDesk,
}: DeskPlanViewProps) {
  // If 'all', pick first zone or show grouped
  const activeZone =
    selectedZoneId === 'all'
      ? zones[0]
      : zones.find((z) => z.id === selectedZoneId) || zones[0];

  const zoneDesks = desks.filter((d) => d.zoneId === activeZone.id);

  // Group by row or build visual grid
  const maxRow = Math.max(...zoneDesks.map((d) => d.row || 1), 3);
  const maxCol = Math.max(...zoneDesks.map((d) => d.col || 1), 4);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
      {/* Zone Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>{activeZone.name}</span>
            <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
              {activeZone.floor}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{activeZone.description}</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-500"></span>
            <span className="text-slate-600 font-medium">Boş</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-blue-500"></span>
            <span className="text-slate-600 font-medium">Dolu</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-amber-500"></span>
            <span className="text-slate-600 font-medium">Molada</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-purple-500"></span>
            <span className="text-slate-600 font-medium">Onay Bekliyor</span>
          </div>
        </div>
      </div>

      {/* Visual Architectural Room Frame */}
      <div className="relative border-2 border-dashed border-slate-300 rounded-2xl p-6 bg-slate-50/50 min-h-[420px] flex flex-col justify-between">
        {/* Top Boundary: Window Wall */}
        <div className="w-full flex items-center justify-center gap-2 py-1 bg-amber-100/60 rounded-lg border border-amber-200 text-amber-900 text-xs font-semibold">
          <Sun className="w-4 h-4 text-amber-600" />
          <span>PENCERE CEPHESİ (DOĞAL AYDINLATMA)</span>
        </div>

        {/* The Grid of Desks */}
        <div className="my-6 overflow-x-auto">
          <div
            className="grid gap-4 min-w-[500px]"
            style={{
              gridTemplateColumns: `repeat(${maxCol}, minmax(130px, 1fr))`,
            }}
          >
            {Array.from({ length: maxRow }).map((_, rIdx) => {
              const rowNum = rIdx + 1;
              return Array.from({ length: maxCol }).map((_, cIdx) => {
                const colNum = cIdx + 1;
                const desk = zoneDesks.find(
                  (d) => (d.row || 1) === rowNum && (d.col || 1) === colNum
                );

                if (!desk) {
                  return (
                    <div
                      key={`empty-${rowNum}-${colNum}`}
                      className="h-28 rounded-xl border border-dashed border-slate-200 bg-slate-100/40 flex items-center justify-center text-[11px] text-slate-300"
                    >
                      Geçiş Koridoru
                    </div>
                  );
                }

                const breakInfo =
                  desk.status === 'on_break' && desk.currentUser?.breakEndTime
                    ? getBreakRemaining(desk.currentUser.breakEndTime)
                    : null;

                return (
                  <button
                    key={desk.id}
                    onClick={() => onSelectDesk(desk)}
                    className={`h-28 p-2.5 rounded-xl border-2 transition-all flex flex-col justify-between text-left shadow-xs hover:shadow-md cursor-pointer hover:scale-102 ${
                      desk.status === 'available'
                        ? 'bg-emerald-50 border-emerald-400 hover:border-emerald-600'
                        : desk.status === 'occupied'
                        ? 'bg-blue-50 border-blue-400 hover:border-blue-600'
                        : desk.status === 'on_break'
                        ? breakInfo?.isExpired
                          ? 'bg-red-100 border-red-500 animate-pulse'
                          : 'bg-amber-100 border-amber-400 hover:border-amber-500'
                        : 'bg-purple-100 border-purple-400'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-extrabold text-slate-900 text-sm">
                        {desk.number}
                      </span>
                      <div className="flex items-center gap-1">
                        {desk.features.includes('power') && (
                          <Zap className="w-3 h-3 text-amber-500" />
                        )}
                        {desk.features.includes('pc') && (
                          <Monitor className="w-3 h-3 text-sky-500" />
                        )}
                      </div>
                    </div>

                    {/* Middle Info */}
                    <div className="my-auto">
                      {desk.status === 'available' && (
                        <p className="text-xs font-bold text-emerald-700">MÜSAİT (BOŞ)</p>
                      )}
                      {desk.status === 'occupied' && (
                        <div className="text-xs">
                          <p className="font-bold text-blue-900 truncate">
                            {desk.currentUser?.name}
                          </p>
                          <p className="text-[10px] text-blue-700">Kullanımda</p>
                        </div>
                      )}
                      {desk.status === 'on_break' && (
                        <div className="text-xs">
                          <p className="font-bold text-amber-950 truncate flex items-center gap-1">
                            <Coffee className="w-3 h-3 shrink-0" />
                            {desk.currentUser?.name}
                          </p>
                          <span
                            className={`inline-block font-mono text-[10px] font-bold px-1 rounded ${
                              breakInfo?.isExpired ? 'bg-red-600 text-white' : 'bg-white text-amber-900'
                            }`}
                          >
                            {breakInfo?.formatted}
                          </span>
                        </div>
                      )}
                      {desk.status === 'reserved_pending' && (
                        <div className="text-xs">
                          <p className="font-bold text-purple-900 truncate">
                            {desk.pendingVisitorName || 'Seçildi'}
                          </p>
                          <p className="text-[10px] text-purple-700">Onay Bekliyor</p>
                        </div>
                      )}
                    </div>

                    {/* Bottom micro note */}
                    <div className="text-[10px] text-slate-400 flex items-center justify-between">
                      <span>Masa {desk.number}</span>
                      <span className="font-semibold text-slate-600">İşlem Yap →</span>
                    </div>
                  </button>
                );
              });
            })}
          </div>
        </div>

        {/* Bottom Boundary: Entrance & Reception */}
        <div className="w-full flex items-center justify-between pt-2 border-t border-slate-200 text-xs text-slate-500 font-semibold">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-200/80 rounded-lg text-slate-700">
            <span>🚪 SALON GİRİŞ KAPISI</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-900 rounded-lg">
            <span>👨‍💼 KÜTÜPHANE GÖREVLİSİ BANKOSU</span>
          </div>
        </div>
      </div>
    </div>
  );
}
