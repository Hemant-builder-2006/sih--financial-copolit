import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

interface KPIData {
  revenue: number;
  expenses: number;
  profit: number;
  roi: number;
  lastUpdated: string;
}

interface KPIResponse {
  success: boolean;
  data?: KPIData;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<KPIResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Get all nodes with financial data
    const nodes = await prisma.node.findMany({
      where: {
        OR: [
          { type: 'csv' },
          { type: 'pdf' },
          { type: 'shopify' }
        ]
      }
    });

    let totalRevenue = 0;
    let totalExpenses = 0;
    let profit = 0;
    let roi = 0;

    // Process nodes to calculate KPIs
    for (const node of nodes) {
      if (!node.content) continue;

      try {
        const content = JSON.parse(node.content);

        if (node.type === 'csv') {
          // Look for financial data in CSV
          const { headers, rows } = content;
          if (headers && rows) {
            const revenueCol = headers.findIndex((h: string) => 
              /revenue|sales|income|total/i.test(h)
            );
            const expenseCol = headers.findIndex((h: string) => 
              /expense|cost|spend/i.test(h)
            );

            if (revenueCol >= 0) {
              rows.forEach((row: any[]) => {
                const value = parseFloat(row[revenueCol]);
                if (!isNaN(value)) totalRevenue += value;
              });
            }

            if (expenseCol >= 0) {
              rows.forEach((row: any[]) => {
                const value = parseFloat(row[expenseCol]);
                if (!isNaN(value)) totalExpenses += value;
              });
            }
          }
        } else if (node.type === 'shopify' && content.orders) {
          // Extract revenue from Shopify orders
          content.orders.recent?.forEach((order: any) => {
            const value = parseFloat(order.total_price);
            if (!isNaN(value)) totalRevenue += value;
          });
        }
      } catch (parseError) {
        console.warn(`Failed to parse node ${node.id}:`, parseError);
      }
    }

    // Calculate derived metrics
    profit = totalRevenue - totalExpenses;
    roi = totalRevenue > 0 ? ((profit / totalRevenue) * 100) : 0;

    // Save calculated KPIs to database
    const kpiData = {
      revenue: totalRevenue,
      expenses: totalExpenses,
      profit,
      roi
    };

    await prisma.dashboardKPI.create({
      data: kpiData
    });

    res.status(200).json({
      success: true,
      data: {
        ...kpiData,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('KPI calculation error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to calculate KPIs'
    });
  }
}