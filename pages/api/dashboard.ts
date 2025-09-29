import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

interface DashboardData {
  kpis: Array<{
    metric: string;
    value: string;
    change?: string;
  }>;
  aiSummary: string;
  tradingSignals: Array<{
    id: string;
    signal: 'Buy' | 'Sell' | 'Hold';
  }>;
  chartData: Array<{
    name: string;
    value: number;
  }>;
  alerts: Array<{
    message: string;
    severity: 'info' | 'warning' | 'danger';
  }>;
}

interface DashboardResponse {
  success: boolean;
  data?: DashboardData;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DashboardResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Get latest KPIs
    const latestKPI = await prisma.dashboardKPI.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    // Get latest AI insight
    const latestAIInsight = await prisma.aiInsight.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    // Get historical KPIs for performance chart
    const historicalKPIs = await prisma.dashboardKPI.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30 // Last 30 records
    });

    // Get all nodes for alerts
    const nodes = await prisma.node.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Calculate KPIs (fallback if none exist)
    const rawKpis = latestKPI ? {
      revenue: latestKPI.revenue || 0,
      expenses: latestKPI.expenses || 0,
      profit: latestKPI.profit || 0,
      roi: latestKPI.roi || 0
    } : {
      revenue: 0,
      expenses: 0,
      profit: 0,
      roi: 0
    };

    // Format KPIs for frontend
    const kpis = [
      { metric: "Revenue", value: `$${rawKpis.revenue.toLocaleString()}`, change: "+5.2%" },
      { metric: "Expenses", value: `$${rawKpis.expenses.toLocaleString()}`, change: "-2.1%" },
      { metric: "Profit", value: `$${rawKpis.profit.toLocaleString()}`, change: rawKpis.profit >= 0 ? "+8.7%" : "-12.3%" },
      { metric: "ROI", value: `${rawKpis.roi.toFixed(1)}%`, change: "+3.2%" },
    ];

    // AI Summary
    const aiSummary = latestAIInsight?.summary || 
      'No AI analysis available. Connect data nodes to an AI node to generate insights.';

    // Trading Signals based on profit margin
    const profitMargin = rawKpis.revenue > 0 ? (rawKpis.profit / rawKpis.revenue) * 100 : 0;
    let tradingSignals;

    if (profitMargin > 20) {
      tradingSignals = [
        { id: "1", signal: 'Buy' as const }
      ];
    } else if (profitMargin > 10) {
      tradingSignals = [
        { id: "1", signal: 'Hold' as const }
      ];
    } else {
      tradingSignals = [
        { id: "1", signal: 'Sell' as const }
      ];
    }

    // Chart Data from performance history
    const chartData = historicalKPIs.reverse().slice(-6).map((kpi, index) => ({
      name: new Date(kpi.createdAt).toLocaleDateString('en-US', { month: 'short' }),
      value: kpi.profit || 0
    }));

    // If no historical data, provide sample data
    if (chartData.length === 0) {
      chartData.push(
        { name: "Jan", value: 120 },
        { name: "Feb", value: 150 },
        { name: "Mar", value: 90 },
        { name: "Apr", value: 200 },
        { name: "May", value: 170 },
        { name: "Jun", value: 220 }
      );
    }

    // Alerts
    const alerts = nodes.map((node) => ({
      message: `${node.type.toUpperCase()} node data processed`,
      severity: 'info' as 'info' | 'warning' | 'danger'
    }));

    // Add system alerts
    if (rawKpis.profit < 0) {
      alerts.unshift({
        message: 'Negative profit detected - review expenses',
        severity: 'warning' as 'info' | 'warning' | 'danger'
      });
    }

    if (latestAIInsight && new Date().getTime() - new Date(latestAIInsight.createdAt).getTime() < 300000) {
      alerts.unshift({
        message: 'New AI analysis available',
        severity: 'info' as 'info' | 'warning' | 'danger'
      });
    }

    const dashboardData: DashboardData = {
      kpis,
      aiSummary,
      tradingSignals,
      chartData,
      alerts: alerts.slice(0, 5) // Limit to 5 most recent alerts
    };

    res.status(200).json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch dashboard data'
    });
  }
}