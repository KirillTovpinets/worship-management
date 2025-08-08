# Worship Management

A comprehensive Next.js application for managing worship teams with role-based authentication and authorization.

## Features

- **Authentication**: Secure user registration and login with NextAuth.js
- **Role-based Access Control**: Admin and Singer roles with different permissions
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- **Database**: SQLite database with Prisma ORM
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Authentication**: NextAuth.js
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd worship-management
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
# Copy the .env file (already created)
# Update the NEXTAUTH_SECRET with a secure random string
```

4. Set up the database:

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev
```

5. Start the development server:

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
```

## User Roles

### Admin

- Access to admin dashboard
- Manage users and roles
- View system statistics
- Full administrative privileges

### Singer

- Access to singer dashboard
- View assigned songs
- Check practice schedules
- View upcoming performances

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Singer dashboard
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utility libraries
├── types/                 # TypeScript type definitions
└── middleware.ts          # Route protection middleware
```

## API Routes

- `POST /api/auth/register` - User registration
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js authentication

## Database Schema

The application uses the following main models:

- **User**: User accounts with roles
- **Account**: OAuth account connections
- **Session**: User sessions
- **VerificationToken**: Email verification tokens

## Development

### Database Commands

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Security Features

- Password hashing with bcryptjs
- JWT-based session management
- Role-based route protection
- CSRF protection via NextAuth.js
- Secure password requirements

## Deployment

1. Build the application:

```bash
npm run build
```

2. Set up environment variables in your deployment platform
3. Deploy to your preferred hosting service (Vercel, Netlify, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
