// Types
export interface FraudLog {
  id: string
  fraudId: string
  type: string
  description?: string
  user: string
  amount: string
  savings: string
  risk: number
  status: string
  transactionType?: string
  jiraTicketNumber?: string
  ipAddress: string
  location: string
  device: string
  userAgent: string
  previousAttempts: number
  cardNumber?: string
  merchant?: string
  notes?: string
  reviewedBy?: string
  reviewedAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateFraudLogData {
  type: string
  description?: string
  user: string
  amount: string
  savings: string
  risk: number
  status?: string
  transactionType?: string
  jiraTicketNumber?: string
  ipAddress: string
  location: string
  device: string
  userAgent: string
  previousAttempts?: number
  cardNumber?: string
  merchant?: string
  notes?: string
}

export interface UpdateFraudLogData extends Partial<CreateFraudLogData> {
  transactionType?: string
  jiraTicketNumber?: string
  reviewedBy?: string
  reviewedAt?: string
}

export interface FraudLogResponse {
  data: FraudLog[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// API Functions
export class FraudLogAPI {
  private static baseUrl = '/api/fraud-logs'

  // Get all fraud logs with optional filters
  static async getAll(params?: {
    page?: number
    limit?: number
    status?: string
    type?: string
  }): Promise<FraudLogResponse> {
    const searchParams = new URLSearchParams()
    
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.status) searchParams.set('status', params.status)
    if (params?.type) searchParams.set('type', params.type)
    
    const url = `${this.baseUrl}?${searchParams.toString()}`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch fraud logs')
    }
    
    return response.json()
  }

  // Get single fraud log by ID
  static async getById(id: string): Promise<FraudLog> {
    const response = await fetch(`${this.baseUrl}/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch fraud log')
    }
    
    return response.json()
  }

  // Create new fraud log
  static async create(data: CreateFraudLogData): Promise<FraudLog> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('Failed to create fraud log')
    }
    
    return response.json()
  }

  // Update fraud log
  static async update(id: string, data: UpdateFraudLogData): Promise<FraudLog> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update fraud log')
    }
    
    return response.json()
  }

  // Delete fraud log
  static async delete(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete fraud log')
    }
  }

  // Update status only
  static async updateStatus(id: string, status: string, reviewedBy?: string): Promise<FraudLog> {
    return this.update(id, {
      status,
      reviewedBy,
      reviewedAt: new Date().toISOString(),
    })
  }
} 