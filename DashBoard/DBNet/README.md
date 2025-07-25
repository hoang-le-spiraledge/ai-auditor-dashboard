# Fraud Dashboard - .NET Version

A comprehensive transaction detection dashboard built with ASP.NET Web Forms, Entity Framework, and SQL Server for monitoring and managing security threats in real-time.

## 🚀 Features

- **Real-time Fraud Detection Monitoring**: Track and analyze security threats
- **Interactive Dashboard**: Modern UI with Bootstrap 5 and Chart.js
- **Advanced Filtering**: Filter by status, type, user, and search terms
- **Metrics Dashboard**: Key performance indicators and statistics
- **Chart Visualization**: Monthly detection trends
- **Review System**: Detailed fraud log review with status updates
- **SQL Server Integration**: Robust data storage with Entity Framework
- **Responsive Design**: Works on desktop and mobile devices

## 📋 Prerequisites

- Visual Studio 2019/2022 or Visual Studio Code
- .NET Framework 4.8
- SQL Server 2016 or later (Express edition is fine)
- IIS Express (included with Visual Studio)

## 🛠️ Installation & Setup

### 1. Database Setup

1. Open SQL Server Management Studio (SSMS)
2. Connect to your SQL Server instance
3. Open the `Scripts/DatabaseSetup.sql` file
4. Execute the script to create the database and sample data

```sql
-- The script will:
-- - Create FraudDashboard database
-- - Create Users and FraudLogs tables
-- - Insert sample users and fraud logs
-- - Create performance indexes
```

### 2. Project Setup

1. Open the project in Visual Studio
2. Update the connection string in `Web.config`:

```xml
<connectionStrings>
  <add name="FraudDashboardConnection" 
       connectionString="Data Source=YOUR_SERVER;Initial Catalog=FraudDashboard;Integrated Security=True;TrustServerCertificate=True;" 
       providerName="System.Data.SqlClient" />
</connectionStrings>
```

3. Restore NuGet packages:
   - Right-click on the solution
   - Select "Restore NuGet Packages"

### 3. Build and Run

1. Build the solution (Ctrl+Shift+B)
2. Press F5 to run the application
3. The dashboard will open in your default browser

## 📁 Project Structure

```
DashBoard/DBNet/
├── Data/
│   └── FraudDashboardContext.cs      # Entity Framework DbContext
├── Models/
│   ├── FraudLog.cs                   # Fraud log entity model
│   └── User.cs                       # User entity model
├── Services/
│   └── FraudLogService.cs            # Business logic and data operations
├── Scripts/
│   └── DatabaseSetup.sql             # Database creation script
├── Default.aspx                      # Main dashboard page
├── Default.aspx.cs                   # Code-behind for dashboard
├── Web.config                        # Application configuration
├── packages.config                   # NuGet package references
├── FraudDashboard.csproj            # Project file
└── README.md                        # This file
```

## 🎯 Key Components

### Models
- **FraudLog**: Represents fraud detection records with all necessary fields
- **User**: User management for authentication and roles

### Services
- **FraudLogService**: Handles all CRUD operations, metrics calculation, and chart data generation

### Data Layer
- **FraudDashboardContext**: Entity Framework DbContext for SQL Server integration
- **Database Setup**: Complete SQL script with sample data

### UI Components
- **Metrics Cards**: Display key statistics (total detections, critical issues, savings, risk)
- **Chart Visualization**: Monthly detection trends using Chart.js
- **Data Table**: Sortable and filterable fraud logs table
- **Review Modal**: Detailed fraud log review with status updates

## 🔧 Configuration

### Connection String
Update the connection string in `Web.config` to match your SQL Server setup:

```xml
<connectionStrings>
  <add name="FraudDashboardConnection" 
       connectionString="Data Source=localhost;Initial Catalog=FraudDashboard;Integrated Security=True;TrustServerCertificate=True;" 
       providerName="System.Data.SqlClient" />
</connectionStrings>
```

### Sample Data
The database setup script includes 10 sample fraud logs with various:
- Detection types (Device fingerprint mismatch, Suspicious login pattern, etc.)
- Risk levels (60-95%)
- Statuses (Critical, Medium, Resolved, In Review, False Positive)
- Transaction amounts and savings

## 📊 Dashboard Features

### Metrics Overview
- **Total Detections**: Count of all fraud attempts
- **Critical Issues**: High-risk detections requiring immediate attention
- **Potential Savings**: Total amount saved from prevented fraud
- **Average Risk**: Mean risk score across all detections

### Interactive Chart
- Monthly detection trends for the current year
- Responsive line chart with hover tooltips
- Real-time data updates

### Advanced Filtering
- Filter by status (Critical, Medium, Resolved, etc.)
- Filter by detection type
- Search functionality across fraud ID, type, and user
- Clear filters option

### Data Table
- Paginated fraud logs display
- Sortable columns
- Status badges with color coding
- Risk level indicators
- Review action buttons

### Review System
- Detailed fraud log review modal
- Status update functionality
- Complete transaction details
- IP address and location tracking

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface using Bootstrap 5
- **Responsive Layout**: Works seamlessly on desktop and mobile
- **Color-coded Status**: Visual indicators for different risk levels
- **Interactive Elements**: Hover effects and smooth transitions
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🔒 Security Features

- **Input Validation**: Server-side validation for all user inputs
- **SQL Injection Prevention**: Entity Framework parameterized queries
- **XSS Protection**: Proper HTML encoding
- **CSRF Protection**: Built-in ASP.NET protection mechanisms

## 📈 Performance Optimizations

- **Database Indexes**: Optimized queries with proper indexing
- **Pagination**: Efficient data loading with page limits
- **Async Operations**: Non-blocking database operations
- **Caching**: Entity Framework query result caching

## 🚀 Deployment

### Local Development
1. Use IIS Express (included with Visual Studio)
2. Press F5 to run in debug mode
3. Access via `http://localhost:port`

### Production Deployment
1. Build the project in Release mode
2. Publish to IIS server
3. Configure SQL Server connection string
4. Set up IIS application pool

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify SQL Server is running
   - Check connection string in Web.config
   - Ensure database exists and is accessible

2. **NuGet Package Issues**
   - Restore NuGet packages
   - Clear NuGet cache if needed
   - Update packages to latest versions

3. **Build Errors**
   - Ensure .NET Framework 4.8 is installed
   - Check all required references are present
   - Verify project file structure

### Logging
- Application errors are logged to the browser console
- Database errors are caught and displayed to users
- Use browser developer tools for debugging

## 📝 API Reference

### FraudLogService Methods

```csharp
// Get all fraud logs with filtering
Task<List<FraudLog>> GetAllAsync(int page = 1, int limit = 10, string status = null, string type = null)

// Get single fraud log
Task<FraudLog> GetByIdAsync(int id)

// Create new fraud log
Task<FraudLog> CreateAsync(FraudLog fraudLog)

// Update fraud log
Task<FraudLog> UpdateAsync(int id, FraudLog updatedFraudLog)

// Update status only
Task<bool> UpdateStatusAsync(int id, string status, string reviewedBy = null)

// Get dashboard metrics
Task<FraudMetrics> GetMetricsAsync()

// Get chart data
Task<ChartData> GetChartDataAsync()
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the code comments for implementation details

---

**Note**: This is a .NET conversion of the original Next.js fraud dashboard. The functionality has been preserved while adapting to ASP.NET Web Forms architecture and SQL Server database. 