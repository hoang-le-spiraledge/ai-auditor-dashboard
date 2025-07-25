using Microsoft.EntityFrameworkCore;
using FraudDashboardCore.Models;

namespace FraudDashboardCore.Data
{
    public class FraudDashboardContext : DbContext
    {
        public FraudDashboardContext(DbContextOptions<FraudDashboardContext> options) : base(options)
        {
        }

        public DbSet<FraudLog> FraudLogs => Set<FraudLog>();
        public DbSet<User> Users => Set<User>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Additional configuration if needed
        }
    }
} 