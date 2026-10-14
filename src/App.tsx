import { useState, useEffect, useMemo, useRef } from 'react';
import { Desk, Zone, LibrarySettings, SessionLog } from './types/library';
import { storage } from './utils/storage';
import { sounds } from './utils/sound';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { DeskCard } from './components/DeskCard';
import { DeskPlanView } from './components/DeskPlanView';
import { DeskTableView } from './components/DeskTableView';
import { KioskView } from './components/KioskView';
import { AssignDeskModal } from './components/Modals/AssignDeskModal';
import { BreakModal } from './components/Modals/BreakModal';
import { DeskDetailModal } from './components/Modals/DeskDetailModal';
import { AddDeskModal } from './components/Modals/AddDeskModal';
import { HistoryModal } from './components/Modals/HistoryModal';
import { LocalNetworkGuideModal } from './components/Modals/LocalNetworkGuideModal';
import { SettingsModal } from './components/Modals/SettingsModal';
import { Bell, AlertTriangle } from 'lucide-react';

export default function App() {
  // Primary State
  const [desks, setDesks] = useState<Desk[]>(() => storage.getDesks());
  const [zones, setZones] = useState<Zone[]>(() => storage.getZones());
  const [settings, setSettings] = useState<LibrarySettings>(() => storage.getSettings());
  const [history, setHistory] = useState<SessionLog[]>(() => storage.getHistory());

  // Navigation & View Filters
  const [viewMode, setViewMode] = useState<'admin' | 'kiosk'>('admin');
  const [selectedZoneId, setSelectedZoneId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLayout, setActiveLayout] = useState<'grid' | 'plan' | 'table'>('grid');

  // Modals
  const [assignDesk, setAssignDesk] = useState<Desk | null>(null);
  const [breakDesk, setBreakDesk] = useState<Desk | null>(null);
  const [detailDesk, setDetailDesk] = useState<Desk | null>(null);
  const [isAddDeskOpen, setIsAddDeskOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isNetworkGuideOpen, setIsNetworkGuideOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sound ref to prevent repeating alerts
  const alertedBreakIds = useRef<Set<string>>(new Set());

  // Save changes to localStorage automatically
  useEffect(() => {
    storage.setDesks(desks);
  }, [desks]);

  useEffect(() => {
    storage.setSettings(settings);
  }, [settings]);

  // Periodic check for expired breaks & sound alerts
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      desks.forEach((desk) => {
        if (
          desk.status === 'on_break' &&
          desk.currentUser?.breakEndTime &&
          desk.currentUser.breakEndTime < now
        ) {
          if (!alertedBreakIds.current.has(desk.id)) {
            alertedBreakIds.current.add(desk.id);
            if (settings.soundAlerts) {
              sounds.playBreakExpired();
            }
          }
        }
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [desks, settings.soundAlerts]);

  // Desk Actions
  const handleAssignConfirm = (data: {
    name: string;
    phone?: string;
    memberId?: string;
    expectedDurationHours?: number;
    notes?: string;
  }) => {
    if (!assignDesk) return;

    setDesks((prev) =>
      prev.map((d) => {
        if (d.id !== assignDesk.id) return d;
        return {
          ...d,
          status: 'occupied',
          pendingVisitorName: undefined,
          pendingVisitorPhone: undefined,
          pendingAt: undefined,
          currentUser: {
            name: data.name,
            phone: data.phone,
            memberId: data.memberId,
            checkInTime: Date.now(),
            expectedDurationHours: data.expectedDurationHours,
            notes: data.notes,
            breakHistory: [],
          },
        };
      })
    );

    if (settings.soundAlerts) sounds.playSuccess();
    setAssignDesk(null);
  };

  const handleStartBreakConfirm = (durationMinutes: number, reason: string) => {
    if (!breakDesk || !breakDesk.currentUser) return;
    const now = Date.now();
    const breakEndTime = now + durationMinutes * 60 * 1000;

    // Reset alert tracking for this desk
    alertedBreakIds.current.delete(breakDesk.id);

    setDesks((prev) =>
      prev.map((d) => {
        if (d.id !== breakDesk.id || !d.currentUser) return d;
        return {
          ...d,
          status: 'on_break',
          currentUser: {
            ...d.currentUser,
            breakStartTime: now,
            breakDurationMinutes: durationMinutes,
            breakEndTime,
            breakReason: reason,
          },
        };
      })
    );

    if (settings.soundAlerts) sounds.playBreakStart();
    setBreakDesk(null);
  };

  const handleEndBreak = (desk: Desk) => {
    if (!desk.currentUser) return;
    const now = Date.now();
    const breakDuration = desk.currentUser.breakStartTime
      ? Math.round((now - desk.currentUser.breakStartTime) / (1000 * 60))
      : desk.currentUser.breakDurationMinutes || 15;

    const breakItem = {
      start: desk.currentUser.breakStartTime || now - breakDuration * 60 * 1000,
      end: now,
      durationMinutes: breakDuration,
      reason: desk.currentUser.breakReason,
    };

    alertedBreakIds.current.delete(desk.id);

    setDesks((prev) =>
      prev.map((d) => {
        if (d.id !== desk.id || !d.currentUser) return d;
        const historyList = d.currentUser.breakHistory || [];
        return {
          ...d,
          status: 'occupied',
          currentUser: {
            ...d.currentUser,
            breakStartTime: undefined,
            breakDurationMinutes: undefined,
            breakEndTime: undefined,
            breakReason: undefined,
            breakHistory: [...historyList, breakItem],
          },
        };
      })
    );

    if (settings.soundAlerts) sounds.playSuccess();
  };

  const handleExtendBreak = (desk: Desk, minutes: number) => {
    if (!desk.currentUser?.breakEndTime) return;
    alertedBreakIds.current.delete(desk.id);

    setDesks((prev) =>
      prev.map((d) => {
        if (d.id !== desk.id || !d.currentUser) return d;
        const currentEnd = d.currentUser.breakEndTime || Date.now();
        const newEnd = Math.max(Date.now(), currentEnd) + minutes * 60 * 1000;
        return {
          ...d,
          status: 'on_break',
          currentUser: {
            ...d.currentUser,
            breakEndTime: newEnd,
            breakDurationMinutes: (d.currentUser.breakDurationMinutes || 0) + minutes,
          },
        };
      })
    );
  };

  const handleRelease = (desk: Desk) => {
    const user = desk.currentUser;
    const now = Date.now();

    if (user) {
      const zone = zones.find((z) => z.id === desk.zoneId);
      const totalMinutes = Math.max(1, Math.round((now - user.checkInTime) / (1000 * 60)));

      // Calculate total break time
      let totalBreak = (user.breakHistory || []).reduce(
        (acc, item) => acc + item.durationMinutes,
        0
      );
      if (desk.status === 'on_break' && user.breakStartTime) {
        totalBreak += Math.round((now - user.breakStartTime) / (1000 * 60));
      }

      const logItem: SessionLog = {
        id: `log-${Date.now()}`,
        deskNumber: desk.number,
        zoneName: zone?.name || 'Salon',
        userName: user.name,
        userPhone: user.phone,
        memberId: user.memberId,
        checkInTime: user.checkInTime,
        checkOutTime: now,
        totalDurationMinutes: totalMinutes,
        totalBreakMinutes: totalBreak,
        notes: user.notes,
      };

      storage.addHistoryLog(logItem);
      setHistory((prev) => [logItem, ...prev]);
    }

    alertedBreakIds.current.delete(desk.id);

    setDesks((prev) =>
      prev.map((d) => {
        if (d.id !== desk.id) return d;
        return {
          ...d,
          status: 'available',
          currentUser: undefined,
          pendingVisitorName: undefined,
          pendingVisitorPhone: undefined,
          pendingAt: undefined,
        };
      })
    );

    if (settings.soundAlerts) sounds.playSuccess();
  };

  const handleSelectDeskForVisitor = (
    desk: Desk,
    visitorName: string,
    visitorPhone?: string
  ) => {
    setDesks((prev) =>
      prev.map((d) => {
        if (d.id !== desk.id) return d;
        return {
          ...d,
          status: 'reserved_pending',
          pendingVisitorName: visitorName,
          pendingVisitorPhone: visitorPhone,
          pendingAt: Date.now(),
        };
      })
    );
    if (settings.soundAlerts) sounds.playSuccess();
  };

  const handleApprovePending = (desk: Desk) => {
    setAssignDesk(desk);
  };

  const handleCancelPending = (desk: Desk) => {
    setDesks((prev) =>
      prev.map((d) => {
        if (d.id !== desk.id) return d;
        return {
          ...d,
          status: 'available',
          pendingVisitorName: undefined,
          pendingVisitorPhone: undefined,
          pendingAt: undefined,
        };
      })
    );
  };

  const handleUpdateDeskUser = (
    deskId: string,
    updated: { name: string; phone?: string; notes?: string }
  ) => {
    setDesks((prev) =>
      prev.map((d) => {
        if (d.id !== deskId || !d.currentUser) return d;
        return {
          ...d,
          currentUser: {
            ...d.currentUser,
            name: updated.name,
            phone: updated.phone,
            notes: updated.notes,
          },
        };
      })
    );
  };

  const handleToggleOutOfService = (deskId: string) => {
    setDesks((prev) =>
      prev.map((d) => {
        if (d.id !== deskId) return d;
        if (d.status === 'out_of_service') {
          return { ...d, status: 'available' };
        }
        return { ...d, status: 'out_of_service', currentUser: undefined };
      })
    );
  };

  const handleAddDesk = (newDesk: Desk) => {
    setDesks((prev) => [...prev, newDesk]);
  };

  const handleExportBackup = () => {
    const jsonStr = storage.exportBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `kutuphane_masa_yedek_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetData = () => {
    const fresh = storage.resetAll();
    setDesks(fresh.desks);
    setZones(fresh.zones);
    setSettings(fresh.settings);
    setHistory([]);
    alertedBreakIds.current.clear();
  };

  // Filtered Desks for Admin
  const filteredDesks = useMemo(() => {
    return desks.filter((desk) => {
      if (selectedZoneId !== 'all' && desk.zoneId !== selectedZoneId) return false;
      if (statusFilter !== 'all' && desk.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNumber = desk.number.toLowerCase().includes(q);
        const matchesUser = desk.currentUser?.name.toLowerCase().includes(q);
        const matchesPhone = desk.currentUser?.phone?.includes(q);
        const matchesPending = desk.pendingVisitorName?.toLowerCase().includes(q);
        if (!matchesNumber && !matchesUser && !matchesPhone && !matchesPending) {
          return false;
        }
      }
      return true;
    });
  }, [desks, selectedZoneId, statusFilter, searchQuery]);

  const pendingRequests = desks.filter((d) => d.status === 'reserved_pending');
  const now = Date.now();
  const overdueBreaks = desks.filter(
    (d) => d.status === 'on_break' && d.currentUser?.breakEndTime && d.currentUser.breakEndTime < now
  );

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        settings={settings}
        onUpdateSettings={setSettings}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenNetworkGuide={() => setIsNetworkGuideOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAddDesk={() => setIsAddDeskOpen(true)}
        onExportBackup={handleExportBackup}
        pendingRequestsCount={pendingRequests.length}
      />

      {/* Main View Area */}
      {viewMode === 'kiosk' ? (
        <KioskView
          desks={desks}
          zones={zones}
          onSelectDeskForVisitor={handleSelectDeskForVisitor}
          onExitKiosk={() => setViewMode('admin')}
        />
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
          {/* Action Alert Banner for Pending Requests from Kiosk */}
          {pendingRequests.length > 0 && (
            <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">
                    {pendingRequests.length} Yeni Masa Rezervasyon / Seçim Talebi Var!
                  </h3>
                  <p className="text-xs text-purple-100">
                    Kullanıcı kiosk ekranından masa seçti ve onay için danışmaya geliyor.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {pendingRequests.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => handleApprovePending(d)}
                    className="px-3 py-1.5 rounded-xl bg-white text-purple-900 hover:bg-purple-50 text-xs font-bold transition-all shadow-xs"
                  >
                    Masa {d.number} ({d.pendingVisitorName}) → Onayla
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Overdue Break Banner */}
          {overdueBreaks.length > 0 && (
            <div className="mb-4 p-3.5 rounded-2xl bg-red-50 border border-red-300 text-red-950 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                <span className="text-xs font-semibold">
                  <strong>{overdueBreaks.length}</strong> masada mola süresi aşıldı! Masayı boşaltabilir veya süreyi uzatabilirsiniz:
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {overdueBreaks.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDetailDesk(d)}
                    className="px-2.5 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs font-bold transition-colors"
                  >
                    Masa {d.number} ({d.currentUser?.name})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stats Bar */}
          <StatsBar
            desks={desks}
            zones={zones}
            selectedZoneId={selectedZoneId}
            setSelectedZoneId={setSelectedZoneId}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeLayout={activeLayout}
            setActiveLayout={setActiveLayout}
          />

          {/* Content Layout Switch */}
          {activeLayout === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredDesks.map((desk) => {
                const zone = zones.find((z) => z.id === desk.zoneId);
                return (
                  <DeskCard
                    key={desk.id}
                    desk={desk}
                    zone={zone}
                    onAssign={() => setAssignDesk(desk)}
                    onStartBreak={() => setBreakDesk(desk)}
                    onEndBreak={handleEndBreak}
                    onExtendBreak={handleExtendBreak}
                    onRelease={handleRelease}
                    onApprovePending={handleApprovePending}
                    onCancelPending={handleCancelPending}
                    onClickDetail={() => setDetailDesk(desk)}
                  />
                );
              })}
            </div>
          )}

          {activeLayout === 'plan' && (
            <DeskPlanView
              desks={filteredDesks}
              zones={zones}
              selectedZoneId={selectedZoneId}
              onSelectDesk={(desk) => setDetailDesk(desk)}
            />
          )}

          {activeLayout === 'table' && (
            <DeskTableView
              desks={filteredDesks}
              zones={zones}
              onAssign={(d) => setAssignDesk(d)}
              onStartBreak={(d) => setBreakDesk(d)}
              onEndBreak={handleEndBreak}
              onRelease={handleRelease}
              onClickDetail={(d) => setDetailDesk(d)}
            />
          )}

          {filteredDesks.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
              <p className="text-sm font-semibold">Aradığınız kriterlere uygun masa bulunamadı.</p>
              <button
                onClick={() => {
                  setSelectedZoneId('all');
                  setStatusFilter('all');
                  setSearchQuery('');
                }}
                className="mt-3 text-xs text-indigo-600 hover:text-indigo-800 font-bold"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}
        </main>
      )}

      {/* MODALS */}
      <AssignDeskModal
        desk={assignDesk}
        zone={zones.find((z) => z.id === assignDesk?.zoneId)}
        isOpen={!!assignDesk}
        onClose={() => setAssignDesk(null)}
        onConfirm={handleAssignConfirm}
      />

      <BreakModal
        desk={breakDesk}
        isOpen={!!breakDesk}
        onClose={() => setBreakDesk(null)}
        onConfirm={handleStartBreakConfirm}
      />

      <DeskDetailModal
        desk={detailDesk}
        zone={zones.find((z) => z.id === detailDesk?.zoneId)}
        isOpen={!!detailDesk}
        onClose={() => setDetailDesk(null)}
        onStartBreak={(d) => {
          setDetailDesk(null);
          setBreakDesk(d);
        }}
        onEndBreak={handleEndBreak}
        onExtendBreak={handleExtendBreak}
        onRelease={(d) => {
          handleRelease(d);
          setDetailDesk(null);
        }}
        onAssign={(d) => {
          setDetailDesk(null);
          setAssignDesk(d);
        }}
        onUpdateDeskUser={handleUpdateDeskUser}
        onToggleOutOfService={handleToggleOutOfService}
      />

      <AddDeskModal
        zones={zones}
        isOpen={isAddDeskOpen}
        onClose={() => setIsAddDeskOpen(false)}
        onAddDesk={handleAddDesk}
        existingDeskNumbers={desks.map((d) => d.number)}
      />

      <HistoryModal
        logs={history}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onClearHistory={() => {
          storage.clearHistory();
          setHistory([]);
        }}
      />

      <LocalNetworkGuideModal
        isOpen={isNetworkGuideOpen}
        onClose={() => setIsNetworkGuideOpen(false)}
      />

      <SettingsModal
        settings={settings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaveSettings={setSettings}
        onExportBackup={handleExportBackup}
        onImportBackup={(jsonStr) => storage.importBackup(jsonStr)}
        onResetData={handleResetData}
      />
    </div>
  );
}
