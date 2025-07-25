import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const raw = await prisma.fraudLog.findMany({
    take: 10,
    orderBy: {
      createdAt: 'desc'
    }
  });
  const logs = raw.map(l => ({
    ...l,
    amount: l.amount?.toString()
  }));
  console.table(logs, [
    'id',
    'fraudId',
    'transactionType',
    'description',
    'user',
    'amount',
    'risk',
    'status',
    'jiraTicketNumber',
    'createdAt'
  ]);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect()); 