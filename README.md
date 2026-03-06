# Sellshop - Local Peer-to-Peer Marketplace

A modern, secure peer-to-peer marketplace for buying and selling items locally. Built with Next.js, PostgreSQL, and Prisma.

## 🎯 Project Overview

Sellshop is a hyperlocal marketplace focused on:

- **Local Pickup Only**: Eliminate shipping complexity and fraud
- **Secure Escrow**: Payment held safely until both parties confirm
- **Simple & Fast**: List items in seconds, complete transactions locally
- **Fair Pricing**: 8% commission keeps costs low for everyone

## 🏗️ Project Structure

```
sellshop/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── api/               # API routes
│   │   ├── products/          # Product browsing
│   │   ├── signin/            # Sign in page
│   │   ├── signup/            # Sign up page
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── auth/                  # Authentication logic
│   │   └── auth-options.ts    # NextAuth configuration
│   ├── components/            # Reusable UI components
│   │   ├── common/            # Basic components (Button, Input)
│   │   ├── layout/            # Layout components (Header, Footer)
│   │   └── product/           # Product components (ListingCard)
│   ├── hooks/                 # React hooks
│   │   ├── useAuth.ts         # Authentication hook
│   │   └── useDebounce.ts     # Debounce hook
│   ├── lib/                   # Utilities & integrations
│   │   ├── db.ts              # Prisma client
│   │   ├── minioClient.ts     # MinIO file storage
│   │   └── imgproxySigner.ts  # Image optimization
│   ├── services/              # Business logic
│   │   ├── productService.ts  # Product operations
│   │   ├── userService.ts     # User operations
│   │   └── orderService.ts    # Order operations
│   ├── types/                 # TypeScript types
│   │   ├── product.ts
│   │   ├── user.ts
│   │   └── order.ts
│   ├── utils/                 # Helper functions
│   │   ├── formatPrice.ts
│   │   ├── generatePin.ts
│   │   └── calculateCommission.ts
│   ├── validation/            # Input validation schemas
│   │   ├── listingSchema.ts
│   │   └── loginSchema.ts
│   ├── styles/                # Global styles
│   │   └── globals.css
│   ├── config.ts              # Configuration
│   ├── middleware.ts          # Next.js middleware
│   └── components/auth/       # Auth components
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.ts
└── postcss.config.mjs
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- MinIO (for file storage, optional)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd sellshop
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Configure your `.env.local`:

```env
# Database
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/sellshop"

# NextAuth
NEXTAUTH_SECRET="<your-secret-key>"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="<your-google-client-id>"
GOOGLE_CLIENT_SECRET="<your-google-client-secret>"

# MinIO (optional)
MINIO_ENDPOINT="localhost"
MINIO_PORT="9000"
MINIO_USE_SSL="false"
MINIO_ACCESS_KEY="<your-minio-access-key>"
MINIO_SECRET_KEY="<your-minio-secret-key>"
MINIO_BUCKET_NAME="sellshop"
MINIO_PUBLIC_URL="http://localhost:9000"

# imgproxy (optional)
IMGPROXY_URL="http://localhost:8080"
IMGPROXY_KEY="<your-imgproxy-key>"
IMGPROXY_SALT="<your-imgproxy-salt>"
```

5. Set up the database:

```bash
npx prisma migrate dev
```

6. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📦 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Lucide Icons
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js
- **File Storage**: MinIO (S3-compatible)
- **Image Optimization**: imgproxy
- **Validation**: Zod
- **Security**: bcryptjs for password hashing

## 🔑 Key Features

### For Buyers

- Browse local listings with distance filtering
- Search and filter by category, condition, price
- Save favorite items
- Secure escrow payment system
- Order tracking and history
- Seller ratings and reviews
- In-app messaging

### For Sellers

- Quick and easy listing creation (< 60 seconds)
- Upload multiple product images
- Set negotiable prices
- Manage active listings
- Track orders and earnings
- Receive buyer ratings and reviews
- Dashboard with sales analytics

### Security & Trust

- Secure escrow system: Payment held until both parties confirm
- User authentication with email/password or Google OAuth
- Seller ratings and review system
- Local pickup only (eliminates shipping fraud)
- In-app messaging (no phone number sharing)

## 📊 Database Schema

### Core Models

- **User**: Buyers and sellers with profiles, ratings, reviews
- **Product**: Listings with images, location, condition
- **Order**: Transactions with escrow and payment tracking
- **Review**: Seller and buyer feedback
- **Message**: In-app communication
- **SavedItem**: Wishlist functionality
- **Notification**: User notifications

## 🔐 Authentication

- Email/Password authentication with bcryptjs
- Google OAuth integration
- NextAuth.js for session management
- Protected routes with middleware
- JWT-based sessions

## 💳 Payment & Commission

- 8% commission on all sales
- Seller earnings = Price - (Price × 0.08)
- Escrow payment system
- Funds released after local pickup confirmation

## 🚢 Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

### Docker

```bash
docker build -t sellshop .
docker run -p 3000:3000 sellshop
```

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📧 Support

For support, email support@sellshop.local or open an issue on GitHub.
