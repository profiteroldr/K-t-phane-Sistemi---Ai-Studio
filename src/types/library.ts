export type DeskStatus = 'available' | 'occupied' | 'on_break' | 'reserved_pending' | 'out_of_service';

export type DeskFeature = 'power' | 'window' | 'pc' | 'lamp' | 'quiet' | 'double';

export interface DeskCurrentUser {
  name: string;
  phone?: string;
  memberId?: string;
  checkInTime: number; // Unix timestamp ms
  expectedDurationHours?: number;
  notes?: string;
  // Break details
  breakStartTime?: number;
  breakDurationMinutes?: number;
  breakEndTime?: number;
  breakReason?: string;
  breakHistory?: {
    start: number;
    end: number;
    durationMinutes: number;
    reason?: string;
  }[];
}

export interface Desk {
  id: string;
  number: string;
  zoneId: string;
  features: DeskFeature[];
  status: DeskStatus;
  currentUser?: DeskCurrentUser;
  pendingVisitorName?: string; // Visitor selected on Kiosk screen
  pendingVisitorPhone?: string;
  pendingAt?: number;
  row?: number;
  col?: number;
}

export interface Zone {
  id: string;
  name: string;
  floor: string;
  description: string;
  iconName?: string;
  color: string;
}

export interface SessionLog {
  id: string;
  deskNumber: string;
  zoneName: string;
  userName: string;
  userPhone?: string;
  memberId?: string;
  checkInTime: number;
  checkOutTime: number;
  totalDurationMinutes: number;
  totalBreakMinutes: number;
  notes?: string;
}

export interface LibrarySettings {
  libraryName: string;
  defaultBreakMinutes: number;
  maxBreakMinutes: number;
  soundAlerts: boolean;
  kioskSelfSelection: boolean;
}
