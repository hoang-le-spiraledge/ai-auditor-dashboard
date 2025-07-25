using System.Data.Entity;
using DashBoard.DBNet.Models;

namespace DashBoard.DBNet.Data
{
    public class FraudDashboardContext : DbContext
    {
        public FraudDashboardContext() : base("name=FraudDashboardConnection")
        {
        }

        public DbSet<FraudLog> FraudLogs { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            // Configure FraudLog entity
            modelBuilder.Entity<FraudLog>()
                .Property(f => f.CreatedAt)
                .HasColumnType("datetime2");

            modelBuilder.Entity<FraudLog>()
                .Property(f => f.UpdatedAt)
                .HasColumnType("datetime2");

            modelBuilder.Entity<FraudLog>()
                .Property(f => f.ReviewedAt)
                .HasColumnType("datetime2");

            // Configure User entity
            modelBuilder.Entity<User>()
                .Property(u => u.CreatedAt)
                .HasColumnType("datetime2");

            modelBuilder.Entity<User>()
                .Property(u => u.UpdatedAt)
                .HasColumnType("datetime2");

            base.OnModelCreating(modelBuilder);
        }
    }
} 