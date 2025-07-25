using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using DashBoard.DBNet.Data;
using DashBoard.DBNet.Models;

namespace DashBoard.DBNet.Services
{
    public class FraudLogService
    {
        private readonly FraudDashboardContext _context;

        public FraudLogService()
        {
            _context = new FraudDashboardContext();
        }

        public async Task<List<FraudLog>> GetAllAsync(int page = 1, int limit = 10, string status = null, string type = null)
        {
            var query = _context.FraudLogs.AsQueryable();

            if (!string.IsNullOrEmpty(status))
                query = query.Where(f => f.Status == status);

            if (!string.IsNullOrEmpty(type))
                query = query.Where(f => f.Type == type);

            return await query
                .OrderByDescending(f => f.CreatedAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();
        }

        public async Task<int> GetTotalCountAsync(string status = null, string type = null)
        {
            var query = _context.FraudLogs.AsQueryable();

            if (!string.IsNullOrEmpty(status))
                query = query.Where(f => f.Status == status);

            if (!string.IsNullOrEmpty(type))
                query = query.Where(f => f.Type == type);

            return await query.CountAsync();
        }

        public async Task<FraudLog> GetByIdAsync(int id)
        {
            return await _context.FraudLogs.FindAsync(id);
        }

        public async Task<FraudLog> CreateAsync(FraudLog fraudLog)
        {
            fraudLog.CreatedAt = DateTime.UtcNow;
            fraudLog.UpdatedAt = DateTime.UtcNow;
            
            _context.FraudLogs.Add(fraudLog);
            await _context.SaveChangesAsync();
            return fraudLog;
        }

        public async Task<FraudLog> UpdateAsync(int id, FraudLog updatedFraudLog)
        {
            var existingFraudLog = await _context.FraudLogs.FindAsync(id);
            if (existingFraudLog == null)
                return null;

            existingFraudLog.Type = updatedFraudLog.Type;
            existingFraudLog.Description = updatedFraudLog.Description;
            existingFraudLog.User = updatedFraudLog.User;
            existingFraudLog.Amount = updatedFraudLog.Amount;
            existingFraudLog.Savings = updatedFraudLog.Savings;
            existingFraudLog.Risk = updatedFraudLog.Risk;
            existingFraudLog.Status = updatedFraudLog.Status;
            existingFraudLog.TransactionType = updatedFraudLog.TransactionType;
            existingFraudLog.JiraTicketNumber = updatedFraudLog.JiraTicketNumber;
            existingFraudLog.IpAddress = updatedFraudLog.IpAddress;
            existingFraudLog.Location = updatedFraudLog.Location;
            existingFraudLog.Device = updatedFraudLog.Device;
            existingFraudLog.UserAgent = updatedFraudLog.UserAgent;
            existingFraudLog.PreviousAttempts = updatedFraudLog.PreviousAttempts;
            existingFraudLog.CardNumber = updatedFraudLog.CardNumber;
            existingFraudLog.Merchant = updatedFraudLog.Merchant;
            existingFraudLog.Notes = updatedFraudLog.Notes;
            existingFraudLog.ReviewedBy = updatedFraudLog.ReviewedBy;
            existingFraudLog.ReviewedAt = updatedFraudLog.ReviewedAt;
            existingFraudLog.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existingFraudLog;
        }

        public async Task<bool> UpdateStatusAsync(int id, string status, string reviewedBy = null)
        {
            var fraudLog = await _context.FraudLogs.FindAsync(id);
            if (fraudLog == null)
                return false;

            fraudLog.Status = status;
            fraudLog.ReviewedBy = reviewedBy;
            fraudLog.ReviewedAt = DateTime.UtcNow;
            fraudLog.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var fraudLog = await _context.FraudLogs.FindAsync(id);
            if (fraudLog == null)
                return false;

            _context.FraudLogs.Remove(fraudLog);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<FraudMetrics> GetMetricsAsync()
        {
            var fraudLogs = await _context.FraudLogs.ToListAsync();

            var totalDetections = fraudLogs.Count;
            var criticalIssues = fraudLogs.Count(f => f.Status == "Critical");
            
            var totalSavings = fraudLogs.Sum(f => 
            {
                if (decimal.TryParse(f.Savings.Replace("$", "").Replace(",", ""), out decimal savings))
                    return savings;
                return 0;
            });

            var averageRisk = fraudLogs.Any() ? (int)fraudLogs.Average(f => f.Risk) : 0;

            return new FraudMetrics
            {
                TotalDetections = totalDetections,
                CriticalIssues = criticalIssues,
                TotalSavings = totalSavings,
                AverageRisk = averageRisk
            };
        }

        public async Task<ChartData> GetChartDataAsync()
        {
            var fraudLogs = await _context.FraudLogs.ToListAsync();
            var currentYear = DateTime.Now.Year;

            var monthlyCounts = new int[12];
            var months = new[] { "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" };

            foreach (var log in fraudLogs)
            {
                if (log.CreatedAt.Year == currentYear)
                {
                    monthlyCounts[log.CreatedAt.Month - 1]++;
                }
            }

            return new ChartData
            {
                Categories = months,
                Series = new[] { monthlyCounts }
            };
        }

        public void Dispose()
        {
            _context?.Dispose();
        }
    }

    public class FraudMetrics
    {
        public int TotalDetections { get; set; }
        public int CriticalIssues { get; set; }
        public decimal TotalSavings { get; set; }
        public int AverageRisk { get; set; }
    }

    public class ChartData
    {
        public string[] Categories { get; set; }
        public int[][] Series { get; set; }
    }
} 