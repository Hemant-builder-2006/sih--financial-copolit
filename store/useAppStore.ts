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

type AppState = {
  aiSummary: string | null;
  alerts: Alert[];
  chartData: ChartDatum[];
  tradingSignals: TradingSignal[];
  setAiSummary: (summary: string) => void;
  addAlert: (message: string, severity: 'info' | 'warning' | 'danger') => void;
  clearAlerts: () => void;
  removeAlert: (id: string) => void;
  setChartData: (data: ChartDatum[]) => void;
  setTradingSignals: (signals: TradingSignal[]) => void;
  resetStore: () => void;
};

export const useAppStore = create<AppState>((set, get) => ({
  aiSummary: null,
  alerts: [],
  chartData: [],
  tradingSignals: [],
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
  resetStore: () => set({
    aiSummary: null,
    alerts: [],
    chartData: [],
    tradingSignals: [],
  }),
}));
