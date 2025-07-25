-- Create Database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'FraudDashboard')
BEGIN
    CREATE DATABASE FraudDashboard;
END
GO

USE FraudDashboard;
GO

-- Create Users table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Username NVARCHAR(100) NOT NULL UNIQUE,
        Email NVARCHAR(200) NOT NULL UNIQUE,
        Role NVARCHAR(50) NOT NULL DEFAULT 'analyst',
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );
END
GO

-- Create FraudLogs table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'FraudLogs')
BEGIN
    CREATE TABLE FraudLogs (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        FraudId NVARCHAR(50) NOT NULL UNIQUE,
        Type NVARCHAR(200) NOT NULL,
        Description NVARCHAR(500) NULL,
        User NVARCHAR(100) NOT NULL,
        Amount NVARCHAR(50) NOT NULL,
        Savings NVARCHAR(50) NOT NULL,
        Risk INT NOT NULL,
        Status NVARCHAR(50) NOT NULL,
        TransactionType NVARCHAR(100) NULL,
        JiraTicketNumber NVARCHAR(50) NULL,
        IpAddress NVARCHAR(50) NOT NULL,
        Location NVARCHAR(200) NOT NULL,
        Device NVARCHAR(200) NOT NULL,
        UserAgent NVARCHAR(500) NOT NULL,
        PreviousAttempts INT NOT NULL DEFAULT 0,
        CardNumber NVARCHAR(50) NULL,
        Merchant NVARCHAR(100) NULL,
        Notes NVARCHAR(1000) NULL,
        ReviewedBy NVARCHAR(100) NULL,
        ReviewedAt DATETIME2 NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
    );
END
GO

-- Insert sample users
IF NOT EXISTS (SELECT * FROM Users WHERE Username = 'admin')
BEGIN
    INSERT INTO Users (Username, Email, Role, CreatedAt, UpdatedAt)
    VALUES 
        ('admin', 'admin@frauddashboard.com', 'admin', GETUTCDATE(), GETUTCDATE()),
        ('analyst1', 'analyst1@frauddashboard.com', 'analyst', GETUTCDATE(), GETUTCDATE()),
        ('analyst2', 'analyst2@frauddashboard.com', 'analyst', GETUTCDATE(), GETUTCDATE());
END
GO

