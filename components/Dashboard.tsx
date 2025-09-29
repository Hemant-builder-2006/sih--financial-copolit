import React, { useEffect, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { RefreshCw, TrendingUp, AlertTriangle, Brain, DollarSign, X, Trash2 } from "lucide-react";
import { getDashboardData } from "../lib/api-utils";

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
  const [dashboardData, setDashboardData] = useState<any>(null);
  
  const aiSummary = useAppStore((s) => s.aiSummary);
  const alerts = useAppStore((s) => s.alerts);
  const chartData = useAppStore((s) => s.chartData);
  const tradingSignals = useAppStore((s) => s.tradingSignals);
  const biData = useAppStore((s) => s.biData);
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

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const data = await getDashboardData();
      
      if (data.success && data.data) {
        // Update store with real dashboard data
        if (data.data.chartData) {
          setChartData(data.data.chartData);
        }
        if (data.data.tradingSignals) {
          setTradingSignals(data.data.tradingSignals);
        }
        if (data.data.alerts && data.data.alerts.length > 0) {
          data.data.alerts.forEach((alert: any) => {
            addAlert(alert.message, alert.severity);
          });
        }
        
        // Set the full dashboard data
        setDashboardData(data.data);
        
        addAlert("Dashboard data loaded successfully", "info");
      } else {
        // Fallback to mock data if no real data available
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
        addAlert("Using demo data - connect Canvas nodes for real insights", "warning");
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      addAlert("Error loading dashboard data", "danger");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (chartData.length === 0) {
      loadDashboardData();
    }
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      loadDashboardData();
    }, 300000); // 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  // Also refresh when biData changes (when new files are processed)
  useEffect(() => {
    if (biData) {
      loadDashboardData();
    }
  }, [biData]);

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
          {(dashboardData?.kpis || []).map((item: any) => (
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
                  <span className="text-sm font-medium text-green-600">{item.change || "+0%"}</span>
                </div>
              </div>
            </div>
          ))}
          {(!dashboardData?.kpis || dashboardData.kpis.length === 0) && (
            <div className="col-span-4 text-center py-8 text-gray-500">
              <DollarSign className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No KPI data available</p>
              <p className="text-sm">Upload CSV files or add Shopify nodes in the Canvas to generate KPIs</p>
            </div>
          )}
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
                onClick={loadDashboardData}
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
                <p className="text-gray-700">
                  {dashboardData?.aiSummary || aiSummary || "No AI summary available yet. Connect Canvas nodes to generate insights."}
                </p>
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

        {/* BI Widget */}
        <div className="mt-8">
          <div className={`rounded-xl shadow-sm border p-6 ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <h2 className={`text-lg font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>Business Intelligence</h2>
              </div>
            </div>
            
            {!biData ? (
              <div className={`text-center py-8 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <DollarSign className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No BI data available</p>
                <p className="text-sm">Upload CSV or Excel files in the Canvas to generate business insights</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Data Table */}
                <div>
                  <h3 className={`text-md font-semibold mb-3 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-800'
                  }`}>Data Table</h3>
                  <div className="overflow-x-auto max-h-64 border rounded-lg">
                    <table className={`min-w-full text-sm ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      <thead className={isDarkMode ? 'bg-gray-600' : 'bg-gray-100'}>
                        <tr>
                          {Object.keys(biData.table[0] || {}).map((column) => (
                            <th key={column} className={`px-4 py-2 text-left font-medium ${
                              isDarkMode ? 'text-gray-200' : 'text-gray-700'
                            }`}>
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {biData.table.slice(0, 10).map((row, index) => (
                          <tr key={index} className={`border-b ${
                            isDarkMode ? 'border-gray-600' : 'border-gray-200'
                          }`}>
                            {Object.values(row).map((value: any, cellIndex) => (
                              <td key={cellIndex} className={`px-4 py-2 ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-900'
                              }`}>
                                {value !== null && value !== undefined ? String(value) : '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {biData.table.length > 10 && (
                      <div className={`text-center py-2 text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Showing 10 of {biData.table.length} rows
                      </div>
                    )}
                  </div>
                </div>

                {/* Charts */}
                {biData.charts && biData.charts.length > 0 && (
                  <div>
                    <h3 className={`text-md font-semibold mb-3 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>Charts</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {biData.charts.map((chart) => (
                        <div key={chart.id} className={`p-4 rounded-lg border ${
                          isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                        }`}>
                          <h4 className={`text-sm font-medium mb-3 ${
                            isDarkMode ? 'text-gray-200' : 'text-gray-700'
                          }`}>{chart.title}</h4>
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              {chart.type === 'line' ? (
                                <LineChart data={chart.data}>
                                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#f1f5f9'} />
                                  <XAxis 
                                    dataKey={chart.config.xKey} 
                                    stroke={isDarkMode ? '#9CA3AF' : '#64748b'}
                                    tick={{ fontSize: 12 }}
                                  />
                                  <YAxis 
                                    stroke={isDarkMode ? '#9CA3AF' : '#64748b'}
                                    tick={{ fontSize: 12 }}
                                  />
                                  <Tooltip 
                                    contentStyle={{
                                      backgroundColor: isDarkMode ? '#374151' : 'white',
                                      border: isDarkMode ? '1px solid #4B5563' : '1px solid #e2e8f0',
                                      borderRadius: '8px',
                                      color: isDarkMode ? '#F3F4F6' : '#1F2937'
                                    }}
                                  />
                                  <Line 
                                    type="monotone" 
                                    dataKey={chart.config.yKey} 
                                    stroke="#10B981" 
                                    strokeWidth={2} 
                                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} 
                                  />
                                </LineChart>
                              ) : chart.type === 'bar' ? (
                                <BarChart data={chart.data}>
                                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#374151' : '#f1f5f9'} />
                                  <XAxis 
                                    dataKey={chart.config.xKey} 
                                    stroke={isDarkMode ? '#9CA3AF' : '#64748b'}
                                    tick={{ fontSize: 12 }}
                                  />
                                  <YAxis 
                                    stroke={isDarkMode ? '#9CA3AF' : '#64748b'}
                                    tick={{ fontSize: 12 }}
                                  />
                                  <Tooltip 
                                    contentStyle={{
                                      backgroundColor: isDarkMode ? '#374151' : 'white',
                                      border: isDarkMode ? '1px solid #4B5563' : '1px solid #e2e8f0',
                                      borderRadius: '8px',
                                      color: isDarkMode ? '#F3F4F6' : '#1F2937'
                                    }}
                                  />
                                  <Bar dataKey={chart.config.yKey} fill="#3B82F6" radius={4} />
                                </BarChart>
                              ) : (
                                <PieChart>
                                  <Pie
                                    data={chart.data}
                                    dataKey={chart.config.valueKey}
                                    nameKey={chart.config.nameKey}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label={(entry: any) => `${entry.name} ${((entry.value / chart.data.reduce((sum: number, item: any) => sum + item.value, 0)) * 100).toFixed(0)}%`}
                                  >
                                    {chart.data.map((entry: any, index: number) => {
                                      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];
                                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                                    })}
                                  </Pie>
                                  <Tooltip 
                                    contentStyle={{
                                      backgroundColor: isDarkMode ? '#374151' : 'white',
                                      border: isDarkMode ? '1px solid #4B5563' : '1px solid #e2e8f0',
                                      borderRadius: '8px',
                                      color: isDarkMode ? '#F3F4F6' : '#1F2937'
                                    }}
                                  />
                                </PieChart>
                              )}
                            </ResponsiveContainer>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Insights */}
                <div>
                  <h3 className={`text-md font-semibold mb-3 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-800'
                  }`}>AI Insights</h3>
                  <div className={`p-4 rounded-lg border prose max-w-none ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-300' 
                      : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {biData.insights}
                    </div>
                  </div>
                </div>

                {/* Metadata */}
                {biData.metadata && (
                  <div className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Analysis completed on {new Date(biData.metadata.analyzedAt).toLocaleString()} • 
                    {biData.metadata.rowCount} rows • {biData.metadata.columnCount} columns
                    {biData.metadata.fileName && ` • ${biData.metadata.fileName}`}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
