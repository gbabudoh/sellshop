# Sellshop Setup Guide

## Initial Setup

### 1. Database Setup

#### PostgreSQL Installation

- Install PostgreSQL 14+
- Create a new database: `createdb sellshop`
- Update `DATABASE_URL` in `.env.local`

#### Run Migrations

```bash
npx prisma migrate dev --name init
```

This will:

- Create all tables based on the schema
- Generate Prisma client
- Seed initial data (if configured)

### 2. Environment Configuration

Create `.env.local` with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sellshop"

# NextAuth Configuration
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# File Storage (MinIO - Optional)
MINIO_ENDPOINT="localhost"
MINIO_PORT="9000"
MINIO_USE_SSL="false"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_BUCKET_NAME="sellshop"
MINIO_PUBLIC_URL="http://localhost:9000"

# Image Optimization (imgproxy - Optional)
IMGPROXY_URL="http://localhost:8080"
IMGPROXY_KEY=""
IMGPROXY_SALT=""
```

### 3. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Copy the output to `NEXTAUTH_SECRET` in `.env.local`

### 4. Install Dependencies

```bash
npm install
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Optional Services Setup

### MinIO (File Storage)

```bash
# Using Docker
docker run -p 9000:9000 -p 9001:9001 \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin \
  minio/minio server /data --console-address ":9001"
```

Access MinIO Console: `http://localhost:9001`

### imgproxy (Image Optimization)

```bash
# Using Docker
docker run -p 8080:8080 \
  -e IMGPROXY_KEY=your-key \
  -e IMGPROXY_SALT=your-salt \
  darthsim/imgproxy
```

## Database Schema Overview

### Users

- Authentication with email/password or OAuth
- Seller/Buyer roles
- Ratings and reviews
- Location data for local matching

### Products

- Title, description, price, condition
- Multiple images
- Category and location
- Seller information
- View count tracking

### Orders

- Escrow payment system
- Order status tracking
- Meeting details for local pickup
- Commission calculation (8%)

### Reviews & Messages

- Seller/buyer feedback
- In-app messaging system
- Notification tracking

## Testing the Application

### Create Test User

1. Visit `http://localhost:3000/signup`
2. Create account with test credentials
3. Verify email (in development, check console)

### Test Seller Flow

1. Sign in as seller
2. Navigate to `/dashboard/sell`
3. Click "List New Item"
4. Fill in product details
5. Submit listing

### Test Buyer Flow

1. Sign in as buyer
2. Browse `/products`
3. Search or filter items
4. Click on product to view details
5. Click "Buy Now" to initiate order

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql postgresql://user:password@localhost:5432/sellshop

# Reset database
npx prisma migrate reset
```

### Prisma Client Issues

```bash
# Regenerate Prisma client
npx prisma generate
```

### NextAuth Issues

- Ensure `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Verify database connection

### Build Issues

```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

## Production Deployment

### Environment Variables

Update all environment variables for production:

- Use strong `NEXTAUTH_SECRET`
- Set `NEXTAUTH_URL` to production domain
- Configure production database
- Set up OAuth credentials for production

### Database

```bash
# Run migrations on production
npx prisma migrate deploy
```

### Build & Start

```bash
npm run build
npm start
```

## Development Tips

### Prisma Studio

```bash
# Open Prisma Studio to view/edit database
npx prisma studio
```

### Database Seeding

Create `prisma/seed.ts` for test data:

```typescript
import { prisma } from "@/lib/db";

async function main() {
  // Add seed data here
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run with: `npx prisma db seed`

### Hot Reload

Development server automatically reloads on file changes. Check console for errors.

## Next Steps

1. Configure OAuth providers (Google, etc.)
2. Set up MinIO for file uploads
3. Implement payment processing (Stripe)
4. Add email notifications
5. Set up monitoring and logging
