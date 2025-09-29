import type { NextApiRequest, NextApiResponse } from 'next';
import pdf from 'pdf-parse';
import { prisma } from '../../lib/prisma';

interface ParsedPDFData {
  text: string;
  metadata: {
    totalPages: number;
    fileName: string;
    fileType: string;
    wordCount: number;
    characterCount: number;
  };
}

interface ParseResponse {
  success: boolean;
  data?: ParsedPDFData;
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

    // Convert base64 to buffer
    const buffer = Buffer.from(fileContent, 'base64');
    
    // Parse PDF
    const pdfData = await pdf(buffer);
    
    if (!pdfData.text || pdfData.text.trim().length === 0) {
      throw new Error('No text content found in PDF');
    }

    // Calculate statistics
    const wordCount = pdfData.text.split(/\s+/).filter((word: string) => word.length > 0).length;
    const characterCount = pdfData.text.length;

    const parsedData: ParsedPDFData = {
      text: pdfData.text,
      metadata: {
        totalPages: pdfData.numpages,
        fileName,
        fileType: 'pdf',
        wordCount,
        characterCount
      }
    };

    // Save to database
    const dbNodeId = nodeId || `pdf_${Date.now()}`;
    const contentString = JSON.stringify(parsedData);

    await prisma.node.upsert({
      where: { id: dbNodeId },
      update: { 
        content: contentString,
        type: 'pdf',
        updatedAt: new Date()
      },
      create: {
        id: dbNodeId,
        type: 'pdf',
        content: contentString
      }
    });

    res.status(200).json({
      success: true,
      data: parsedData,
      nodeId: dbNodeId
    });

  } catch (error) {
    console.error('PDF parsing error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse PDF'
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