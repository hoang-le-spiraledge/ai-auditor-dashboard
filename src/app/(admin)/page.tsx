import type { Metadata } from "next";
import { FraudMetrics } from "@/components/fraud/FraudMetrics";
import FraudDetectionChart from "@/components/fraud/FraudDetectionChart";

import FraudDetectionTable from "@/components/fraud/FraudDetectionTable";
import React from "react";

export const metadata: Metadata = {
  title: "Transaction Detection Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "Transaction Detection Dashboard for monitoring and managing security threats",
};

export default function FraudDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl dark:bg-blue-900/20">
            <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H16V16H8V11H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.4,8.7 10.4,10V11H13.6V10C13.6,8.7 12.8,8.2 12,8.2Z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Transaction Detection Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Monitor and analyze security threats in real-time
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
            Export
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <FraudMetrics />

      {/* Chart Section */}
      <FraudDetectionChart />

      {/* Detection Logs Table with Integrated Filters */}
      <FraudDetectionTable />
    </div>
  );
}
