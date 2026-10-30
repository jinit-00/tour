const { PrismaClient } = require('@prisma/client');

// Global PrismaClient singleton for serverless and Node environments
// Reuses the database connection pool across invocations to prevent connection exhaustion
const prismaClientPropertyName = '__prisma_shared_client__';

let prisma;

if (!global[prismaClientPropertyName]) {
  global[prismaClientPropertyName] = new PrismaClient({
    log: process.env.PRISMA_LOG === 'true' ? ['query', 'error', 'warn'] : ['error'],
  });
}
prisma = global[prismaClientPropertyName];

module.exports = prisma;