-- Insert sample fraud logs
IF NOT EXISTS (SELECT * FROM FraudLogs WHERE FraudId = 'AUD-001')
BEGIN
    INSERT INTO FraudLogs (FraudId, Type, Description, User, Amount, Savings, Risk, Status, TransactionType, JiraTicketNumber, IpAddress, Location, Device, UserAgent, PreviousAttempts, CardNumber, Merchant, Notes, CreatedAt, UpdatedAt)
    VALUES 
        ('AUD-001', 'Device fingerprint mismatch', 'Suspicious device activity detected', 'john.doe@example.com', '$1,250.00', '$1,250.00', 85, 'Critical', 'purchase', 'TEND-1001', '192.168.1.100', 'New York, NY', 'iPhone 13', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)', 3, '****-****-****-1234', 'Amazon.com', 'High risk transaction from new device', GETUTCDATE(), GETUTCDATE()),
        
        ('AUD-002', 'Suspicious login pattern', 'Multiple failed login attempts', 'jane.smith@example.com', '$500.00', '$500.00', 75, 'Medium', 'login', 'TEND-1002', '203.45.67.89', 'Los Angeles, CA', 'Windows PC', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 5, NULL, NULL, 'Unusual login pattern detected', GETUTCDATE(), GETUTCDATE()),
        
        ('AUD-003', 'Identity verification failed', 'Failed identity verification', 'mike.wilson@example.com', '$2,100.00', '$2,100.00', 90, 'Critical', 'purchase', 'TEND-1003', '45.67.89.123', 'Chicago, IL', 'Android Phone', 'Mozilla/5.0 (Linux; Android 11)', 1, '****-****-****-5678', 'Best Buy', 'Identity verification failed for large purchase', GETUTCDATE(), GETUTCDATE()),
        
        ('AUD-004', 'Card testing detected', 'Multiple card testing attempts', 'sarah.jones@example.com', '$100.00', '$100.00', 80, 'In Review', 'purchase', 'TEND-1004', '98.76.54.321', 'Miami, FL', 'iPad', 'Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X)', 8, '****-****-****-9012', 'Walmart', 'Card testing pattern detected', GETUTCDATE(), GETUTCDATE()),
        
        ('AUD-005', 'Unusual transaction pattern', 'Unusual spending pattern', 'david.brown@example.com', '$750.00', '$750.00', 65, 'Medium', 'purchase', 'TEND-1005', '111.222.333.444', 'Seattle, WA', 'MacBook Pro', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 2, '****-****-****-3456', 'Apple Store', 'Unusual transaction pattern for this user', GETUTCDATE(), GETUTCDATE()),
        
        ('AUD-006', 'Location anomaly', 'Transaction from unusual location', 'emma.davis@example.com', '$300.00', '$300.00', 70, 'Resolved', 'purchase', 'TEND-1006', '222.333.444.555', 'London, UK', 'iPhone 12', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X)', 1, '****-****-****-7890', 'Netflix', 'Transaction from unusual location', GETUTCDATE(), GETUTCDATE()),
        
        ('AUD-007', 'Velocity check failed', 'High velocity transactions', 'alex.taylor@example.com', '$1,500.00', '$1,500.00', 95, 'Critical', 'purchase', 'TEND-1007', '333.444.555.666', 'Toronto, Canada', 'Samsung Galaxy', 'Mozilla/5.0 (Linux; Android 10)', 4, '****-****-****-2345', 'Target', 'High velocity transaction pattern', GETUTCDATE(), GETUTCDATE()),
        
        ('AUD-008', 'Device fingerprint mismatch', 'New device without verification', 'lisa.garcia@example.com', '$800.00', '$800.00', 60, 'False Positive', 'purchase', 'TEND-1008', '444.555.666.777', 'San Francisco, CA', 'Dell Laptop', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 1, '****-****-****-6789', 'Home Depot', 'New device purchase - verified legitimate', GETUTCDATE(), GETUTCDATE()),
        
        ('AUD-009', 'Suspicious login pattern', 'Rapid login attempts', 'tom.anderson@example.com', '$250.00', '$250.00', 85, 'Critical', 'login', 'TEND-1009', '555.666.777.888', 'Boston, MA', 'Chrome Browser', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 6, NULL, NULL, 'Rapid login attempts from multiple locations', GETUTCDATE(), GETUTCDATE()),
        
        ('AUD-010', 'Identity verification failed', 'Document verification failed', 'rachel.white@example.com', '$1,800.00', '$1,800.00', 75, 'In Review', 'purchase', 'TEND-1010', '666.777.888.999', 'Austin, TX', 'Firefox Browser', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0)', 2, '****-****-****-0123', 'Costco', 'Identity verification document mismatch', GETUTCDATE(), GETUTCDATE());
END
GO

-- Create indexes for better performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_FraudLogs_Status')
BEGIN
    CREATE INDEX IX_FraudLogs_Status ON FraudLogs(Status);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_FraudLogs_Type')
BEGIN
    CREATE INDEX IX_FraudLogs_Type ON FraudLogs(Type);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_FraudLogs_CreatedAt')
BEGIN
    CREATE INDEX IX_FraudLogs_CreatedAt ON FraudLogs(CreatedAt);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_FraudLogs_User')
BEGIN
    CREATE INDEX IX_FraudLogs_User ON FraudLogs(User);
END
GO

PRINT 'Database setup completed successfully!';
PRINT 'Sample data has been inserted.';
PRINT 'You can now run the .NET application.';
GO 