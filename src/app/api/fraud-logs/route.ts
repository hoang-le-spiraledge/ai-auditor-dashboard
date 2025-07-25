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
    const minRisk = searchParams.get('minRisk')
    const maxRisk = searchParams.get('maxRisk')
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
    
    // Risk range filter
    if (minRisk || maxRisk) {
      where.risk = {}
      if (minRisk) where.risk.gte = parseInt(minRisk)
      if (maxRisk) where.risk.lte = parseInt(maxRisk)
    }
    
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
        type: body.type,
        description: body.description,
        user: body.user,
        amount: body.amount,
        savings: body.savings,
        risk: body.risk,
        status: body.status || 'In Review',
        ipAddress: body.ipAddress,
        location: body.location,
        device: body.device,
        userAgent: body.userAgent,
        previousAttempts: body.previousAttempts || 0,
        cardNumber: body.cardNumber,
        merchant: body.merchant,
        notes: body.notes,
        // @ts-ignore - field will exist after prisma client regeneration
        transactionType: body.transactionType,
        // @ts-ignore - field will exist after prisma client regeneration
        jiraTicketNumber: body.jiraTicketNumber,
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