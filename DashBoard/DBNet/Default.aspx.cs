using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.UI;
using System.Web.UI.WebControls;
using DashBoard.DBNet.Models;
using DashBoard.DBNet.Services;
using Newtonsoft.Json;

namespace DashBoard.DBNet
{
    public partial class Default : System.Web.UI.Page
    {
        private FraudLogService _fraudLogService;

        protected void Page_Load(object sender, EventArgs e)
        {
            _fraudLogService = new FraudLogService();

            if (!IsPostBack)
            {
                LoadDashboardData();
            }
        }

        private async void LoadDashboardData()
        {
            try
            {
                // Load metrics
                var metrics = await _fraudLogService.GetMetricsAsync();
                litTotalDetections.Text = metrics.TotalDetections.ToString("N0");
                litCriticalIssues.Text = metrics.CriticalIssues.ToString("N0");
                litTotalSavings.Text = metrics.TotalSavings.ToString("C0");
                litAverageRisk.Text = metrics.AverageRisk.ToString() + "%";

                // Load fraud logs
                await LoadFraudLogs();

                // Update pagination info
                UpdatePaginationInfo();
            }
            catch (Exception ex)
            {
                // Handle error - you might want to show an error message
                Response.Write($"<script>alert('Error loading data: {ex.Message}');</script>");
            }
        }

        private async System.Threading.Tasks.Task LoadFraudLogs()
        {
            var status = ddlStatus.SelectedValue;
            var type = ddlType.SelectedValue;
            var search = txtSearch.Text.Trim();

            var fraudLogs = await _fraudLogService.GetAllAsync(1, 10, status, type);
            
            // Apply search filter if provided
            if (!string.IsNullOrEmpty(search))
            {
                fraudLogs = fraudLogs.Where(f => 
                    f.FraudId.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                    f.Type.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                    f.User.Contains(search, StringComparison.OrdinalIgnoreCase)
                ).ToList();
            }

            gvFraudLogs.DataSource = fraudLogs;
            gvFraudLogs.DataBind();
        }

        private void UpdatePaginationInfo()
        {
            var totalCount = _fraudLogService.GetTotalCountAsync().Result;
            var pageSize = gvFraudLogs.PageSize;
            var currentPage = gvFraudLogs.PageIndex + 1;
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            lblPagination.Text = $"Showing {((currentPage - 1) * pageSize) + 1}-{Math.Min(currentPage * pageSize, totalCount)} of {totalCount} detections";
        }

        protected void btnRefresh_Click(object sender, EventArgs e)
        {
            LoadDashboardData();
        }

        protected void ddlStatus_SelectedIndexChanged(object sender, EventArgs e)
        {
            LoadFraudLogs();
        }

        protected void ddlType_SelectedIndexChanged(object sender, EventArgs e)
        {
            LoadFraudLogs();
        }

        protected void btnSearch_Click(object sender, EventArgs e)
        {
            LoadFraudLogs();
        }

        protected void btnClear_Click(object sender, EventArgs e)
        {
            ddlStatus.SelectedIndex = 0;
            ddlType.SelectedIndex = 0;
            txtSearch.Text = "";
            LoadFraudLogs();
        }

        protected void gvFraudLogs_PageIndexChanging(object sender, GridViewPageEventArgs e)
        {
            gvFraudLogs.PageIndex = e.NewPageIndex;
            LoadFraudLogs();
        }

        protected void gvFraudLogs_RowCommand(object sender, GridViewCommandEventArgs e)
        {
            if (e.CommandName == "Review")
            {
                var fraudLogId = Convert.ToInt32(e.CommandArgument);
                LoadFraudLogForReview(fraudLogId);
                
                // Show modal using JavaScript
                ScriptManager.RegisterStartupScript(this, GetType(), "ShowModal", 
                    "$('#reviewModal').modal('show');", true);
            }
        }

