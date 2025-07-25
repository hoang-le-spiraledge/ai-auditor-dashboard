# MongoDB + Prisma Setup Instructions

## 🔧 Step 1: Install Required Dependencies

```bash
# Install Prisma and MongoDB client
npm install prisma @prisma/client

# Install Prisma CLI globally (optional but recommended)
npm install -g prisma
```

## 🌐 Step 2: Set Up MongoDB Database

### Option A: MongoDB Atlas (Cloud - Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)

### Option B: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/frauddetection`

## 📝 Step 3: Environment Configuration

Create `.env.local` file in your project root:

```env
# Database
DATABASE_URL="mongodb+srv://username:password@cluster0.mongodb.net/frauddetection?retryWrites=true&w=majority"

# Replace with your actual MongoDB connection string
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/dbname
# For local MongoDB: mongodb://localhost:27017/frauddetection

# NextJS
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

## 🗄️ Step 4: Initialize Prisma

```bash
# Initialize Prisma (if not already done)
npx prisma init

# Generate Prisma client
npx prisma generate

# Push schema to database (creates collections)
npx prisma db push
```

## 📊 Step 5: Seed Database (Optional)

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample fraud logs
  const fraudLogs = [
    {
      fraudId: 'AUD-001',
      type: 'Device fingerprint mismatch',
      description: 'Critical',
      user: 'john.doe',
      amount: '$5,000',
      savings: 'Save $1,000',
      risk: 85,
      status: 'In Review',
      ipAddress: '192.168.1.100',
      location: 'New York, NY, USA',
      device: 'iPhone 14 Pro',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
      previousAttempts: 3,
      cardNumber: '**** **** **** 1234',
      merchant: 'Amazon.com',
    },
    {
      fraudId: 'AUD-002',
      type: 'Suspicious login pattern',
      description: 'Medium',
      user: 'jane.smith',
      amount: '$2,500',
      savings: 'Save $500',
      risk: 65,
      status: 'Resolved',
      ipAddress: '10.0.0.50',
      location: 'Los Angeles, CA, USA',
      device: 'MacBook Pro',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      previousAttempts: 1,
      cardNumber: '**** **** **** 5678',
      merchant: 'PayPal',
    },
  ]

  for (const fraudLog of fraudLogs) {
    await prisma.fraudLog.create({
      data: fraudLog,
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Run the seed:
```bash
npx prisma db seed
```

Add to `package.json`:
```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

## 🔄 Step 6: Update Your Frontend Component

Update your `FraudDetectionTable.tsx` to use real data:

```typescript
"use client";
import React, { useState } from "react";
import { useFraudLogs, useFraudLogActions } from "../../hooks/useFraudLogs";
// ... other imports

export default function FraudDetectionTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  
  // Use real API data instead of static data
  const { fraudLogs, pagination, loading, error, refetch } = useFraudLogs({
    page: currentPage,
    limit: 10,
    status: statusFilter || undefined,
  });
  
  const { updateStatus } = useFraudLogActions();

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    await updateStatus(id, newStatus, "current-user");
    refetch(); // Refresh data after update
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading fraud logs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  // Rest of your component remains the same...
  // Just replace `fraudData` with `fraudLogs`
}
```

## 🧪 Step 7: Test Your API

You can test your API endpoints using curl or Postman:

### Get all fraud logs:
```bash
curl http://localhost:3000/api/fraud-logs
```

### Create a new fraud log:
```bash
curl -X POST http://localhost:3000/api/fraud-logs \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Card testing detected",
    "description": "High",
    "user": "test.user",
    "amount": "$1,000",
    "savings": "Save $200",
    "risk": 75,
    "status": "In Review",
    "ipAddress": "192.168.1.50",
    "location": "Chicago, IL, USA",
    "device": "Windows PC",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "previousAttempts": 2,
    "cardNumber": "**** **** **** 9999",
    "merchant": "Test Store"
  }'
```

### Update a fraud log:
```bash
curl -X PUT http://localhost:3000/api/fraud-logs/[id] \
  -H "Content-Type: application/json" \
  -d '{"status": "Resolved", "notes": "Verified as legitimate transaction"}'
```

### Delete a fraud log:
```bash
curl -X DELETE http://localhost:3000/api/fraud-logs/[id]
```

## 📁 Final File Structure

```
your-project/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── lib/
│   ├── prisma.ts
│   └── api/
│       └── fraud-logs.ts
├── hooks/
│   └── useFraudLogs.ts
├── src/
│   └── app/
│       └── api/
│           └── fraud-logs/
│               ├── route.ts
│               └── [id]/
│                   └── route.ts
├── .env.local
└── package.json
```

## 🚀 Start Your Application

```bash
npm run dev
```

Your fraud detection dashboard will now be connected to a real MongoDB database!

## 🔍 Database Management

### View your database:
```bash
npx prisma studio
```

### Reset database:
```bash
npx prisma db push --force-reset
```

### Generate new Prisma client after schema changes:
```bash
npx prisma generate
```

## 🛡️ Production Considerations

1. **Environment Variables**: Use proper environment variables for production
2. **Authentication**: Add authentication middleware to protect API routes
3. **Validation**: Add request validation using libraries like Zod
4. **Rate Limiting**: Implement rate limiting for API routes
5. **Logging**: Add proper logging for debugging and monitoring
6. **Error Handling**: Implement comprehensive error handling

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) 