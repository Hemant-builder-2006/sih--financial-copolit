// Utility functions for file processing and backend integration

// Convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix to get pure base64
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

// Parse CSV/Excel file using backend API
export const parseCSVFile = async (file: File, nodeId?: string) => {
  try {
    const base64Content = await fileToBase64(file);
    
    const response = await fetch('/api/parse-csv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileContent: base64Content,
        fileName: file.name,
        nodeId
      }),
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to parse CSV file');
    }

    return result;
  } catch (error) {
    console.error('CSV parsing error:', error);
    throw error;
  }
};

// Parse PDF file using backend API
export const parsePDFFile = async (file: File, nodeId?: string) => {
  try {
    const base64Content = await fileToBase64(file);
    
    const response = await fetch('/api/parse-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileContent: base64Content,
        fileName: file.name,
        nodeId
      }),
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to parse PDF file');
    }

    return result;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw error;
  }
};

// Send AI analysis request
export const sendAIAnalysis = async (nodes: any[], action: string = 'analyze', nodeId?: string) => {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        nodes,
        nodeId
      }),
    });

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }

    return result.result;
  } catch (error) {
    console.error('AI analysis error:', error);
    throw error;
  }
};

// Recalculate KPIs
export const recalculateKPIs = async () => {
  try {
    const response = await fetch('/api/kpi');
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to calculate KPIs');
    }

    return result.data;
  } catch (error) {
    console.error('KPI calculation error:', error);
    throw error;
  }
};

// Get dashboard data
export const getDashboardData = async () => {
  try {
    const response = await fetch('/api/dashboard');
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch dashboard data');
    }

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    console.error('Dashboard data error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch dashboard data'
    };
  }
};

// Export workspace
export const exportWorkspace = async (format: 'json' | 'excel' = 'json') => {
  try {
    const response = await fetch(`/api/export?format=${format}`);
    
    if (!response.ok) {
      throw new Error('Failed to export workspace');
    }

    if (format === 'excel') {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workspace-export-${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workspace-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Export error:', error);
    throw error;
  }
};

// Import workspace
export const importWorkspace = async (file: File) => {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    
    const response = await fetch('/api/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to import workspace');
    }

    return result.imported;
  } catch (error) {
    console.error('Import error:', error);
    throw error;
  }
};