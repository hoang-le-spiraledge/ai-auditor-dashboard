"use client";
import React, { useState, useEffect } from "react";
import Badge from "../ui/badge/Badge";
import { useFraudLogActions } from "../../../hooks/useFraudLogs";

interface FraudLog {
  id: string;
  fraudId: string;
  type: string;
  description?: string;
  user: string;
  amount: string;
  savings: string;
  risk: number;
  status: string;
  ipAddress: string;
  location: string;
  device: string;
  userAgent: string;
  previousAttempts: number;
  cardNumber?: string;
  merchant?: string;
  transactionType?: string;
  jiraTicketNumber?: string;
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface FraudReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  detection: any;
  onStatusUpdate: (id: string, newStatus: string) => void;
}

export default function FraudReviewModal({
  isOpen,
  onClose,
  detection,
  onStatusUpdate,
}: FraudReviewModalProps) {
  const { updateFraudLog, loading } = useFraudLogActions();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    user: '',
    amount: '',
    savings: '',
    risk: 0,
    status: '',
    ipAddress: '',
    location: '',
    device: '',
    userAgent: '',
    previousAttempts: 0,
    cardNumber: '',
    merchant: '',
    transactionType: '',
    jiraTicketNumber: '',
    notes: ''
  });

  // Initialize form data when detection changes
  useEffect(() => {
    if (detection) {
      setFormData({
        type: detection.type || '',
        description: detection.description || '',
        user: detection.user || '',
        amount: detection.amount || '',
        savings: detection.savings || '',
        risk: detection.risk || 0,
        status: detection.status || '',
        ipAddress: detection.details?.ipAddress || '',
        location: detection.details?.location || '',
        device: detection.details?.device || '',
        userAgent: detection.details?.userAgent || '',
        previousAttempts: detection.details?.previousAttempts || 0,
        cardNumber: detection.details?.transactionDetails?.cardNumber || '',
        merchant: detection.details?.transactionDetails?.merchant || '',
        transactionType: detection.transactionType || '',
        jiraTicketNumber: detection.jiraTicketNumber || '',
        notes: detection.notes || ''
      });
    }
  }, [detection]);

  if (!isOpen || !detection) return null;

  const handleInputChange = (field: string, value: any) => {
    // Validate Jira ticket format if field is jiraTicketNumber
    if (field === 'jiraTicketNumber' && value) {
      const jiraPattern = /^TEND-\d{5}$/;
      if (!jiraPattern.test(value)) {
        alert('Jira ticket must be in format TEND-XXXXX (where X is a number)');
        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      await updateFraudLog(detection.id, {
        ...formData,
        reviewedBy: 'current-user', // In a real app, get from auth context
        reviewedAt: new Date().toISOString()
      });
      setIsEditing(false);
      onStatusUpdate(detection.id, formData.status);
      alert('Fraud log updated successfully!');
    } catch (error) {
      alert('Failed to update fraud log');
    }
  };

  const getBadgeColor = (status: string) => {
    switch (status) {
      case "Critical": return "error";
      case "Medium": return "warning";
      case "Resolved": return "success";
      case "In Review": return "info";
      case "False Positive": return "default";
      default: return "secondary";
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 90) return "text-red-600";
    if (risk >= 70) return "text-orange-500";
    return "text-green-600";
  };

  return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg">
              <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9l-5.91.74L12 22l-4.09-6.26L2 9l6.91-1.74L12 2z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Fraud Detection Review
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ID: {detection.fraudId} • {new Date(detection.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Details
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg dark:hover:bg-gray-700"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Status Update */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Quick Status Update
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Current Status:</span>
                <Badge size="sm" color={getBadgeColor(formData.status) as any}>
                  {formData.status}
                </Badge>
              </div>
              {!isEditing && (
                <div className="flex gap-2">
                  {['Critical', 'Medium', 'In Review', 'Resolved', 'False Positive'].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        handleInputChange('status', status);
                        onStatusUpdate(detection.id, status);
                      }}
                      className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                        formData.status === status
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Detection Details */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Detection Details
              </h3>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 space-y-4">
                
                {/* Type and Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Detection Type
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-lg dark:bg-gray-700">{formData.type}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority Level
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="Critical">Critical</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-lg dark:bg-gray-700">{formData.description}</p>
                    )}
                  </div>
                </div>

                {/* User and Risk */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      User
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.user}
                        onChange={(e) => handleInputChange('user', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-lg dark:bg-gray-700">{formData.user}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Risk Score (%)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.risk}
                        onChange={(e) => handleInputChange('risk', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className={`px-3 py-2 bg-gray-50 rounded-lg dark:bg-gray-700 font-semibold ${getRiskColor(formData.risk)}`}>
                        {formData.risk}%
                      </p>
                    )}
                  </div>
                </div>

                {/* Amount and Savings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Amount
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.amount}
                        onChange={(e) => handleInputChange('amount', e.target.value)}
                        placeholder="$1,000.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-lg dark:bg-gray-700 font-semibold">
                        {formData.amount}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Potential Savings
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.savings}
                        onChange={(e) => handleInputChange('savings', e.target.value)}
                        placeholder="$800.00"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-lg dark:bg-gray-700 font-semibold text-green-600">
                        {formData.savings}
                      </p>
                    )}
                  </div>
                </div>

                {/* Status */}
                {isEditing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="Critical">Critical</option>
                      <option value="Medium">Medium</option>
                      <option value="In Review">In Review</option>
                      <option value="Resolved">Resolved</option>
                      <option value="False Positive">False Positive</option>
                    </select>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Investigation Notes
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={3}
                      placeholder="Add investigation notes..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  ) : (
                    <p className="px-3 py-2 bg-gray-50 rounded-lg dark:bg-gray-700 min-h-[80px]">
                      {formData.notes || 'No notes added yet.'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Technical Details */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Technical Details
              </h3>
              <div className="space-y-4">
                
                {/* Session Information */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Session Information</h4>
                  <div className="space-y-3">
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        IP Address
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.ipAddress}
                          onChange={(e) => handleInputChange('ipAddress', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      ) : (
                        <p className="text-sm font-mono bg-gray-50 px-2 py-1 rounded dark:bg-gray-700">
                          {formData.ipAddress}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Location
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      ) : (
                        <p className="text-sm bg-gray-50 px-2 py-1 rounded dark:bg-gray-700">
                          {formData.location}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Device
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.device}
                          onChange={(e) => handleInputChange('device', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      ) : (
                        <p className="text-sm bg-gray-50 px-2 py-1 rounded dark:bg-gray-700">
                          {formData.device}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Previous Attempts
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          min="0"
                          value={formData.previousAttempts}
                          onChange={(e) => handleInputChange('previousAttempts', parseInt(e.target.value))}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      ) : (
                        <p className="text-sm bg-gray-50 px-2 py-1 rounded dark:bg-gray-700">
                          {formData.previousAttempts}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Transaction Details</h4>
                  <div className="space-y-3">
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Transaction Type
                      </label>
                      {isEditing ? (
                        <select
                          value={formData.transactionType}
                          onChange={(e) => handleInputChange('transactionType', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="">Select type</option>
                          <option value="purchase">Purchase</option>
                          <option value="refund">Refund</option>
                          <option value="discount">Discount</option>
                          <option value="chargeback">Chargeback</option>
                        </select>
                      ) : (
                        <p className="text-sm bg-gray-50 px-2 py-1 rounded dark:bg-gray-700">
                          {formData.transactionType || 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Jira Ticket
                      </label>
                      {isEditing ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={formData.jiraTicketNumber}
                            onChange={(e) => handleInputChange('jiraTicketNumber', e.target.value)}
                            placeholder="TEND-12345"
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          />
                          {formData.jiraTicketNumber && (
                            <a
                              href={`https://livewild.atlassian.net/browse/${formData.jiraTicketNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              View
                            </a>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <p className="text-sm bg-gray-50 px-2 py-1 rounded dark:bg-gray-700">
                            {formData.jiraTicketNumber || 'Not provided'}
                          </p>
                          {formData.jiraTicketNumber && (
                            <a
                              href={`https://livewild.atlassian.net/browse/${formData.jiraTicketNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              View in Jira
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Card Number
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                          placeholder="**** **** **** 1234"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      ) : (
                        <p className="text-sm font-mono bg-gray-50 px-2 py-1 rounded dark:bg-gray-700">
                          {formData.cardNumber || 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Merchant
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.merchant}
                          onChange={(e) => handleInputChange('merchant', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                      ) : (
                        <p className="text-sm bg-gray-50 px-2 py-1 rounded dark:bg-gray-700">
                          {formData.merchant || 'Not provided'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* User Agent (Read-only for space) */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">User Agent</h4>
                  <p className="text-xs font-mono bg-gray-50 px-2 py-2 rounded dark:bg-gray-700 break-all">
                    {formData.userAgent}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 