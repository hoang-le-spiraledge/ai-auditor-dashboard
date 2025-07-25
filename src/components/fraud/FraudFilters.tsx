"use client";
import React, { useState } from "react";

interface FilterOptions {
  status: string;
  type: string;
  user: string;
  minRisk: string;
  maxRisk: string;
  dateFrom: string;
  dateTo: string;
  search: string;
}

interface FraudFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  initialFilters?: Partial<FilterOptions>;
}

export default function FraudFilters({ onFiltersChange, initialFilters = {} }: FraudFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    status: initialFilters.status || '',
    type: initialFilters.type || '',
    user: initialFilters.user || '',
    minRisk: initialFilters.minRisk || '',
    maxRisk: initialFilters.maxRisk || '',
    dateFrom: initialFilters.dateFrom || '',
    dateTo: initialFilters.dateTo || '',
    search: initialFilters.search || ''
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      status: '',
      type: '',
      user: '',
      minRisk: '',
      maxRisk: '',
      dateFrom: '',
      dateTo: '',
      search: ''
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
      {/* Quick Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search fraud logs..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Quick Status Filters */}
        <div className="flex gap-2">
          {['Critical', 'Medium', 'In Review', 'Resolved'].map((status) => (
            <button
              key={status}
              onClick={() => handleFilterChange('status', filters.status === status ? '' : status)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                filters.status === status
                  ? 'bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          {isExpanded ? (
            <>
              <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Less Filters
            </>
          ) : (
            <>
              <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              More Filters
            </>
          )}
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Detection Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Detection Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="Device fingerprint mismatch">Device fingerprint mismatch</option>
                <option value="Suspicious login pattern">Suspicious login pattern</option>
                <option value="Identity verification failed">Identity verification failed</option>
                <option value="Card testing detected">Card testing detected</option>
                <option value="Unusual transaction pattern">Unusual transaction pattern</option>
                <option value="Location anomaly">Location anomaly</option>
                <option value="Velocity check failed">Velocity check failed</option>
              </select>
            </div>

            {/* User */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                User
              </label>
              <input
                type="text"
                placeholder="Enter username"
                value={filters.user}
                onChange={(e) => handleFilterChange('user', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Risk Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Risk Range (%)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  min="0"
                  max="100"
                  value={filters.minRisk}
                  onChange={(e) => handleFilterChange('minRisk', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="self-center text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  min="0"
                  max="100"
                  value={filters.maxRisk}
                  onChange={(e) => handleFilterChange('maxRisk', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Range
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Quick Risk Filters */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quick Risk Filters
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  handleFilterChange('minRisk', '0');
                  handleFilterChange('maxRisk', '30');
                }}
                className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                  filters.minRisk === '0' && filters.maxRisk === '30'
                    ? 'bg-green-100 border-green-300 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-300'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                Low Risk (0-30%)
              </button>
              <button
                onClick={() => {
                  handleFilterChange('minRisk', '31');
                  handleFilterChange('maxRisk', '70');
                }}
                className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                  filters.minRisk === '31' && filters.maxRisk === '70'
                    ? 'bg-yellow-100 border-yellow-300 text-yellow-700 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-300'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                Medium Risk (31-70%)
              </button>
              <button
                onClick={() => {
                  handleFilterChange('minRisk', '71');
                  handleFilterChange('maxRisk', '100');
                }}
                className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                  filters.minRisk === '71' && filters.maxRisk === '100'
                    ? 'bg-red-100 border-red-300 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-300'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                High Risk (71-100%)
              </button>
            </div>
          </div>

          {/* Quick Date Filters */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Quick Date Filters
            </label>
            <div className="flex gap-2">
              {[
                { label: 'Today', days: 0 },
                { label: 'Last 7 days', days: 7 },
                { label: 'Last 30 days', days: 30 },
                { label: 'Last 90 days', days: 90 }
              ].map(({ label, days }) => (
                <button
                  key={label}
                  onClick={() => {
                    const today = new Date();
                    const fromDate = new Date();
                    fromDate.setDate(today.getDate() - days);
                    
                    handleFilterChange('dateFrom', fromDate.toISOString().split('T')[0]);
                    handleFilterChange('dateTo', today.toISOString().split('T')[0]);
                  }}
                  className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Active filters:</span>
            <div className="flex flex-wrap gap-1">
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null;
                
                let displayValue = value;
                if (key === 'minRisk' || key === 'maxRisk') {
                  displayValue = `${value}%`;
                }
                
                return (
                  <span
                    key={key}
                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded-md dark:bg-blue-900 dark:text-blue-300"
                  >
                    {key}: {displayValue}
                    <button
                      onClick={() => handleFilterChange(key as keyof FilterOptions, '')}
                      className="ml-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 