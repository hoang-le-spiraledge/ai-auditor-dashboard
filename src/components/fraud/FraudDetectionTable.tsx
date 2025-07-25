"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import FraudReviewModal from "./FraudReviewModal";
import FraudFilters from "./FraudFilters";
import { useFraudLogs, useFraudLogActions } from "../../../hooks/useFraudLogs";
import { FraudLog } from "../../../lib/api/fraud-logs";

// Convert API data to display format
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)}h ago`;
  } else {
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  }
}

// Convert API fraud log to display format
function formatFraudLogForDisplay(fraudLog: FraudLog) {
  return {
    id: fraudLog.id,
    fraudId: fraudLog.fraudId,
    type: fraudLog.type,
    description: fraudLog.description || fraudLog.status,
    user: fraudLog.user,
    timeAgo: formatTimeAgo(fraudLog.createdAt),
    timestamp: fraudLog.createdAt,
    amount: fraudLog.amount,
    savings: fraudLog.savings,
    risk: fraudLog.risk,
    status: fraudLog.status as "Critical" | "Medium" | "Resolved" | "In Review" | "False Positive",
    transactionType: fraudLog.transactionType || "-",
    jiraTicketNumber: fraudLog.jiraTicketNumber || "",
    details: {
      ipAddress: fraudLog.ipAddress,
      location: fraudLog.location,
      device: fraudLog.device,
      userAgent: fraudLog.userAgent,
      previousAttempts: fraudLog.previousAttempts,
      transactionDetails: fraudLog.cardNumber ? {
        cardNumber: fraudLog.cardNumber,
        merchant: fraudLog.merchant || "Unknown",
        amount: fraudLog.amount
      } : undefined
    },
    notes: fraudLog.notes,
    reviewedBy: fraudLog.reviewedBy,
    reviewedAt: fraudLog.reviewedAt
  };
}

export default function FraudDetectionTable() {
  const [selectedDetection, setSelectedDetection] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    user: '',
    minRisk: '',
    maxRisk: '',
    dateFrom: '',
    dateTo: '',
    search: ''
  });
  
  // Use real API data with enhanced filtering
  const { fraudLogs, pagination, loading, error, refetch } = useFraudLogs({
    page: currentPage,
    limit: 10,
    ...Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    ),
  });
  
  const { updateStatus, loading: actionLoading } = useFraudLogActions();

  // Convert API data to display format
  const detections = fraudLogs.map(formatFraudLogForDisplay);

  const handleReviewClick = (detection: any) => {
    setSelectedDetection(detection);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateStatus(id, newStatus, "current-user");
      refetch(); // Refresh data after update
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const getBadgeColor = (status: string) => {
    switch (status) {
      case "Critical":
        return "error";
      case "Medium":
        return "warning";
      case "Resolved":
        return "success";
      case "In Review":
        return "info";
      case "False Positive":
        return "default";
      default:
        return "secondary";
    }
  };

  const renderStatusBadge = (status: string) => {
    if (status === "False Positive") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800 border border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
          False Positive
        </span>
      );
    }
    
    return (
      <Badge size="sm" color={getBadgeColor(status) as any}>
        {status}
      </Badge>
    );
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 90) return "text-red-600";
    if (risk >= 70) return "text-orange-500";
    return "text-green-600";
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500 dark:text-gray-400">Loading fraud logs...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500 dark:text-red-400">
          Error: {error}
          <button 
            onClick={() => refetch()} 
            className="ml-2 text-blue-500 hover:text-blue-700 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (detections.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500 dark:text-gray-400">No fraud logs found.</div>
      </div>
    );
  }

  return (
    <>
      {/* Enhanced Filters */}
      <FraudFilters 
        onFiltersChange={handleFiltersChange}
        initialFilters={filters}
      />
      
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Table Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Fraud Detection Logs
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {pagination ? 
                `Showing ${((pagination.page - 1) * pagination.limit) + 1}-${Math.min(pagination.page * pagination.limit, pagination.total)} of ${pagination.total} detections` :
                `Showing ${detections.length} detections`
              }
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Refresh Button */}
            <button
              onClick={() => refetch()}
              disabled={loading}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-6 py-4 font-medium text-gray-500 text-start text-sm dark:text-gray-400">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded" />
                </TableCell>
                <TableCell isHeader className="px-6 py-4 font-medium text-gray-500 text-start text-sm dark:text-gray-400">
                  Detection
                </TableCell>
                <TableCell isHeader className="px-6 py-4 font-medium text-gray-500 text-start text-sm dark:text-gray-400">
                  Transaction Type
                </TableCell>
                <TableCell isHeader className="px-6 py-4 font-medium text-gray-500 text-start text-sm dark:text-gray-400">
                  Jira Ticket
                </TableCell>
                <TableCell isHeader className="px-6 py-4 font-medium text-gray-500 text-start text-sm dark:text-gray-400">
                  Amount
                </TableCell>
                <TableCell isHeader className="px-6 py-4 font-medium text-gray-500 text-start text-sm dark:text-gray-400">
                  Type
                </TableCell>
                <TableCell isHeader className="px-6 py-4 font-medium text-gray-500 text-start text-sm dark:text-gray-400">
                  Risk
                </TableCell>
                <TableCell isHeader className="px-6 py-4 font-medium text-gray-500 text-start text-sm dark:text-gray-400">
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {detections.map((detection) => (
                <TableRow key={detection.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {detection.fraudId}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {detection.type}
                      </span>
                      <div className="flex items-center gap-2">
                        {renderStatusBadge(detection.status)}
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {detection.timeAgo}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Transaction Type */}
                  <TableCell className="px-6 py-4">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {detection.transactionType}
                    </span>
                  </TableCell>

                  {/* Jira Ticket */}
                  <TableCell className="px-6 py-4">
                    {detection.jiraTicketNumber ? (
                      <a
                        href={`https://livewild.atlassian.net/browse/${detection.jiraTicketNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {detection.jiraTicketNumber}
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {detection.amount}
                      </div>
                      <div className="text-sm text-green-600">
                        {detection.savings}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    {renderStatusBadge(detection.status)}
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${getRiskColor(detection.risk)}`}>
                        {detection.risk}%
                      </span>
                      <span className="text-sm text-gray-500">Risk</span>
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <button 
                      onClick={() => handleReviewClick(detection)}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                      Review
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-800">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {pagination.page} of {pagination.pages} ({pagination.total} total)
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage <= 1 || loading}
                className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
              >
                Previous
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    disabled={loading}
                    className={`px-3 py-1 text-sm rounded ${
                      currentPage === page
                        ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(pagination.pages, prev + 1))}
                disabled={currentPage >= pagination.pages || loading}
                className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <FraudReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        detection={selectedDetection}
        onStatusUpdate={handleStatusUpdate}
      />
    </>
  );
} 