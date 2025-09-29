import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '../../lib/prisma';

// Types for request and response
interface NodeData {
  id: string;
  type: string;
  content: string;
}

interface AIRequest {
  prompt?: string;
  action?: string;
  nodes?: NodeData[];
  nodeId?: string; // For saving insights to specific node
}

interface AIResponse {
  result?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AIResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { prompt, action = 'analyze', nodes, nodeId }: AIRequest = req.body;

    let finalContent = '';

    // Handle multi-node format (preferred)
    if (nodes && Array.isArray(nodes) && nodes.length > 0) {
      finalContent = nodes.map(node => 
        `---${node.type.toUpperCase()} Node (${node.id})---\n${node.content}`
      ).join('\n\n');
    } 
    // Fallback to single prompt format
    else if (prompt && typeof prompt === 'string' && prompt.trim().length > 0) {
      finalContent = prompt;
    }

    // Validate we have content
    if (!finalContent.trim()) {
      return res.status(400).json({ 
        error: 'No content received. Please connect nodes with data to the AI Node or provide a prompt.' 
      });
    }

    // Get API key from environment
    const apiKey = process.env.GEMINI_API_KEY;

    // If no API key, return mock response for development
    if (!apiKey) {
      console.warn('GEMINI_API_KEY not found. Returning mock response.');
      const nodeCount = nodes ? nodes.length : 1;
      const mockResult = `Mock ${action} completed on ${nodeCount} node(s):

${finalContent.substring(0, 200)}${finalContent.length > 200 ? '...' : ''}

This is a simulated AI response since no API key is configured. The AI would normally ${action} your content and provide detailed insights, analysis, or transformations based on your request.`;
      
      return res.status(200).json({ result: mockResult });
    }

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey);
    
    let model;
    let modelName = '';

    // Try to use Gemini 2.5 Flash first, fallback to 2.0 Pro
    try {
      model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      modelName = 'gemini-2.5-flash';
    } catch (error) {
      console.warn('Gemini 2.5 Flash not available, falling back to Gemini 2.0 Pro');
      try {
        model = genAI.getGenerativeModel({ model: 'gemini-2.0-pro' });
        modelName = 'gemini-2.0-pro';
      } catch (fallbackError) {
        console.warn('Gemini 2.0 Pro not available, falling back to Gemini 1.5 Pro');
        model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
        modelName = 'gemini-1.5-pro';
      }
    }

    // Create prompt with template
    const fullPrompt = `You are an AI assistant. Perform the action '${action}' on the following multi-node context:

${finalContent}`;

    // Generate content
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Save AI insight to database
    if (nodeId) {
      await prisma.aiInsight.create({
        data: {
          nodeId,
          summary: text
        }
      });
    }

    // Return successful response
    return res.status(200).json({ 
      result: text,
    });

  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      // Rate limiting or quota errors
      if (error.message.includes('quota') || error.message.includes('rate')) {
        return res.status(429).json({ 
          error: 'API rate limit exceeded. Please try again later.' 
        });
      }
      
      // Authentication errors
      if (error.message.includes('API_KEY') || error.message.includes('authentication')) {
        return res.status(401).json({ 
          error: 'Invalid API key. Please check your configuration.' 
        });
      }
      
      // Model not found errors
      if (error.message.includes('model') || error.message.includes('not found')) {
        return res.status(400).json({ 
          error: 'Requested model not available. Please try again.' 
        });
      }
    }

    // Generic error response
    return res.status(500).json({ 
      error: 'An error occurred while processing your request. Please try again.' 
    });
  }
}