        private async void LoadFraudLogForReview(int fraudLogId)
        {
            var fraudLog = await _fraudLogService.GetByIdAsync(fraudLogId);
            if (fraudLog != null)
            {
                // Populate review panel with fraud log details
                pnlReviewDetails.Controls.Clear();
                
                var detailsHtml = $@"
                    <div class='row'>
                        <div class='col-md-6'>
                            <h6>Fraud ID</h6>
                            <p>{fraudLog.FraudId}</p>
                        </div>
                        <div class='col-md-6'>
                            <h6>Type</h6>
                            <p>{fraudLog.Type}</p>
                        </div>
                    </div>
                    <div class='row'>
                        <div class='col-md-6'>
                            <h6>User</h6>
                            <p>{fraudLog.User}</p>
                        </div>
                        <div class='col-md-6'>
                            <h6>Amount</h6>
                            <p>{fraudLog.Amount}</p>
                        </div>
                    </div>
                    <div class='row'>
                        <div class='col-md-6'>
                            <h6>Risk</h6>
                            <p>{fraudLog.Risk}%</p>
                        </div>
                        <div class='col-md-6'>
                            <h6>Status</h6>
                            <p>{fraudLog.Status}</p>
                        </div>
                    </div>
                    <div class='row'>
                        <div class='col-md-6'>
                            <h6>IP Address</h6>
                            <p>{fraudLog.IpAddress}</p>
                        </div>
                        <div class='col-md-6'>
                            <h6>Location</h6>
                            <p>{fraudLog.Location}</p>
                        </div>
                    </div>
                    <div class='row'>
                        <div class='col-md-6'>
                            <h6>Device</h6>
                            <p>{fraudLog.Device}</p>
                        </div>
                        <div class='col-md-6'>
                            <h6>Created</h6>
                            <p>{fraudLog.CreatedAt:MM/dd/yyyy HH:mm}</p>
                        </div>
                    </div>
                    <div class='row'>
                        <div class='col-md-12'>
                            <h6>Notes</h6>
                            <p>{fraudLog.Notes ?? "No notes available"}</p>
                        </div>
                    </div>";

                pnlReviewDetails.Controls.Add(new LiteralControl(detailsHtml));
                
                // Store fraud log ID for status update
                ViewState["CurrentFraudLogId"] = fraudLogId;
            }
        }

        protected void btnUpdateStatus_Click(object sender, EventArgs e)
        {
            var fraudLogId = Convert.ToInt32(ViewState["CurrentFraudLogId"]);
            var newStatus = "Resolved"; // You might want to add a dropdown for status selection
            
            var success = _fraudLogService.UpdateStatusAsync(fraudLogId, newStatus, "current-user").Result;
            
            if (success)
            {
                LoadDashboardData();
                ScriptManager.RegisterStartupScript(this, GetType(), "HideModal", 
                    "$('#reviewModal').modal('hide');", true);
                ScriptManager.RegisterStartupScript(this, GetType(), "ShowSuccess", 
                    "alert('Status updated successfully');", true);
            }
            else
            {
                ScriptManager.RegisterStartupScript(this, GetType(), "ShowError", 
                    "alert('Failed to update status');", true);
            }
        }

        public string GetRiskClass(object riskValue)
        {
            if (riskValue != null && int.TryParse(riskValue.ToString(), out int risk))
            {
                if (risk >= 80) return "risk-high";
                if (risk >= 60) return "risk-medium";
                return "risk-low";
            }
            return "risk-low";
        }

        public string GetChartDataJson()
        {
            try
            {
                var chartData = _fraudLogService.GetChartDataAsync().Result;
                return JsonConvert.SerializeObject(new
                {
                    categories = chartData.Categories,
                    series = chartData.Series
                });
            }
            catch
            {
                return JsonConvert.SerializeObject(new
                {
                    categories = new string[0],
                    series = new int[0][]
                });
            }
        }

        protected void Page_Unload(object sender, EventArgs e)
        {
            _fraudLogService?.Dispose();
        }
    }
} 