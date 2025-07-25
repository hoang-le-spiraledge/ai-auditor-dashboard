import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../../../lib/prisma'

// GET /api/fraud-logs/[id] - Get single fraud log
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const fraudLog = await prisma.fraudLog.findUnique({
      where: { id }
    })
    
    if (!fraudLog) {
      return NextResponse.json(
        { error: 'Fraud log not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(fraudLog)
  } catch (error) {
    console.error('Error fetching fraud log:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fraud log' },
      { status: 500 }
    )
  }
}

// PUT /api/fraud-logs/[id] - Update fraud log
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const fraudLog = await prisma.fraudLog.update({
      where: { id },
      data: {
        type: body.type,
        description: body.description,
        user: body.user,
        amount: body.amount,
        savings: body.savings,
        risk: body.risk,
        status: body.status,
        ipAddress: body.ipAddress,
        location: body.location,
        device: body.device,
        userAgent: body.userAgent,
        previousAttempts: body.previousAttempts,
        cardNumber: body.cardNumber,
        merchant: body.merchant,
        notes: body.notes,
        // @ts-ignore will exist after regeneration
        transactionType: body.transactionType,
        // @ts-ignore
        jiraTicketNumber: body.jiraTicketNumber,
        reviewedBy: body.reviewedBy,
        reviewedAt: body.reviewedAt ? new Date(body.reviewedAt) : null,
      }
    })
    
    return NextResponse.json(fraudLog)
  } catch (error) {
    console.error('Error updating fraud log:', error)
    return NextResponse.json(
      { error: 'Failed to update fraud log' },
      { status: 500 }
    )
  }
}

// DELETE /api/fraud-logs/[id] - Delete fraud log
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.fraudLog.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Fraud log deleted successfully' })
  } catch (error) {
    console.error('Error deleting fraud log:', error)
    return NextResponse.json(
      { error: 'Failed to delete fraud log' },
      { status: 500 }
    )
  }
} 