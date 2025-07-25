"use client";
import React from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@/icons";
import { useFraudMetrics } from "../../../hooks/useFraudLogs";

export const FraudMetrics = () => {
  const { metrics, loading, error } = useFraudMetrics();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        <div className="col-span-full rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-800 dark:bg-red-900/20">
          <div className="text-red-600 dark:text-red-400">
            Error loading metrics: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {/* Total Detections */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total Detections
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-3xl dark:text-white/90">
              {metrics.totalDetections.toLocaleString()}
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Total fraud attempts detected
            </span>
          </div>
          <div className="flex items-center justify-center w-10 h-10 text-gray-400">
            <ArrowUpIcon className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Critical Issues */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Critical Issues
            </span>
            <h4 className="mt-2 font-bold text-red-600 text-3xl">
              {metrics.criticalIssues.toLocaleString()}
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Requires immediate attention
            </span>
          </div>
          <div className="flex items-center justify-center w-10 h-10 text-red-400">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 22L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Potential Savings */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Potential Savings
            </span>
            <h4 className="mt-2 font-bold text-green-600 text-3xl">
              {formatCurrency(metrics.totalSavings)}
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              From prevented fraud
            </span>
          </div>
          <div className="flex items-center justify-center w-10 h-10 text-green-400">
            <ArrowUpIcon className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Average Risk Score */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Average Risk
            </span>
            <h4 className={
              isFinite(metrics.averageRisk)
                ? `mt-2 font-bold text-3xl ${
                    metrics.averageRisk >= 80 ? 'text-red-600' :
                    metrics.averageRisk >= 60 ? 'text-orange-500' :
                    metrics.averageRisk >= 40 ? 'text-yellow-500' : 'text-green-600'
                  }`
                : 'mt-2 font-bold text-green-600 text-3xl'
            }>
              {isFinite(metrics.averageRisk) ? metrics.averageRisk + '%' : 'N/A'}
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Risk assessment score
            </span>
          </div>
          <div className={`flex items-center justify-center w-10 h-10 ${
            metrics.averageRisk >= 80 ? 'text-red-400' : 
            metrics.averageRisk >= 60 ? 'text-orange-400' : 
            'text-green-400'
          }`}>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}; 