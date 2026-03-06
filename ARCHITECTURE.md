# Sellshop Architecture

## System Overview

Sellshop is a full-stack Next.js application with a clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (React)                     │
│  Pages, Components, Hooks, Client-side State Management     │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│              API Layer (Next.js Routes)                      │
│  /api/products, /api/orders, /api/auth                      │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│            Business Logic Layer (Services)                   │
│  productService, userService, orderService                  │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│          Data Access Layer (Prisma ORM)                      │
│  Database queries, migrations, schema                        │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│              PostgreSQL Database                             │
│  Users, Products, Orders, Reviews, Messages                 │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure & Responsibilities

### `/src/app` - Next.js App Router
- **Pages**: User-facing routes and layouts
- **API Routes**: RESTful endpoints for client requests
- **Route Groups**: Logical grouping of related routes
  - `(auth)`: Authentication pages
  - `(dashboard)`: Protected user dashboards

### `/src/components` - Reusable UI Components
- **common**: Atomic components (Button, Input, etc.)
- **layout**: Page structure components (Header, Footer)
- **product**: Product-specific components (ListingCard)
- **auth**: Authentication components

### `/src/services` - Business Logic
- **productService**: Create, read, update, delete products
- **userService**: User management, authentication
- **orderService**: Order creation, status updates, commission calculation

### `/src/lib` - Utilities & Integrations
- **db.ts**: Prisma client singleton
- **minioClient.ts**: File upload/storage
- **imgproxySigner.ts**: Image optimization URLs

### `/src/types` - TypeScript Definitions
- **product.ts**: Product interfaces
- **user.ts**: User interfaces
- **order.ts**: Order interfaces

### `/src/validation` - Input Validation
- Uses Zod for schema validation
- Validates form inputs and API requests

### `/src/auth` - Authentication
- **auth-options.ts**: NextAuth configuration
- Credentials provider (email/password)
- OAuth providers (Google)

### `/src/hooks` - React Hooks
- **useAuth**: Session and authentication state
- **useDebounce**: Debounced values for search

## Data Flow

### Product Listing Flow
```
User Form Input
    ↓
Validation (Zod)
    ↓
API Route (/api/products)
    ↓
productService.createProduct()
    ↓
Prisma ORM
    ↓
PostgreSQL Database
    ↓
Response to Client
```

### Order Creation Flow
```
User Clicks "Buy Now"
    ↓
Order Form Submission
    ↓
API Route (/api/orders)
    ↓
Authentication Check
    ↓
orderService.createOrder()
    ↓
Calculate Commission (8%)
    ↓
Create Order Record
    ↓
Prisma ORM
    ↓
PostgreSQL Database
    ↓
Return Order Details
```

### Authentication Flow
```
User Submits Login Form
    ↓
API Route (/api/auth/signin)
    ↓
Validate Credentials
    ↓
Compare Password (bcryptjs)
    ↓
Create JWT Token
    ↓
Set Session Cookie
    ↓
Redirect to Dashboard
```

## Database Schema Relationships

```
User (1) ──────────────── (Many) Product
  │                           │
  │                           │
  └─────────── (Many) Order ──┘
       │           │
       │           └─── (1) Product
       │
       └─── (Many) Review
       │
       └─── (Many) Message
       │
       └─── (Many) SavedItem ──── (1) Product
       │
       └─── (Many) Notification
```

## Key Design Patterns

### Service Layer Pattern
- Encapsulates business logic
- Separates concerns from API routes
- Reusable across different endpoints

### Repository Pattern (via Prisma)
- Centralized data access
- Type-safe queries
- Easy to test and mock

### Middleware Pattern
- Authentication checks
- Request validation
- Error handling

## Security Considerations

### Authentication
- Passwords hashed with bcryptjs (10 rounds)
- JWT tokens for session management
- NextAuth.js handles token refresh

### Authorization
- Protected routes with middleware
- Role-based access control (BUYER, SELLER, ADMIN)
- Server-side session validation

### Data Protection
- Escrow system prevents fraud
- User data encrypted in transit (HTTPS)
- Sensitive fields excluded from API responses

### Input Validation
- Zod schemas validate all inputs
- SQL injection prevention via Prisma
- XSS protection via React

## Performance Optimizations

### Frontend
- Image optimization with imgproxy
- Code splitting via Next.js
- Client-side caching with React Query (future)
- Debounced search inputs

### Backend
- Database indexes on frequently queried fields
- Prisma query optimization
- Connection pooling via PostgreSQL
- Caching strategies (future)

### Database
- Indexed columns: category, status, sellerId, userId
- Efficient relationships with foreign keys
- Pagination for large result sets

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- Session storage in database (via NextAuth)
- File storage in MinIO (distributed)

### Vertical Scaling
- Database query optimization
- Caching layer (Redis - future)
- CDN for static assets

### Future Improvements
- Message queue for async operations
- Search engine (Elasticsearch)
- Real-time notifications (WebSockets)
- Analytics platform

## Testing Strategy

### Unit Tests
- Service functions
- Utility functions
- Validation schemas

### Integration Tests
- API endpoints
- Database operations
- Authentication flows

### E2E Tests
- User workflows
- Payment flows
- Order completion

## Deployment Architecture

### Development
- Local PostgreSQL
- Next.js dev server
- Hot reload enabled

### Production
- Managed PostgreSQL (AWS RDS, Heroku)
- Next.js on Vercel or self-hosted
- MinIO on S3 or self-hosted
- CDN for static assets
- Monitoring and logging

## Environment Configuration

### Development
- Debug logging enabled
- Relaxed CORS
- Mock payment processing

### Production
- Minimal logging
- Strict CORS
- Real payment processing
- Error tracking (Sentry)
