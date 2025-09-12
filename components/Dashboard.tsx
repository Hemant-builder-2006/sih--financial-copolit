import React, { useEffect, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { RefreshCw, TrendingUp, AlertTriangle, Brain, DollarSign, X, Trash2 } from "lucide-react";

const mockBIData = [
  { metric: "Revenue", value: "$12,000", change: "+5.2%" },
  { metric: "Expenses", value: "$7,500", change: "-2.1%" },
  { metric: "Profit", value: "$4,500", change: "+8.7%" },
  { metric: "ROI", value: "37.5%", change: "+3.2%" },
];

const severityColors = {
  info: "bg-blue-50 text-blue-700 border-blue-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-red-50 text-red-700 border-red-200",
};

const signalColors = {
  Buy: "bg-green-50 text-green-700 border-green-200",
  Sell: "bg-red-50 text-red-700 border-red-200",
  Hold: "bg-gray-50 text-gray-700 border-gray-200",
};

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const aiSummary = useAppStore((s) => s.aiSummary);
  const alerts = useAppStore((s) => s.alerts);
  const chartData = useAppStore((s) => s.chartData);
  const tradingSignals = useAppStore((s) => s.tradingSignals);
  const { setChartData, setTradingSignals, addAlert, clearAlerts, removeAlert } = useAppStore();

  // Dark mode detection
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  const loadMockData = async () => {
    setIsLoading(true);
    try {
      // Fetch data from APIs
      const [alertsRes, chartRes, signalsRes] = await Promise.all([
        fetch('/api/alerts'),
        fetch('/api/chart'),
        fetch('/api/signals')
      ]);
      
      const alertsData = await alertsRes.json();
      const chartData = await chartRes.json();
      const signalsData = await signalsRes.json();
      
      // Update store with API data
      alertsData.forEach((alert: any) => addAlert(alert.message, alert.severity));
      setChartData(chartData);
      setTradingSignals(signalsData);
      
      addAlert("Market data refreshed from APIs", "info");
    } catch (error) {
      // Fallback to mock data if APIs fail
      setChartData([
        { name: "Jan", value: 120 },
        { name: "Feb", value: 150 },
        { name: "Mar", value: 90 },
        { name: "Apr", value: 200 },
        { name: "May", value: 170 },
        { name: "Jun", value: 220 },
      ]);
      setTradingSignals([
        { id: "1", signal: "Buy" },
        { id: "2", signal: "Hold" },
        { id: "3", signal: "Sell" },
      ]);
      addAlert("Using cached data - API unavailable", "warning");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (chartData.length === 0) {
      loadMockData();
    }
  }, []);

  return (
    <div className={`min-h-screen p-6 pt-20 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-gray-50 to-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Financial Dashboard</h1>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Monitor your AI-powered trading insights and analytics</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {mockBIData.map((item) => (
            <div key={item.metric} className={`rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>{item.metric}</p>
                  <p className={`text-2xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{item.value}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">{item.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Summary Card */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-500" />
                <h2 className="text-lg font-semibold text-gray-900">AI Summary</h2>
              </div>
              <button
                onClick={loadMockData}
                disabled={isLoading}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 min-h-[100px] flex items-center">
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                  <span className="text-gray-600">Analyzing data...</span>
                </div>
              ) : (
                <p className="text-gray-700">{aiSummary || "No AI summary available yet. Connect Canvas nodes to generate insights."}</p>
              )}
            </div>
          </div>

          {/* Trading Signals Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <DollarSign className="h-5 w-5 text-green-500" />
              <h2 className="text-lg font-semibold text-gray-900">Trading Signals</h2>
            </div>
            <div className="space-y-3">
              {tradingSignals.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No signals available</p>
              ) : (
                tradingSignals.map((signal) => (
                  <div
                    key={signal.id}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium ${signalColors[signal.signal]}`}
                  >
                    {signal.signal} Signal
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Charts Card */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h2>
            {chartData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No chart data available</p>
                </div>
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Alerts Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-semibold text-gray-900">Alerts</h2>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                  {alerts.length}
                </span>
              </div>
              {alerts.length > 0 && (
                <button
                  onClick={clearAlerts}
                  className="text-gray-500 hover:text-red-600 transition-colors"
                  title="Clear all alerts"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {alerts.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No alerts</p>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm ${severityColors[alert.severity]}`}
                  >
                    <span>{alert.message}</span>
                    <button
                      onClick={() => removeAlert(alert.id)}
                      className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
