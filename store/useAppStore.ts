import { create } from 'zustand';

export type Alert = {
  id: string;
  message: string;
  severity: 'info' | 'warning' | 'danger';
};

export type ChartDatum = {
  name: string;
  value: number;
};

export type TradingSignal = {
  id: string;
  signal: 'Buy' | 'Sell' | 'Hold';
};

export type BiChart = {
  id: string;
  type: 'line' | 'bar' | 'pie';
  title: string;
  data: any[];
  config: {
    xKey?: string;
    yKey?: string;
    nameKey?: string;
    valueKey?: string;
    xLabel?: string;
    yLabel?: string;
    label?: string;
  };
};

export type BiData = {
  table: Record<string, any>[];
  charts: BiChart[];
  insights: string;
  metadata?: {
    fileName?: string;
    nodeId?: string;
    boardId?: string;
    rowCount: number;
    columnCount: number;
    analyzedAt: string;
    userId: string;
  };
};

type AppState = {
  aiSummary: string | null;
  alerts: Alert[];
  chartData: ChartDatum[];
  tradingSignals: TradingSignal[];
  biData: BiData | null;
  setAiSummary: (summary: string) => void;
  addAlert: (message: string, severity: 'info' | 'warning' | 'danger') => void;
  clearAlerts: () => void;
  removeAlert: (id: string) => void;
  setChartData: (data: ChartDatum[]) => void;
  setTradingSignals: (signals: TradingSignal[]) => void;
  setBiData: (data: BiData | null) => void;
  resetStore: () => void;
};

export const useAppStore = create<AppState>((set, get) => ({
  aiSummary: null,
  alerts: [],
  chartData: [],
  tradingSignals: [],
  biData: null,
  setAiSummary: (summary) => set({ aiSummary: summary }),
  addAlert: (message, severity) => set((state) => ({
    alerts: [
      ...state.alerts,
      { id: Date.now().toString(), message, severity },
    ],
  })),
  clearAlerts: () => set({ alerts: [] }),
  removeAlert: (id) => set((state) => ({
    alerts: state.alerts.filter(alert => alert.id !== id),
  })),
  setChartData: (data) => set({ chartData: data }),
  setTradingSignals: (signals) => set({ tradingSignals: signals }),
  setBiData: (data) => set({ biData: data }),
  resetStore: () => set({
    aiSummary: null,
    alerts: [],
    chartData: [],
    tradingSignals: [],
    biData: null,
  }),
}));
