using FraudDashboardCore.Data;
using FraudDashboardCore.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Data.Common;

namespace FraudDashboardCore.Services
{
    public class FraudLogService
    {
        private readonly FraudDashboardContext _ctx;
        public FraudLogService(FraudDashboardContext ctx) => _ctx = ctx;

        private static readonly List<FraudLog> FallbackLogs = new()
        {
            new FraudLog
            {
                FraudId = "OFFLINE-001",
                Type = "Connection Error",
                User = "system",
                Risk = 0,
                Status = "Database Offline",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Description = "The database is currently unreachable. Displaying fallback data."
            }
        };

        public async Task<List<FraudLog>> GetAllAsync()
        {
            try
            {
                return await _ctx.FraudLogs.AsNoTracking()
                    .OrderByDescending(f => f.CreatedAt)
                    .ToListAsync();
            }
            catch (Exception ex) when (ex is DbException || ex is InvalidOperationException)
            {
                // TODO: log exception
                return FallbackLogs;
            }
        }

        public async Task<FraudLog?> GetByIdAsync(int id)
        {
            try
            {
                return await _ctx.FraudLogs.FindAsync(id);
            }
            catch (Exception ex) when (ex is DbException || ex is InvalidOperationException)
            {
                return FallbackLogs.First();
            }
        }
    }
} 