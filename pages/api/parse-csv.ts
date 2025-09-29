import type { NextApiRequest, NextApiResponse } from 'next';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { prisma } from '../../lib/prisma';

interface ParsedData {
  headers: string[];
  rows: any[];
  summary: {
    totalRows: number;
    totalColumns: number;
    fileType: string;
  };
}

interface ParseResponse {
  success: boolean;
  data?: ParsedData;
  nodeId?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ParseResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { fileContent, fileName, nodeId } = req.body;
    
    if (!fileContent || !fileName) {
      return res.status(400).json({ 
        success: false, 
        error: 'File content and filename are required' 
      });
    }

    let parsedData: ParsedData;
    const fileExtension = fileName.toLowerCase().split('.').pop();

    if (fileExtension === 'csv') {
      // Parse CSV
      const parseResult = Papa.parse(fileContent, {
        header: false,
        skipEmptyLines: true,
        delimiter: ',',
        quoteChar: '"',
        escapeChar: '"'
      });

      if (parseResult.errors.length > 0) {
        throw new Error(`CSV parsing error: ${parseResult.errors[0].message}`);
      }

      const rows = parseResult.data as string[][];
      const headers = rows.length > 0 ? rows[0] : [];
      const dataRows = rows.slice(1);

      parsedData = {
        headers,
        rows: dataRows,
        summary: {
          totalRows: dataRows.length,
          totalColumns: headers.length,
          fileType: 'csv'
        }
      };
    } else if (['xlsx', 'xls'].includes(fileExtension || '')) {
      // Parse Excel
      const workbook = XLSX.read(fileContent, { type: 'base64' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to array of arrays
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
      
      if (jsonData.length === 0) {
        throw new Error('Excel file is empty');
      }

      const headers = jsonData[0] || [];
      const dataRows = jsonData.slice(1);

      parsedData = {
        headers,
        rows: dataRows,
        summary: {
          totalRows: dataRows.length,
          totalColumns: headers.length,
          fileType: fileExtension
        }
      };
    } else {
      throw new Error(`Unsupported file type: ${fileExtension}`);
    }

    // Save to database
    const dbNodeId = nodeId || `csv_${Date.now()}`;
    const contentString = JSON.stringify(parsedData);

    await prisma.node.upsert({
      where: { id: dbNodeId },
      update: { 
        content: contentString,
        type: 'csv',
        updatedAt: new Date()
      },
      create: {
        id: dbNodeId,
        type: 'csv',
        content: contentString
      }
    });

    res.status(200).json({
      success: true,
      data: parsedData,
      nodeId: dbNodeId
    });

  } catch (error) {
    console.error('CSV/Excel parsing error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse file'
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}