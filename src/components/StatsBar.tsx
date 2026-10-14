import { Search, LayoutGrid, Map, Table, Filter } from 'lucide-react';
import { Desk, Zone } from '../types/library';

interface StatsBarProps {
  desks: Desk[];
  zones: Zone[];
  selectedZoneId: string;
  setSelectedZoneId: (id: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeLayout: 'grid' | 'plan' | 'table';
  setActiveLayout: (layout: 'grid' | 'plan' | 'table') => void;
}

export function StatsBar({
  desks,
  zones,
  selectedZoneId,
  setSelectedZoneId,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  activeLayout,
  setActiveLayout,
}: StatsBarProps) {
  const total = desks.length;
  const available = desks.filter((d) => d.status === 'available').length;
  const occupied = desks.filter((d) => d.status === 'occupied').length;
  const onBreak = desks.filter((d) => d.status === 'on_break').length;
  const pending = desks.filter((d) => d.status === 'reserved_pending').length;

  const now = Date.now();
  const overdueBreaks = desks.filter(
    (d) => d.status === 'on_break' && d.currentUser?.breakEndTime && d.currentUser.breakEndTime < now
  ).length;

  const occupancyRate = total > 0 ? Math.round(((occupied + onBreak) / total) * 100) : 0;

  return (
    <div className="space-y-4 mb-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {/* Total */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Toplam Masa</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{total}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
            %100
          </div>
        </div>

        {/* Available */}
        <div className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-xs flex items-center justify-between bg-gradient-to-br from-white to-emerald-50/40">
          <div>
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Boş (Müsait)
            </p>
            <p className="text-2xl font-extrabold text-emerald-700 mt-0.5">{available}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
            {total > 0 ? Math.round((available / total) * 100) : 0}%
          </div>
        </div>

        {/* Occupied */}
        <div className="bg-white p-3.5 rounded-xl border border-blue-200 shadow-xs flex items-center justify-between bg-gradient-to-br from-white to-blue-50/30">
          <div>
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Dolu (Çalışıyor)</p>
            <p className="text-2xl font-extrabold text-blue-700 mt-0.5">{occupied}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
            {total > 0 ? Math.round((occupied / total) * 100) : 0}%
          </div>
        </div>

        {/* On Break */}
        <div className={`p-3.5 rounded-xl border shadow-xs flex items-center justify-between transition-all ${
          overdueBreaks > 0
            ? 'bg-red-50/90 border-red-300 ring-2 ring-red-400/40'
            : 'bg-gradient-to-br from-white to-amber-50/40 border-amber-200'
        }`}>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
              overdueBreaks > 0 ? 'text-red-700' : 'text-amber-700'
            }`}>
              {overdueBreaks > 0 ? (
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-red-600 text-white font-bold animate-pulse">
                  {overdueBreaks} AŞIM
                </span>
              ) : null}
              Molada
            </p>
            <p className={`text-2xl font-extrabold mt-0.5 ${overdueBreaks > 0 ? 'text-red-700' : 'text-amber-800'}`}>
              {onBreak}
            </p>
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs ${
            overdueBreaks > 0 ? 'bg-red-200 text-red-900' : 'bg-amber-100 text-amber-900'
          }`}>
            {total > 0 ? Math.round((onBreak / total) * 100) : 0}%
          </div>
        </div>

        {/* Occupancy Rate Bar */}
        <div className="col-span-2 sm:col-span-4 lg:col-span-1 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-500 uppercase">Doluluk Oranı</span>
            <span className="font-bold text-indigo-700 text-sm">%{occupancyRate}</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full transition-all duration-500 ${
                occupancyRate > 85 ? 'bg-red-500' : occupancyRate > 65 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {pending > 0 ? `${pending} masa onay bekliyor` : 'Kütüphane anlık durumu'}
          </p>
        </div>
      </div>

      {/* Control Bar: Filters, Search & Layout */}
      <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Left: Zone Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedZoneId('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedZoneId === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tüm Salonlar ({desks.length})
          </button>
          {zones.map((zone) => {
            const count = desks.filter((d) => d.zoneId === zone.id).length;
            const isSelected = selectedZoneId === zone.id;
            return (
              <button
                key={zone.id}
                onClick={() => setSelectedZoneId(zone.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {zone.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Right: Search, Status filter, View Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Masa No veya İsim ara..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2 py-1 rounded-md font-medium transition-all ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setStatusFilter('available')}
              className={`px-2 py-1 rounded-md font-medium transition-all ${
                statusFilter === 'available'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 hover:text-emerald-900'
              }`}
            >
              Boş ({available})
            </button>
            <button
              onClick={() => setStatusFilter('occupied')}
              className={`px-2 py-1 rounded-md font-medium transition-all ${
                statusFilter === 'occupied'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-blue-700 hover:text-blue-900'
              }`}
            >
              Dolu ({occupied})
            </button>
            <button
              onClick={() => setStatusFilter('on_break')}
              className={`px-2 py-1 rounded-md font-medium transition-all ${
                statusFilter === 'on_break'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-800 hover:text-amber-950'
              }`}
            >
              Molada ({onBreak})
            </button>
          </div>

          {/* View Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-slate-600">
            <button
              onClick={() => setActiveLayout('grid')}
              className={`p-1.5 rounded-md transition-all ${
                activeLayout === 'grid' ? 'bg-white text-indigo-700 shadow-xs' : 'hover:text-slate-900'
              }`}
              title="Kart Izgarası Görünümü"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveLayout('plan')}
              className={`p-1.5 rounded-md transition-all ${
                activeLayout === 'plan' ? 'bg-white text-indigo-700 shadow-xs' : 'hover:text-slate-900'
              }`}
              title="Salon Masa Krokisi Görünümü"
            >
              <Map className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveLayout('table')}
              className={`p-1.5 rounded-md transition-all ${
                activeLayout === 'table' ? 'bg-white text-indigo-700 shadow-xs' : 'hover:text-slate-900'
              }`}
              title="Tablo Listesi Görünümü"
            >
              <Table className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
