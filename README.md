# Credit Repair Workflow Application

A production-ready, privacy-first web application for credit report analysis and dispute letter generation.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)

## ⚠️ Important Disclaimers

**This application is for educational purposes only and does not constitute legal advice.**

- ❌ No guarantees of dispute outcomes or credit score improvements
- ✅ Users are responsible for the accuracy of all information
- ✅ Only upload credit reports you own or are authorized to use
- ✅ Consult with a licensed attorney for legal advice

## 🚀 Features

### Core Functionality
- **Secure File Upload**: Upload up to 3 credit bureau reports (PDF, JPG, PNG, HTML)
- **AI-Powered Analysis**: Detect potential issues including:
  - Personal information mismatches
  - Duplicate collections
  - Date inconsistencies and re-aging
  - Obsolete collections (7+ years)
  - Unrecognized inquiries
  - Late payment inconsistencies
  - Balance/limit anomalies
- **Letter Generation**: Create professional dispute letters for bureaus and creditors
- **Rich Text Editing**: Customize letters with version history
- **Multi-Format Export**: Download as PDF, DOCX, or ZIP bundle

### Security & Privacy
- 🔒 **Encryption**: All data encrypted at rest and in transit
- 🎭 **PII Redaction**: Automatic masking of SSN, account numbers, DOB
- 🗑️ **Auto-Delete**: Configurable automatic file deletion (default: 30 days)
- 📊 **Audit Logging**: Complete security event tracking
- 🛡️ **Rate Limiting**: Protection against abuse
- 🔐 **2FA Support**: Optional email-based two-factor authentication

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Storage**: AWS S3 (or MinIO for local dev)
- **Queue**: BullMQ + Redis for background jobs
- **PDF Processing**: pdf-parse + Tesseract.js (OCR)
- **LLM**: OpenAI GPT-4 for analysis and letter generation
- **Document Generation**: pdf-lib (PDF), docx (Word)

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Redis 7+
- AWS S3 bucket (or MinIO for local development)
- OpenAI API key (for AI features)
- Docker (optional, for local development)

## 🏁 Quick Start

### 1. Clone and Install

```bash
cd credit-repair-app
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/creditrepair"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# AWS S3
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_S3_BUCKET="credit-repair-uploads"

# Redis
REDIS_URL="redis://localhost:6379"

# OpenAI
OPENAI_API_KEY="sk-your-api-key"

# Email (optional for development)
EMAIL_FROM="noreply@yourapp.com"
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email"
EMAIL_SERVER_PASSWORD="your-password"
```

### 3. Start Local Services (Docker)

If you have Docker installed:

```bash
docker compose up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379
- MinIO (S3-compatible) on ports 9000 (API) and 9001 (Console)

**MinIO Setup**: Visit http://localhost:9001, login with `minioadmin/minioadmin`, and create a bucket named `credit-repair-uploads`.

### 4. Database Setup

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Optional: Seed demo data:

```bash
npm run seed
```

### 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## 📁 Project Structure

```
credit-repair-app/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── api/              # API routes
│   │   ├── auth/             # Authentication pages
│   │   ├── dashboard/        # Protected dashboard pages
│   │   ├── onboarding/       # User onboarding
│   │   └── page.tsx          # Landing page
│   ├── components/           # React components
│   │   ├── ui/              # Reusable UI components
│   │   ├── layout/          # Layout components
│   │   └── disclaimers/     # Disclaimer components
│   ├── lib/                  # Utility libraries
│   │   ├── auth.ts          # NextAuth configuration
│   │   ├── db.ts            # Prisma client
│   │   ├── crypto.ts        # Encryption utilities
│   │   ├── storage.ts       # S3 storage utilities
│   │   ├── email.ts         # Email service
│   │   ├── redaction.ts     # PII redaction
│   │   ├── validations.ts   # Zod schemas
│   │   ├── parser/          # Report parsing engine
│   │   ├── analysis/        # Rules engine
│   │   ├── letters/         # Letter generation
│   │   ├── export/          # Document export
│   │   └── queue/           # Background jobs
│   ├── middleware.ts         # Next.js middleware
│   └── types/               # TypeScript types
├── docker-compose.yml        # Local development services
├── .env.example             # Environment variables template
└── package.json
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npx prisma studio` - Open Prisma Studio (database GUI)

### Database Migrations

Create a new migration:

```bash
npx prisma migrate dev --name description_of_changes
```

Apply migrations in production:

```bash
npx prisma migrate deploy
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Environment Variables for Production

Ensure all environment variables are set in your hosting platform:

- `DATABASE_URL` - PostgreSQL connection string (use managed DB like Supabase, Neon, or AWS RDS)
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`
- `AWS_*` - S3 credentials for file storage
- `REDIS_URL` - Redis connection (use Upstash or AWS ElastiCache)
- `OPENAI_API_KEY` - OpenAI API key
- Email configuration for production emails

### Database Setup

Use a managed PostgreSQL service:
- [Supabase](https://supabase.com/) (Free tier available)
- [Neon](https://neon.tech/) (Free tier available)
- [AWS RDS](https://aws.amazon.com/rds/)

### Redis Setup

Use a managed Redis service:
- [Upstash](https://upstash.com/) (Free tier available)
- [AWS ElastiCache](https://aws.amazon.com/elasticache/)

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/signup` - Create new account
- `POST /api/auth/[...nextauth]` - NextAuth handlers (login, logout, session)
- `GET /api/auth/verify-email?token=xxx` - Verify email address

### Upload Endpoints

- `POST /api/upload` - Upload credit report files
- `GET /api/uploads` - List user's uploads
- `DELETE /api/uploads/[id]` - Delete upload

### Analysis Endpoints

- `GET /api/reports/[id]` - Get parsed report
- `GET /api/reports/[id]/findings` - Get dispute candidates

### Letter Endpoints

- `POST /api/letters/generate` - Generate dispute letters
- `GET /api/letters` - List user's letters
- `PUT /api/letters/[id]` - Update letter content
- `POST /api/letters/[id]/export` - Export letter as PDF/DOCX

## 🔒 Security Best Practices

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Rotate secrets regularly** - Especially `NEXTAUTH_SECRET` and API keys
3. **Use strong passwords** - Enforce password requirements
4. **Enable 2FA** - For admin accounts at minimum
5. **Monitor audit logs** - Review security events regularly
6. **Keep dependencies updated** - Run `npm audit` regularly
7. **Use HTTPS in production** - Never serve over HTTP

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

## 📞 Support

For support, please contact support@yourapp.com

---

**Remember**: This tool is for educational purposes only and does not constitute legal advice. Always consult with a licensed attorney for legal matters.
