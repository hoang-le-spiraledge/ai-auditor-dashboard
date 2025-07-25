import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'

// GET /api/fraud-logs - List all fraud logs with enhanced filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const user = searchParams.get('user')
    const riskLevel = searchParams.get('risk')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const search = searchParams.get('search')
    
    const skip = (page - 1) * limit
    
    // Build filter conditions
    const where: any = {}
    
    // Status filter
    if (status) where.status = status
    
    // Type filter (case insensitive)
    if (type) where.type = { contains: type, mode: 'insensitive' }
    
    // User filter (case insensitive)
    if (user) where.user = { contains: user, mode: 'insensitive' }
    
    // Risk level filter (CRITICAL/HIGH/...)
    if (riskLevel) where.risk_level = riskLevel
    
    // Date range filter
    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) where.createdAt.gte = new Date(dateFrom)
      if (dateTo) where.createdAt.lte = new Date(dateTo)
    }
    
    // General search across multiple fields
    if (search) {
      where.OR = [
        { type: { contains: search, mode: 'insensitive' } },
        { user: { contains: search, mode: 'insensitive' } },
        { fraudId: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { device: { contains: search, mode: 'insensitive' } },
        { merchant: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    // Get fraud logs with pagination
    const fraudLogs = await prisma.fraudLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    })
    
    // Get total count for pagination
    const total = await prisma.fraudLog.count({ where })
    
    return NextResponse.json({
      data: fraudLogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching fraud logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fraud logs' },
      { status: 500 }
    )
  }
}

// POST /api/fraud-logs - Create new fraud log
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Generate fraud ID (like AUD-XXX)
    const fraudId = `AUD-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
    
    const fraudLog = await prisma.fraudLog.create({
      data: {
        fraudId,
        description: body.description,
        user: body.user,
        amount: body.amount,
        risk: body.risk,
        status: body.status || 'In Review',
        transactionType: body.transactionType,
        jiraTicketNumber: body.jiraTicketNumber,
        notes: body.notes,
        aiSuggestion: body.aiSuggestion,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })
    
    return NextResponse.json(fraudLog, { status: 201 })
  } catch (error) {
    console.error('Error creating fraud log:', error)
    return NextResponse.json(
      { error: 'Failed to create fraud log' },
      { status: 500 }
    )
  }
} 