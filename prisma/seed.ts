import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  console.log('🧹 Clearing existing data...')
  await prisma.fraudLog.deleteMany({})
  await prisma.user.deleteMany({})

  // Create sample users
  console.log('👥 Creating sample users...')
  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: 'john_analyst',
        email: 'john.analyst@company.com',
        role: 'analyst'
      }
    }),
    prisma.user.create({
      data: {
        username: 'sarah_admin',
        email: 'sarah.admin@company.com',
        role: 'admin'
      }
    }),
    prisma.user.create({
      data: {
        username: 'mike_reviewer',
        email: 'mike.reviewer@company.com',
        role: 'analyst'
      }
    })
  ])

  console.log(`✅ Created ${users.length} users`)

  // Sample fraud types
  const fraudTypes = [
    'Device fingerprint mismatch',
    'Suspicious IP address',
    'Multiple failed login attempts',
    'Unusual transaction pattern',
    'Geographic location anomaly',
    'Card number mismatch',
    'Suspicious user agent',
    'Velocity check failure',
    'Device ID spoofing',
    'Proxy/VPN detection'
  ]

  // Sample locations
  const locations = [
    'New York, NY, USA',
    'Los Angeles, CA, USA',
    'Chicago, IL, USA',
    'Houston, TX, USA',
    'Phoenix, AZ, USA',
    'Philadelphia, PA, USA',
    'San Antonio, TX, USA',
    'San Diego, CA, USA',
    'Dallas, TX, USA',
    'San Jose, CA, USA',
    'London, UK',
    'Paris, France',
    'Berlin, Germany',
    'Madrid, Spain',
    'Rome, Italy'
  ]

  // Sample devices
  const devices = [
    'iPhone 15 Pro',
    'Samsung Galaxy S24',
    'MacBook Pro 16"',
    'Dell XPS 13',
    'iPad Pro 12.9"',
    'Google Pixel 8',
    'Windows Desktop',
    'Linux Desktop',
    'Android Tablet',
    'Unknown Device'
  ]

  // Sample user agents
  const userAgents = [
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    'Mozilla/5.0 (Android 14; Mobile; rv:109.0) Gecko/109.0',
    'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
  ]

  // Sample merchants
  const merchants = [
    'Amazon.com',
    'Walmart',
    'Target',
    'Best Buy',
    'Home Depot',
    'Costco',
    'Starbucks',
    'McDonald\'s',
    'Uber',
    'Netflix',
    'Spotify',
    'Apple Store',
    'Google Play',
    'Steam',
    'PlayStation Store'
  ]

  // Generate sample fraud logs
  console.log('🚨 Creating sample fraud logs...')
  const fraudLogs = []

  for (let i = 1; i <= 50; i++) {
    const fraudId = `AUD-${String(i).padStart(3, '0')}`
    const type = fraudTypes[Math.floor(Math.random() * fraudTypes.length)]
    const status = ['Critical', 'Medium', 'Resolved', 'In Review', 'False Positive'][Math.floor(Math.random() * 5)]
    const risk = Math.floor(Math.random() * 100) + 1
    const amount = (Math.random() * 10000 + 100).toFixed(2)
    const savings = (Math.random() * 5000 + 50).toFixed(2)
    const location = locations[Math.floor(Math.random() * locations.length)]
    const device = devices[Math.floor(Math.random() * devices.length)]
    const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)]
    const merchant = merchants[Math.floor(Math.random() * merchants.length)]
    const transactionType = ['refund', 'discount', 'chargeback', 'dispute'][Math.floor(Math.random() * 4)]
    const jiraTicket = `TEND-${String(Math.floor(Math.random() * 99999) + 10000)}`
    
    const fraudLog = await prisma.fraudLog.create({
      data: {
        fraudId,
        type,
        description: `Suspicious activity detected for ${fraudId}`,
        user: `user_${Math.floor(Math.random() * 1000) + 1}`,
        amount,
        savings,
        risk,
        status,
        ipAddress: `${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255) + 1}`,
        location,
        device,
        userAgent,
        previousAttempts: Math.floor(Math.random() * 10),
        cardNumber: `****-****-****-${String(Math.floor(Math.random() * 9999) + 1000)}`,
        merchant,
        transactionType,
        jiraTicketNumber: jiraTicket,
        notes: status === 'Resolved' ? 'Case resolved after investigation' : 
               status === 'False Positive' ? 'Confirmed as legitimate activity' : 
               'Under investigation',
        reviewedBy: status === 'Resolved' || status === 'False Positive' ? 
                   users[Math.floor(Math.random() * users.length)].username : null,
        reviewedAt: status === 'Resolved' || status === 'False Positive' ? 
                   new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null
      }
    })
    
    fraudLogs.push(fraudLog)
  }

  console.log(`✅ Created ${fraudLogs.length} fraud logs`)

  // Create some recent high-risk fraud logs
  console.log('🔥 Creating recent high-risk fraud logs...')
  const recentHighRiskLogs = []
  
  for (let i = 1; i <= 10; i++) {
    const fraudId = `AUD-${String(51 + i).padStart(3, '0')}`
    const recentFraudLog = await prisma.fraudLog.create({
      data: {
        fraudId,
        type: fraudTypes[Math.floor(Math.random() * fraudTypes.length)],
        description: `High-risk fraud detected - requires immediate attention`,
        user: `user_${Math.floor(Math.random() * 1000) + 1}`,
        amount: (Math.random() * 50000 + 1000).toFixed(2),
        savings: (Math.random() * 25000 + 500).toFixed(2),
        risk: Math.floor(Math.random() * 40) + 60, // 60-100% risk
        status: 'Critical',
        ipAddress: `${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255) + 1}`,
        location: locations[Math.floor(Math.random() * locations.length)],
        device: devices[Math.floor(Math.random() * devices.length)],
        userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
        previousAttempts: Math.floor(Math.random() * 20) + 5,
        cardNumber: `****-****-****-${String(Math.floor(Math.random() * 9999) + 1000)}`,
        merchant: merchants[Math.floor(Math.random() * merchants.length)],
        transactionType: ['refund', 'discount', 'chargeback'][Math.floor(Math.random() * 3)],
        jiraTicketNumber: `TEND-${String(Math.floor(Math.random() * 99999) + 10000)}`,
        notes: 'High-risk case requiring immediate review',
        createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) // Last 24 hours
      }
    })
    
    recentHighRiskLogs.push(recentFraudLog)
  }

  console.log(`✅ Created ${recentHighRiskLogs.length} recent high-risk fraud logs`)

  console.log('🎉 Database seeding completed successfully!')
  console.log(`📊 Summary:`)
  console.log(`   - Users: ${users.length}`)
  console.log(`   - Total Fraud Logs: ${fraudLogs.length + recentHighRiskLogs.length}`)
  console.log(`   - Recent High-Risk: ${recentHighRiskLogs.length}`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 