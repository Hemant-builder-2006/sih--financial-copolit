import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import * as XLSX from 'xlsx';

interface ExportData {
  nodes: any[];
  edges: any[];
  aiInsights: any[];
  kpis: any[];
  exportDate: string;
  version: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { format = 'json' } = req.query;

    // Fetch all data from database
    const [nodes, edges, aiInsights, kpis] = await Promise.all([
      prisma.node.findMany({
        orderBy: { createdAt: 'desc' }
      }),
      prisma.edge.findMany(),
      prisma.aiInsight.findMany({
        include: { node: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.dashboardKPI.findMany({
        orderBy: { createdAt: 'desc' }
      })
    ]);

    const exportData: ExportData = {
      nodes,
      edges,
      aiInsights,
      kpis,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    if (format === 'excel') {
      // Create Excel workbook
      const wb = XLSX.utils.book_new();

      // Nodes sheet
      const nodesSheet = XLSX.utils.json_to_sheet(nodes.map(node => ({
        id: node.id,
        type: node.type,
        contentPreview: node.content ? node.content.substring(0, 100) + '...' : '',
        createdAt: node.createdAt,
        updatedAt: node.updatedAt
      })));
      XLSX.utils.book_append_sheet(wb, nodesSheet, 'Nodes');

      // Edges sheet
      const edgesSheet = XLSX.utils.json_to_sheet(edges);
      XLSX.utils.book_append_sheet(wb, edgesSheet, 'Edges');

      // AI Insights sheet
      const insightsSheet = XLSX.utils.json_to_sheet(aiInsights.map(insight => ({
        id: insight.id,
        nodeId: insight.nodeId,
        summary: insight.summary.substring(0, 500) + '...',
        createdAt: insight.createdAt
      })));
      XLSX.utils.book_append_sheet(wb, insightsSheet, 'AI Insights');

      // KPIs sheet
      const kpisSheet = XLSX.utils.json_to_sheet(kpis);
      XLSX.utils.book_append_sheet(wb, kpisSheet, 'KPIs');

      // Generate Excel buffer
      const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

      // Set headers for Excel download
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=workspace-export-${new Date().toISOString().split('T')[0]}.xlsx`);
      
      return res.send(excelBuffer);
    } else {
      // Return JSON
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=workspace-export-${new Date().toISOString().split('T')[0]}.json`);
      
      return res.status(200).json(exportData);
    }

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to export workspace'
    });
  }
}