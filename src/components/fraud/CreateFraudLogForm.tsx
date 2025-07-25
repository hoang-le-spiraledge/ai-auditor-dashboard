"use client";
import React, { useState } from "react";
import { useFraudLogActions } from "../../../hooks/useFraudLogs";
import { CreateFraudLogData } from "../../../lib/api/fraud-logs";

interface CreateFraudLogFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreateFraudLogForm({ onSuccess, onCancel }: CreateFraudLogFormProps) {
  const { createFraudLog, loading, error } = useFraudLogActions();
  const [formData, setFormData] = useState<CreateFraudLogData>({
    user: "",
    amount: "",
    risk: 50,
    status: "In Review",
    description: "Medium",
    transactionType: "",
    jiraTicketNumber: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await createFraudLog(formData);
    if (result) {
      alert("Fraud log created successfully!");
      onSuccess?.();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'risk' || name === 'previousAttempts' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 dark:bg-gray-900 dark:border-gray-800">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Create New Fraud Log
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description ?? ""}
              onChange={handleChange}
              placeholder="e.g., Medium risk refund"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Severity
            </label>
            <select
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              User *
            </label>
            <input
              type="text"
              name="user"
              value={formData.user}
              onChange={handleChange}
              required
              placeholder="username"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Risk Score (0-100) *
            </label>
            <input
              type="number"
              name="risk"
              value={formData.risk}
              onChange={handleChange}
              required
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Financial Information */}
          {/* Transaction Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Transaction Type
            </label>
            <select
              name="transactionType"
              value={formData.transactionType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="">Select type</option>
              <option value="purchase">Purchase</option>
              <option value="refund">Refund</option>
              <option value="discount">Discount</option>
              <option value="chargeback">Chargeback</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount *
            </label>
            <input
              type="text"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              placeholder="$1,000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Jira Ticket */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Jira Ticket
            </label>
            <input
              type="text"
              name="jiraTicketNumber"
              value={formData.jiraTicketNumber}
              onChange={handleChange}
              placeholder="TEND-12345"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        {/* User Agent */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            User Agent *
          </label>
          <input
            type="text"
            name="userAgent"
            onChange={() => {}}
            placeholder="(deprecated)"
            className="hidden" />
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes / AI Suggestion
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Add notes or AI suggestion"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            ></textarea>
          </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Fraud Log"}
          </button>
        </div>
      </form>
    </div>
  );
} 