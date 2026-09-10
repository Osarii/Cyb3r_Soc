import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Attack, Incident } from '../../types';
import { initialIncidents } from '../../data';

type AIState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'ERROR';
type Store = {
  attacks: Attack[];
  incidents: Incident[];
  logs: string[];
  aiState: AIState;
  systemStatus: 'ONLINE' | 'OFFLINE';
  addAttack: (type: string) => Attack;
  setAttackStatus: (id: string, status: Attack['status']) => void;
  resolveAttack: (id: string) => void;
  setAIState: (state: AIState) => void;
  setSystemStatus: (status: 'ONLINE' | 'OFFLINE') => void;
};

const paths: Record<string, [[number, number], [number, number]]> = {
  DDoS: [[-74, 40], [-3, 40]],
  'Brute Force': [[103, 1], [-3, 40]],
  Ransomware: [[37, 55], [-3, 40]],
  Phishing: [[139, 35], [-3, 40]],
  'Port Scan': [[-43, -22], [-3, 40]],
  'Data Exfiltration': [[-3, 40], [77, 28]],
};

export const useSOCStore = create<Store>()(persist((set) => ({
  attacks: [],
  incidents: initialIncidents,
  logs: ['[INFO] Telemetría global sincronizada', '[INFO] Motores de detección operativos'],
  aiState: 'IDLE',
  systemStatus: 'ONLINE',
  addAttack: (type) => {
    const coordinates = paths[type] ?? paths.DDoS;
    const stamp = Date.now().toString();
    const id = `ATK-${stamp.slice(-5)}`;
    const incidentId = `INC-${stamp.slice(-4)}`;
    const startedAt = new Date().toLocaleTimeString('es-CR');
    const attack: Attack = {
      id,
      incidentId,
      type,
      source: '203.0.113.84',
      destination: '198.51.100.10',
      sourceCoordinates: coordinates[0],
      destinationCoordinates: coordinates[1],
      severity: type === 'DDoS' ? 'Critical' : 'High',
      startedAt,
      duration: 18,
      progress: 0,
      status: 'IN TRANSIT',
    };
    const incident: Incident = {
      id: incidentId,
      severity: attack.severity,
      title: `Simulación ${type} detectada`,
      attackType: type,
      source: attack.source,
      target: attack.destination,
      asset: type === 'DDoS' ? 'FW-EDGE-01' : 'SRV-APP-03',
      status: 'Active',
      detectedAt: startedAt,
    };
    set((state) => ({
      attacks: [...state.attacks, attack],
      incidents: [incident, ...state.incidents],
      logs: [`[WARN] ${type} simulado iniciado`, ...state.logs],
    }));
    return attack;
  },
  setAttackStatus: (id, status) => set((state) => {
    const attack = state.attacks.find((item) => item.id === id);
    return {
      attacks: state.attacks.map((item) => item.id === id ? { ...item, status } : item),
      incidents: state.incidents.map((item) => item.id === attack?.incidentId && status === 'CONTAINED' ? { ...item, status: 'Contained' } : item),
      logs: [`[INFO] ${id} → ${status}`, ...state.logs],
    };
  }),
  resolveAttack: (id) => set((state) => {
    const attack = state.attacks.find((item) => item.id === id);
    return {
      attacks: state.attacks.map((item) => item.id === id ? { ...item, status: 'NEUTRALIZED', progress: 100 } : item),
      incidents: state.incidents.map((item) => item.id === attack?.incidentId ? { ...item, status: 'Resolved' } : item),
      logs: [`[INFO] ${id} neutralizado; incidente ${attack?.incidentId ?? 'asociado'} resuelto`, ...state.logs],
    };
  }),
  setAIState: (aiState) => set({ aiState }),
  setSystemStatus: (systemStatus) => set({ systemStatus }),
}), {
  name: 'cyb3r_soc-state',
  partialize: (state) => ({ incidents: state.incidents, logs: state.logs }),
}));
