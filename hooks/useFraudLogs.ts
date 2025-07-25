import { useState, useEffect } from 'react'
import { FraudLogAPI, FraudLog, FraudLogResponse, CreateFraudLogData, UpdateFraudLogData } from '../lib/api/fraud-logs'

// Hook for fetching all fraud logs
export function useFraudLogs(params?: {
  page?: number
  limit?: number
  status?: string
  type?: string
}) {
  const [data, setData] = useState<FraudLogResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFraudLogs = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await FraudLogAPI.getAll(params)
      setData(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch fraud logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFraudLogs()
  }, [params?.page, params?.limit, params?.status, params?.type])

  return {
    fraudLogs: data?.data || [],
    pagination: data?.pagination,
    loading,
    error,
    refetch: fetchFraudLogs,
  }
}

// Hook for fetching a single fraud log
export function useFraudLog(id: string | null) {
  const [fraudLog, setFraudLog] = useState<FraudLog | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchFraudLog = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await FraudLogAPI.getById(id)
        setFraudLog(response)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch fraud log')
      } finally {
        setLoading(false)
      }
    }

    fetchFraudLog()
  }, [id])

  return { fraudLog, loading, error }
}

// Hook for CRUD operations
export function useFraudLogActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createFraudLog = async (data: CreateFraudLogData): Promise<FraudLog | null> => {
    try {
      setLoading(true)
      setError(null)
      const fraudLog = await FraudLogAPI.create(data)
      return fraudLog
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create fraud log')
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateFraudLog = async (id: string, data: UpdateFraudLogData): Promise<FraudLog | null> => {
    try {
      setLoading(true)
      setError(null)
      const fraudLog = await FraudLogAPI.update(id, data)
      return fraudLog
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update fraud log')
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteFraudLog = async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      await FraudLogAPI.delete(id)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete fraud log')
      return false
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string, reviewedBy?: string): Promise<FraudLog | null> => {
    try {
      setLoading(true)
      setError(null)
      const fraudLog = await FraudLogAPI.updateStatus(id, status, reviewedBy)
      return fraudLog
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    createFraudLog,
    updateFraudLog,
    deleteFraudLog,
    updateStatus,
    loading,
    error,
  }
}

// Hook for dashboard metrics
export function useFraudMetrics() {
  const [metrics, setMetrics] = useState({
    totalDetections: 0,
    criticalIssues: 0,
    totalSavings: 0,
    averageRisk: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all fraud logs to calculate metrics
      const response = await FraudLogAPI.getAll({ limit: 1000 }); // Get more records for accurate metrics
      
      const fraudLogs = response.data;
      
      // Calculate metrics
      const totalDetections = fraudLogs.length;
      const criticalIssues = fraudLogs.filter(log => log.status === 'Critical').length;
      
      // Calculate total savings (remove currency symbols and commas)
      const totalSavings = fraudLogs.reduce((sum, log) => {
        const savingsAmount = parseFloat(log.savings.replace(/[$,]/g, ''));
        return sum + (isNaN(savingsAmount) ? 0 : savingsAmount);
      }, 0);
      
      // Calculate average risk
      const averageRisk = fraudLogs.length > 0 
        ? Math.round(fraudLogs.reduce((sum, log) => sum + log.risk, 0) / fraudLogs.length)
        : 0;

      setMetrics({
        totalDetections,
        criticalIssues,
        totalSavings,
        averageRisk
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return {
    metrics,
    loading,
    error,
    refetch: fetchMetrics,
  };
} 

// Hook for chart data (hourly detections)
export function useFraudChartData() {
  const [chartData, setChartData] = useState({
    categories: [] as string[],
    series: [{ name: "Detections", data: [] as number[] }]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all logs (limit high to cover the year)
      const response = await FraudLogAPI.getAll({ limit: 5000 });
      const fraudLogs = response.data;

      // Prepare months labels for current year
      const now = new Date();
      const thisYear = now.getFullYear();

      const months = [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
      ];

      // Initialize counts
      const monthlyCounts = Array(12).fill(0);

      fraudLogs.forEach(log => {
        const date = new Date(log.createdAt);
        if (date.getFullYear() === thisYear) {
          const monthIndex = date.getMonth();
          monthlyCounts[monthIndex] += 1;
        }
      });

      setChartData({
        categories: months,
        series: [{ name: "Detections", data: monthlyCounts }]
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch chart data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  return {
    chartData,
    loading,
    error,
    refetch: fetchChartData,
  };
} 