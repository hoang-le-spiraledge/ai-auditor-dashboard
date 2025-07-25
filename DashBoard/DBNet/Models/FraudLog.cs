using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DashBoard.DBNet.Models
{
    [Table("FraudLogs")]
    public class FraudLog
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string FraudId { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Type { get; set; }
        
        [StringLength(500)]
        public string Description { get; set; }
        
        [Required]
        [StringLength(100)]
        public string User { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Amount { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Savings { get; set; }
        
        [Required]
        public int Risk { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Status { get; set; }
        
        [StringLength(100)]
        public string TransactionType { get; set; }
        
        [StringLength(50)]
        public string JiraTicketNumber { get; set; }
        
        [Required]
        [StringLength(50)]
        public string IpAddress { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Location { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Device { get; set; }
        
        [Required]
        [StringLength(500)]
        public string UserAgent { get; set; }
        
        public int PreviousAttempts { get; set; }
        
        [StringLength(50)]
        public string CardNumber { get; set; }
        
        [StringLength(100)]
        public string Merchant { get; set; }
        
        [StringLength(1000)]
        public string Notes { get; set; }
        
        [StringLength(100)]
        public string ReviewedBy { get; set; }
        
        public DateTime? ReviewedAt { get; set; }
        
        [Required]
        public DateTime CreatedAt { get; set; }
        
        [Required]
        public DateTime UpdatedAt { get; set; }
    }
} 