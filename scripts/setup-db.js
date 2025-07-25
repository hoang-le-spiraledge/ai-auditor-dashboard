#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up database for Fraud Detection Dashboard...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local from template...');
  const envExamplePath = path.join(process.cwd(), 'env.example');
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env.local');
    console.log('⚠️  Please update DATABASE_URL in .env.local with your MongoDB connection string');
    console.log('   Then run: npm run setup-db\n');
    process.exit(0);
  } else {
    console.log('❌ env.example not found. Please create .env.local manually');
    process.exit(1);
  }
}

// Check if DATABASE_URL is set
const envContent = fs.readFileSync(envPath, 'utf8');
if (envContent.includes('mongodb+srv://username:password')) {
  console.log('⚠️  Please update DATABASE_URL in .env.local with your actual MongoDB connection string');
  console.log('   Then run: npm run setup-db\n');
  process.exit(0);
}

console.log('🗄️  Pushing schema to database...');
try {
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log('✅ Schema pushed successfully');
} catch (error) {
  console.log('❌ Failed to push schema. Please check your DATABASE_URL');
  process.exit(1);
}

console.log('🌱 Seeding database with sample data...');
try {
  execSync('npm run db:seed', { stdio: 'inherit' });
  console.log('✅ Database seeded successfully');
} catch (error) {
  console.log('❌ Failed to seed database');
  process.exit(1);
}

console.log('\n🎉 Database setup completed!');
console.log('🚀 You can now start the development server with: npm run dev'); 