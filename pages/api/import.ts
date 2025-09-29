import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

interface ImportData {
  nodes?: any[];
  edges?: any[];
  aiInsights?: any[];
  kpis?: any[];
}

interface ImportResponse {
  success: boolean;
  imported?: {
    nodes: number;
    edges: number;
    aiInsights: number;
    kpis: number;
  };
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ImportResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const importData: ImportData = req.body;
    
    if (!importData || typeof importData !== 'object') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid import data format' 
      });
    }

    let importedCounts = {
      nodes: 0,
      edges: 0,
      aiInsights: 0,
      kpis: 0
    };

    // Import nodes
    if (importData.nodes && Array.isArray(importData.nodes)) {
      for (const nodeData of importData.nodes) {
        try {
          await prisma.node.upsert({
            where: { id: nodeData.id },
            update: {
              type: nodeData.type,
              content: nodeData.content,
              updatedAt: new Date()
            },
            create: {
              id: nodeData.id,
              type: nodeData.type,
              content: nodeData.content,
              createdAt: nodeData.createdAt ? new Date(nodeData.createdAt) : new Date(),
              updatedAt: nodeData.updatedAt ? new Date(nodeData.updatedAt) : new Date()
            }
          });
          importedCounts.nodes++;
        } catch (nodeError) {
          console.warn(`Failed to import node ${nodeData.id}:`, nodeError);
        }
      }
    }

    // Import edges
    if (importData.edges && Array.isArray(importData.edges)) {
      for (const edgeData of importData.edges) {
        try {
          await prisma.edge.upsert({
            where: { id: edgeData.id },
            update: {
              source: edgeData.source,
              target: edgeData.target
            },
            create: {
              id: edgeData.id,
              source: edgeData.source,
              target: edgeData.target
            }
          });
          importedCounts.edges++;
        } catch (edgeError) {
          console.warn(`Failed to import edge ${edgeData.id}:`, edgeError);
        }
      }
    }

    // Import AI insights
    if (importData.aiInsights && Array.isArray(importData.aiInsights)) {
      for (const insightData of importData.aiInsights) {
        try {
          await prisma.aiInsight.create({
            data: {
              nodeId: insightData.nodeId,
              summary: insightData.summary,
              createdAt: insightData.createdAt ? new Date(insightData.createdAt) : new Date()
            }
          });
          importedCounts.aiInsights++;
        } catch (insightError) {
          console.warn(`Failed to import AI insight:`, insightError);
        }
      }
    }

    // Import KPIs
    if (importData.kpis && Array.isArray(importData.kpis)) {
      for (const kpiData of importData.kpis) {
        try {
          await prisma.dashboardKPI.create({
            data: {
              revenue: kpiData.revenue,
              expenses: kpiData.expenses,
              profit: kpiData.profit,
              roi: kpiData.roi,
              createdAt: kpiData.createdAt ? new Date(kpiData.createdAt) : new Date()
            }
          });
          importedCounts.kpis++;
        } catch (kpiError) {
          console.warn(`Failed to import KPI:`, kpiError);
        }
      }
    }

    res.status(200).json({
      success: true,
      imported: importedCounts
    });

  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to import workspace'
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
}