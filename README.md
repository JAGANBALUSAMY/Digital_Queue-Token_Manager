# Q-Ease: Digital Queue Token Management System

## Project Overview

Q-Ease is a comprehensive digital queue management system designed to eliminate physical waiting lines and streamline service delivery across multiple domains including healthcare, government, food service, education, banking, and retail.

### Core Features

- **Authentication System**: User registration with password hashing (bcrypt), login with JWT token generation, protected routes with middleware, role-based access control (customer, staff, manager, owner)
- **Token Management**: Digital token generation, queue position tracking, estimated wait times, real-time status updates
- **Multi-Domain Support**: Configurable for healthcare, government, food service, education, banking, and retail environments
- **Real-time Updates**: WebSocket integration for live queue status updates
- **Admin Dashboard**: Complete management interface for queue administration
- **Mobile Responsive**: Fully responsive design for all device sizes
- **Admin User Management**: Separate admin panel for creating and managing admin users

### Technology Stack

- **Backend**: Node.js, Express, PostgreSQL
- **Frontend**: React, Traditional CSS (no Tailwind)
- **Authentication**: JWT, bcrypt
- **Real-time**: Socket.io
- **Queue Management**: Bull Queue

### Installation & Setup

1. **Clone the repository**
2. **Navigate to the backend directory**: `cd Digital_Queue-Token_Manager/backend`
3. **Install backend dependencies**: `npm install`
4. **Create a `.env` file** in the backend directory based on `.env.example`
5. **Set up PostgreSQL database** (ensure PostgreSQL is running)
6. **Run database setup**: `node setup-db.js`
7. **Start the backend server**: `npm start` or `node server.js`
8. **Open a new terminal and navigate to the frontend directory**: `cd Digital_Queue-Token_Manager/frontend`
9. **Install frontend dependencies**: `npm install`
10. **Start the frontend**: `npm run dev`

### Admin Panel Access

A separate admin panel is available for managing admin users:

1. **Admin Panel Location**: `admin-panel/index.html` (outside the main project folder)
2. **Access Admin Panel**: Open `admin-panel/index.html` in a web browser
3. **Admin Login**: Use credentials `qeasy@gmail.com` and password `123456` to access the admin panel
4. **Admin Functions**: Add new admin users (manager/owner roles), view existing admins

> **Note**: The admin panel is kept separate from the main project to prevent unauthorized access. It's not included in git commits for security purposes.

### Environment Variables

Create a `.env` file in the `Digital_Queue-Token_Manager/backend` directory with the following variables:

```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=qease_db
DB_USER=your_database_user
DB_PASSWORD=your_database_password
JWT_SECRET=your_jwt_secret_key_here
REDIS_URL=redis://localhost:6379
NODE_ENV=development
```

### Running the Application

#### Method 1: Separate Terminals (Recommended)

1. **Terminal 1 - Backend**: 
   ```bash
   cd Digital_Queue-Token_Manager/backend
   npm start
   ```

2. **Terminal 2 - Frontend**:
   ```bash
   cd Digital_Queue-Token_Manager/frontend
   npm run dev
   ```

3. **Terminal 3 - Admin Panel** (Optional):
   - Open `admin-panel/index.html` in your web browser
   - Use credentials: `qeasy@gmail.com` / `123456`

#### Method 2: Using the Frontend Development Server

1. Navigate to the frontend directory: `cd Digital_Queue-Token_Manager/frontend`
2. Run: `npm run dev`
3. The frontend will start on `http://localhost:5173`
4. Make sure the backend is running on `http://localhost:5000`

### API Endpoints

#### Authentication Endpoints

##### Register User
```
POST /api/auth/register
Body: {
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "phone": "+1234567890"
}
```

##### Login
```
POST /api/auth/login
Body: {
  "email": "user@example.com",
  "password": "password123"
}
```

##### Get Profile (Protected)
```
GET /api/auth/profile
Headers: {
  "Authorization": "Bearer <token>"
}
```

### User Roles

- **customer**: Basic user - can book tokens, view their own tokens
- **staff**: Service provider - can serve tokens, update queue status
- **manager**: Department manager - can manage queues, view analytics
- **owner**: Organization admin - full control over organization

### Frontend Features

#### Login & Authentication
- **User/Admin Toggle**: Switch between user and admin login modes
- **Protected Routes**: Admin routes require manager/owner roles
- **Role-based Navigation**: Dynamic navbar based on user role

#### UI Components
- **Modern SaaS Design**: Clean, professional interface
- **Responsive Layout**: Works on all device sizes
- **Traditional CSS**: No Tailwind CSS used (user preference)
- **Accessibility**: Proper contrast, focus states, keyboard navigation

### Admin Panel Features

- **Separate Interface**: Located outside main project folder
- **Secure Access**: Specific credentials required
- **Admin Management**: Create new admin users with manager/owner roles
- **User Listing**: View existing admin users
- **Real-time Data**: Connects to main application database

### Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- Role-based authorization
- Environment variable configuration
- SQL injection prevention (parameterized queries)
- XSS protection
- CORS configuration
- Secure admin panel access

### Development

The project follows a modular architecture with separate models, routes, middleware, and services for better maintainability.

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### License

This project is licensed under the MIT License - see the LICENSE file for details.

### Support

For support, please open an issue in the repository.

## Acknowledgments

- Built with ❤️ for better queue management
- Inspired by the need to reduce physical waiting lines
- Dedicated to improving customer experience