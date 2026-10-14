import { Desk, Zone, LibrarySettings, SessionLog } from '../types/library';
import { initialDesks, initialZones, defaultSettings } from '../data/initialData';

const KEYS = {
  DESKS: 'kutuphane_desks_v1',
  ZONES: 'kutuphane_zones_v1',
  SETTINGS: 'kutuphane_settings_v1',
  HISTORY: 'kutuphane_history_v1',
};

export const storage = {
  getDesks(): Desk[] {
    try {
      const data = localStorage.getItem(KEYS.DESKS);
      if (!data) return initialDesks;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : initialDesks;
    } catch (e) {
      console.error('Failed to load desks from localStorage', e);
      return initialDesks;
    }
  },

  setDesks(desks: Desk[]) {
    try {
      localStorage.setItem(KEYS.DESKS, JSON.stringify(desks));
    } catch (e) {
      console.error('Failed to save desks to localStorage', e);
    }
  },

  getZones(): Zone[] {
    try {
      const data = localStorage.getItem(KEYS.ZONES);
      if (!data) return initialZones;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : initialZones;
    } catch {
      return initialZones;
    }
  },

  setZones(zones: Zone[]) {
    try {
      localStorage.setItem(KEYS.ZONES, JSON.stringify(zones));
    } catch (e) {
      console.error('Failed to save zones to localStorage', e);
    }
  },

  getSettings(): LibrarySettings {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      if (!data) return defaultSettings;
      return { ...defaultSettings, ...JSON.parse(data) };
    } catch {
      return defaultSettings;
    }
  },

  setSettings(settings: LibrarySettings) {
    try {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  },

  getHistory(): SessionLog[] {
    try {
      const data = localStorage.getItem(KEYS.HISTORY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  addHistoryLog(log: SessionLog) {
    try {
      const history = this.getHistory();
      const updated = [log, ...history].slice(0, 500); // keep recent 500 logs
      localStorage.setItem(KEYS.HISTORY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  },

  clearHistory() {
    localStorage.removeItem(KEYS.HISTORY);
  },

  resetAll(): { desks: Desk[]; zones: Zone[]; settings: LibrarySettings; history: SessionLog[] } {
    localStorage.removeItem(KEYS.DESKS);
    localStorage.removeItem(KEYS.ZONES);
    localStorage.removeItem(KEYS.SETTINGS);
    localStorage.removeItem(KEYS.HISTORY);
    return {
      desks: initialDesks,
      zones: initialZones,
      settings: defaultSettings,
      history: [],
    };
  },

  exportBackup(): string {
    const backup = {
      exportDate: new Date().toISOString(),
      appName: 'KutuphaneMasaTakip',
      version: '1.0',
      desks: this.getDesks(),
      zones: this.getZones(),
      settings: this.getSettings(),
      history: this.getHistory(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importBackup(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.desks)) {
        this.setDesks(data.desks);
      }
      if (Array.isArray(data.zones)) {
        this.setZones(data.zones);
      }
      if (data.settings && typeof data.settings === 'object') {
        this.setSettings(data.settings);
      }
      if (Array.isArray(data.history)) {
        localStorage.setItem(KEYS.HISTORY, JSON.stringify(data.history));
      }
      return true;
    } catch (e) {
      console.error('Invalid backup file', e);
      return false;
    }
  },
};
