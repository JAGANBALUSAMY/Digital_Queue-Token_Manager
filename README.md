# Q-Ease - Smart Virtual Queue System

## Project Overview

Q-Ease is a multi-domain, digital queue management platform that allows any organization—such as clinics, hostels, offices, canteens, groceries, and service centers—to create and manage virtual queues through a simple admin dashboard.

## Problem Statement

Across hospitals, clinics, canteens, hostels, offices, groceries, and service centers, people still wait in long physical queues without clarity on how long it will take or when their turn will come. Existing queue systems, where they exist, are usually domain-specific, offline, or limited to a single organization, offering no unified experience for users. This leads to overcrowding, wasted time, stress for elderly and patients, operational inefficiency for staff, and missed service turns.

## Solution

Q-Ease provides a unified digital queue management solution that replaces physical waiting lines with smart, virtual queues, saving time, reducing crowding, and delivering a smooth and stress-free service experience for everyone.

## Feature List

### User Features
- Universal Access — Join queues across any registered organisation (clinic, office, canteen, hostel, etc.)
- Virtual Token Generation — Book a slot instantly without standing in line
- Real-Time Queue Status — Live updates: current token, estimated wait time
- Smart Notifications - SMS / in-app / voice alerts as turn approaches (e.g., at T-5 tokens, T-2 tokens, and T-1)
- Priority Tokens for elderly / differently-abled / emergency cases (if enabled by admin)
- Queue History & Receipts
- Multiple Queue Join Support
- Walk-in User Support via staff token generation
- Feedback & Rating after service
- Multilingual UI

### Organisation / Admin Features
- Organisation Registration & Verification
- Unique 6-digit Organisation Code
- Role-Based Access - Owner / Manager / Staff
- Create Multiple Service Queues (Example: OPD, Billing, Pharmacy, Enquiry Counter)
- Set Queue Rules (Max tokens/day, Service time per user, Priority handling)
- Dashboard View (Live queue length, Currently served token)
- No-show / skip management
- Walk-In Support (Staff can create tokens for offline visitors)
- Pause / Resume Queue
- Analytics (Average wait time, Service performance, Daily / monthly reports)
- Notifications & Announcements
- Geo-tagging option
- Security & Audit Logs

### System-Level Features
- Multi-domain support
- Scalable to handle millions of users
- Secure authentication
- Token collision prevention
- Rate-limited notification triggers
- Real-time data sync using WebSockets
- Offline fallback mode (for admins)

## Tech Stack

### Frontend
- React + Tailwind + FCM + Socket.io

### Backend
- Node.js + Express
- PostgreSQL (Neon)
- Redis (Upstash)
- Socket.io
- BullMQ for scheduled alerts
- Email via Brevo free tier
- Push via Firebase
- Optional SMS via PlaySMS (self-hosted)

### Admin Dash
- Metabase

### Deployment
- Vercel (frontend)
- Render/Railway (backend)
- GitHub Actions

## Project Structure

```
DigitalQueue-TokenManager/
├── frontend/                 # React frontend with Vite and Tailwind
│   ├── public/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service functions
│   │   ├── utils/           # Utility functions
│   │   ├── context/         # React context providers
│   │   ├── assets/          # Static assets
│   │   ├── App.jsx          # Main application component
│   │   └── main.jsx         # Entry point
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── vite.config.js
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Database models
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   ├── config/          # Configuration files
│   │   └── app.js           # Express app setup
│   ├── package.json
│   └── server.js            # Server entry point
├── docs/                    # Documentation
│   └── api-spec.md          # API specification
├── docker-compose.yml       # Docker configuration
└── README.md                # Project documentation
```

## Development Workflow

1. Frontend development: React components for user and admin interfaces
2. Backend API development: REST APIs for all features
3. Database design and implementation
4. Real-time features with Socket.io
5. Notification system with BullMQ
6. Authentication and authorization
7. Testing and deployment

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud - Neon recommended)
- Redis instance (local or cloud - Upstash recommended)
- Firebase account (for push notifications)
- Email service account (Brevo recommended)

### Installation

#### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables by editing `.env` file with your credentials:
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

DB_HOST=your_db_host
DB_PORT=5432
DB_NAME=qease_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

REDIS_HOST=your_redis_host
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_USER=your_email@domain.com
EMAIL_PASS=your_email_password

# Firebase configuration
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
```

4. Start the backend server:
```bash
npm run dev
```

The backend will be available at `http://localhost:5000`

#### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Database Setup

1. Create the PostgreSQL database:
```sql
CREATE DATABASE qease_db;
```

2. Run the database schema from `backend/docs/database-schema.md`

## Deployment

### Using Docker Compose (Recommended for Development/Testing)

1. Make sure Docker and Docker Compose are installed

2. From the project root, run:
```bash
docker-compose up -d
```

This will start:
- Frontend on port 3000
- Backend on port 5000
- PostgreSQL on port 5432
- Redis on port 6379

### Deploying to Production

#### Frontend Deployment (Vercel)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Navigate to frontend directory:
```bash
cd frontend
```

3. Deploy to Vercel:
```bash
vercel --prod
```

4. Set up GitHub Actions for automatic deployment:
   - Add secrets to your GitHub repository:
     - `VERCEL_TOKEN`
     - `VERCEL_ORG_ID`
     - `VERCEL_PROJECT_ID`

#### Backend Deployment (Render)

1. Create a new Web Service on [Render](https://render.com)

2. Connect your GitHub repository

3. Configure the service:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node

4. Add environment variables in Render dashboard

5. Create PostgreSQL and Redis instances on Render

6. Deploy!

Alternatively, use the `render.yaml` configuration for automatic setup.

#### Alternative: Railway Deployment

1. Create a new project on [Railway](https://railway.app)

2. Add PostgreSQL and Redis services

3. Deploy from GitHub repository

4. Configure environment variables

### GitHub Actions CI/CD

The project includes GitHub Actions workflows for automated deployment:

- Frontend: `.github/workflows/deploy.yml` in frontend directory
- Backend: `.github/workflows/deploy.yml` in backend directory

To enable:
1. Push your code to GitHub
2. Configure the required secrets in repository settings
3. Push to main/master branch to trigger deployment

## API Documentation

### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-backend-url.com/api`

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Body: {
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "phone": "+1234567890"
}
```

#### Login
```
POST /api/auth/login
Body: {
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Profile (Protected)
```
GET /api/auth/profile
Headers: {
  "Authorization": "Bearer <token>"
}
```

### Organization Endpoints (Protected)

#### Get All Organizations
```
GET /api/organizations
```

#### Create Organization
```
POST /api/organizations
Body: {
  "name": "City Medical Center",
  "code": "CMC123",
  "domain": "healthcare",
  "description": "Medical services",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "country": "USA"
}
```

### Token Endpoints (Protected)

#### Create Token
```
POST /api/tokens
Body: {
  "queue_id": 1,
  "user_id": 1,
  "organization_id": 1,
  "priority": false
}
```

#### Update Token Status
```
PUT /api/tokens/:id
Body: {
  "status": "serving"
}
```

## Real-time Features

The application uses Socket.IO for real-time updates:

### Events

**Client → Server:**
- `join_queue_room`: Join a specific queue for updates
- `join_org_room`: Join organization room for admin updates
- `update_token_status`: Update token status

**Server → Client:**
- `token_status_updated`: Token status changed
- `queue_updated`: Queue information updated
- `new_token_added`: New token created
- `my_token_updated`: User's own token updated

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, email support@qease.com or open an issue in the GitHub repository.