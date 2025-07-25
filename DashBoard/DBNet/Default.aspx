<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="DashBoard.DBNet.Default" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Transaction Detection Dashboard</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
    
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <!-- Custom CSS -->
    <style>
        .dashboard-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem 0;
            margin-bottom: 2rem;
        }
        
        .metric-card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            transition: transform 0.2s;
        }
        
        .metric-card:hover {
            transform: translateY(-2px);
        }
        
        .metric-value {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
        }
        
        .metric-label {
            color: #6c757d;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .chart-container {
            background: white;
            border-radius: 15px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 1.5rem;
            margin-bottom: 1.5rem;
        }
        
        .table-container {
            background: white;
            border-radius: 15px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 1.5rem;
        }
        
        .status-badge {
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        
        .status-critical { background-color: #dc3545; color: white; }
        .status-medium { background-color: #fd7e14; color: white; }
        .status-resolved { background-color: #198754; color: white; }
        .status-review { background-color: #0dcaf0; color: white; }
        .status-false-positive { background-color: #6c757d; color: white; }
        
        .risk-high { color: #dc3545; }
        .risk-medium { color: #fd7e14; }
        .risk-low { color: #198754; }
    </style>
</head>
<body>
    <form id="form1" runat="server">
        <!-- Dashboard Header -->
        <div class="dashboard-header">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-md-8">
                        <h1 class="display-4 fw-bold">Transaction Detection Dashboard</h1>
                        <p class="lead mb-0">Monitor and analyze security threats in real-time</p>
                    </div>
                    <div class="col-md-4 text-end">
                        <asp:Button ID="btnRefresh" runat="server" Text="Refresh Data" 
                                  CssClass="btn btn-light" OnClick="btnRefresh_Click" />
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <!-- Metrics Cards -->
            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="metric-card">
                        <div class="metric-label">Total Detections</div>
                        <div class="metric-value text-primary">
                            <asp:Literal ID="litTotalDetections" runat="server" />
                        </div>
                        <small class="text-muted">Total fraud attempts detected</small>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="metric-card">
                        <div class="metric-label">Critical Issues</div>
                        <div class="metric-value text-danger">
                            <asp:Literal ID="litCriticalIssues" runat="server" />
                        </div>
                        <small class="text-muted">Requires immediate attention</small>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="metric-card">
                        <div class="metric-label">Potential Savings</div>
                        <div class="metric-value text-success">
                            <asp:Literal ID="litTotalSavings" runat="server" />
                        </div>
                        <small class="text-muted">From prevented fraud</small>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="metric-card">
                        <div class="metric-label">Average Risk</div>
                        <div class="metric-value">
                            <asp:Literal ID="litAverageRisk" runat="server" />
                        </div>
                        <small class="text-muted">Risk assessment score</small>
                    </div>
                </div>
            </div>

            <!-- Chart Section -->
            <div class="chart-container">
                <h4 class="mb-3">Detections Per Month</h4>
                <p class="text-muted mb-4">Fraud detection activity over the current year</p>
                <canvas id="fraudChart" width="400" height="200"></canvas>
            </div>

            <!-- Filters -->
            <div class="row mb-3">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Filters</h5>
                            <div class="row">
                                <div class="col-md-3">
                                    <label class="form-label">Status</label>
                                    <asp:DropDownList ID="ddlStatus" runat="server" CssClass="form-select" 
                                                    AutoPostBack="true" OnSelectedIndexChanged="ddlStatus_SelectedIndexChanged">
                                        <asp:ListItem Text="All Status" Value="" />
                                        <asp:ListItem Text="Critical" Value="Critical" />
                                        <asp:ListItem Text="Medium" Value="Medium" />
                                        <asp:ListItem Text="Resolved" Value="Resolved" />
                                        <asp:ListItem Text="In Review" Value="In Review" />
                                        <asp:ListItem Text="False Positive" Value="False Positive" />
                                    </asp:DropDownList>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label">Type</label>
                                    <asp:DropDownList ID="ddlType" runat="server" CssClass="form-select" 
                                                    AutoPostBack="true" OnSelectedIndexChanged="ddlType_SelectedIndexChanged">
                                        <asp:ListItem Text="All Types" Value="" />
                                        <asp:ListItem Text="Device fingerprint mismatch" Value="Device fingerprint mismatch" />
                                        <asp:ListItem Text="Suspicious login pattern" Value="Suspicious login pattern" />
                                        <asp:ListItem Text="Identity verification failed" Value="Identity verification failed" />
                                        <asp:ListItem Text="Card testing detected" Value="Card testing detected" />
                                        <asp:ListItem Text="Unusual transaction pattern" Value="Unusual transaction pattern" />
                                        <asp:ListItem Text="Location anomaly" Value="Location anomaly" />
                                        <asp:ListItem Text="Velocity check failed" Value="Velocity check failed" />
                                    </asp:DropDownList>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label">Search</label>
                                    <asp:TextBox ID="txtSearch" runat="server" CssClass="form-control" 
                                               placeholder="Search fraud logs..." />
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label">&nbsp;</label>
                                    <div>
                                        <asp:Button ID="btnSearch" runat="server" Text="Search" 
                                                  CssClass="btn btn-primary" OnClick="btnSearch_Click" />
                                        <asp:Button ID="btnClear" runat="server" Text="Clear" 
                                                  CssClass="btn btn-secondary" OnClick="btnClear_Click" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Fraud Logs Table -->
            <div class="table-container">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4>Fraud Detection Logs</h4>
                    <div>
                        <asp:Label ID="lblPagination" runat="server" CssClass="text-muted" />
                    </div>
                </div>
                
                <asp:GridView ID="gvFraudLogs" runat="server" CssClass="table table-striped table-hover" 
                              AutoGenerateColumns="false" OnRowCommand="gvFraudLogs_RowCommand"
                              AllowPaging="true" PageSize="10" OnPageIndexChanging="gvFraudLogs_PageIndexChanging">
                    <Columns>
                        <asp:BoundField DataField="FraudId" HeaderText="Fraud ID" />
                        <asp:BoundField DataField="Type" HeaderText="Detection Type" />
                        <asp:BoundField DataField="User" HeaderText="User" />
                        <asp:BoundField DataField="Amount" HeaderText="Amount" />
                        <asp:BoundField DataField="Savings" HeaderText="Savings" />
                        <asp:TemplateField HeaderText="Status">
                            <ItemTemplate>
                                <span class='status-badge status-<%# Eval("Status").ToString().ToLower().Replace(" ", "-") %>'>
                                    <%# Eval("Status") %>
                                </span>
                            </ItemTemplate>
                        </asp:TemplateField>
                        <asp:TemplateField HeaderText="Risk">
                            <ItemTemplate>
                                <span class='<%# GetRiskClass(Eval("Risk")) %>'>
                                    <%# Eval("Risk") %>%
                                </span>
                            </ItemTemplate>
                        </asp:TemplateField>
                        <asp:BoundField DataField="CreatedAt" HeaderText="Created" DataFormatString="{0:MM/dd/yyyy HH:mm}" />
                        <asp:TemplateField HeaderText="Actions">
                            <ItemTemplate>
                                <asp:LinkButton ID="lnkReview" runat="server" Text="Review" 
                                              CssClass="btn btn-sm btn-outline-primary"
                                              CommandName="Review" CommandArgument='<%# Eval("Id") %>' />
                            </ItemTemplate>
                        </asp:TemplateField>
                    </Columns>
                    <PagerStyle CssClass="pagination" />
                </asp:GridView>
            </div>
        </div>

        <!-- Review Modal -->
        <div class="modal fade" id="reviewModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Fraud Detection Review</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <asp:Panel ID="pnlReviewDetails" runat="server">
                            <!-- Review details will be populated here -->
                        </asp:Panel>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <asp:Button ID="btnUpdateStatus" runat="server" Text="Update Status" 
                                  CssClass="btn btn-primary" OnClick="btnUpdateStatus_Click" />
                    </div>
                </div>
            </div>
        </div>
    </form>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Chart Initialization -->
    <script type="text/javascript">
        // Chart data will be populated from server-side
        var chartData = <%= GetChartDataJson() %>;
        
        var ctx = document.getElementById('fraudChart').getContext('2d');
        var fraudChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.categories,
                datasets: [{
                    label: 'Detections',
                    data: chartData.series[0],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    </script>
</body>
</html> 