@echo off
echo ========================================
echo Fraud Dashboard - .NET Setup Script
echo ========================================
echo.

echo Checking prerequisites...
echo.

REM Check if SQL Server is running
echo Checking SQL Server connection...
sqlcmd -S localhost -Q "SELECT @@VERSION" >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: SQL Server is not running or not accessible.
    echo Please start SQL Server and try again.
    pause
    exit /b 1
)
echo SQL Server connection successful.
echo.

REM Check if .NET Framework 4.8 is installed
echo Checking .NET Framework 4.8...
reg query "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\NET Framework Setup\NDP\v4\Full" /v Release >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: .NET Framework 4.8 may not be installed.
    echo Please ensure .NET Framework 4.8 is installed.
    echo.
)

echo ========================================
echo Setup Steps:
echo ========================================
echo.
echo 1. Database Setup:
echo    - Open SQL Server Management Studio
echo    - Connect to your SQL Server instance
echo    - Open and execute Scripts\DatabaseSetup.sql
echo.
echo 2. Project Configuration:
echo    - Open FraudDashboard.sln in Visual Studio
echo    - Update connection string in Web.config if needed
echo    - Restore NuGet packages (Right-click solution > Restore NuGet Packages)
echo.
echo 3. Build and Run:
echo    - Build the solution (Ctrl+Shift+B)
echo    - Press F5 to run the application
echo.
echo ========================================
echo Setup complete! Follow the steps above.
echo ========================================
echo.
pause 