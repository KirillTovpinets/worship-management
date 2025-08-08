# Worship Management

A comprehensive Next.js application for managing worship teams with role-based authentication and authorization.

## Features

- **Authentication**: Secure user login with NextAuth.js (admin-only user creation)
- **Role-based Access Control**: Admin and Singer roles with different permissions
- **User Management**: Complete CRUD operations for user management (admin only)
- **Song Management**: Comprehensive song library with lyrics, metadata, and event history
- **Event Scheduling**: Schedule songs for events with order and timing
- **Song History**: Track when songs were played and upcoming scheduled performances
- **Advanced Filtering**: Filter songs by key, pace, style, tags, nature, and event status
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

### Default Users

After running the seed script, you can use these default accounts:

**Admin User:**

- Email: `admin@worship.com`
- Password: `admin123`

**Sample Singer:**

- Email: `singer@worship.com`
- Password: `singer123`

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
- Manage song library with full CRUD operations
- Schedule events and assign songs
- View song history and performance statistics
- Full administrative privileges

### Singer

- Access to singer dashboard
- View assigned songs
- Check practice schedules
- View upcoming performances
- See song history and past performances

## Song History Feature

The application includes a comprehensive song history system that tracks:

- **Past Performances**: When songs were previously played at events
- **Upcoming Schedule**: Future events where songs are scheduled
- **Performance Statistics**: Summary of total events, past events, and upcoming performances
- **Event Details**: Complete information about each event including date, description, and song order

### Features:

- **Visual Indicators**: Past events are shown in gray, upcoming events in blue
- **Event Filtering**: Filter songs by event status (with events, without events, or all songs)
- **Performance Tracking**: Track song order within events
- **Date Formatting**: Human-readable date display
- **Quick Statistics**: Summary badges showing event counts

### Usage:

1. Navigate to the Songs page in the admin dashboard
2. View song history in the "Event History & Schedule" section for each song
3. Use the "Event Status" filter to show only songs with or without events
4. Click the "History" button for songs with events to see detailed information

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

- `GET/POST /api/auth/[...nextauth]` - NextAuth.js authentication
- `GET /api/users` - List all users (admin only)
- `POST /api/users` - Create new user (admin only)
- `GET /api/users/[id]` - Get specific user (admin only)
- `PUT /api/users/[id]` - Update user (admin only)
- `DELETE /api/users/[id]` - Delete user (admin only)
- `GET /api/songs` - List all songs with filtering and pagination
- `POST /api/songs` - Create new song (admin only)
- `GET /api/songs/[id]` - Get specific song with event history
- `PUT /api/songs/[id]` - Update song (admin only)
- `DELETE /api/songs/[id]` - Delete song (admin only)
- `GET /api/events` - List all events
- `POST /api/events` - Create new event (admin only)
- `GET /api/events/[id]` - Get specific event with songs
- `PUT /api/events/[id]` - Update event (admin only)
- `DELETE /api/events/[id]` - Delete event (admin only)

## Database Schema

The application uses the following main models:

- **User**: User accounts with roles and preferred keys
- **Song**: Song library with metadata, lyrics, and event associations
- **Event**: Worship events and services
- **EventSong**: Junction table linking songs to events with order
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
- `npm run seed` - Seed database with initial users

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
