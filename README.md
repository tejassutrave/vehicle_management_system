# 🚗 VehicleTracker - Smart Fleet & Vehicle Management System

A full-stack vehicle management system with real-time GPS tracking, role-based access control, and comprehensive fleet management features.

![Tech Stack](https://img.shields.io/badge/React-18.3-blue)
![NodeJS](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)
![Leaflet](https://img.shields.io/badge/Leaflet.js-Maps-blue)

## ✨ Features

### 🔐 Authentication & Authorization
- **Gmail Login Support** - Easy authentication with email
- **Password Reset** - Secure password reset via email
- **Role-Based Access Control** - Owner, Manager, and Driver roles with different permissions

### 🚗 Vehicle Management
- Add, edit, and delete vehicles
- Assign drivers to vehicles
- Track vehicle status (active, inactive, maintenance)
- Store vehicle details (number, model, type, year, color)

### 👥 Driver Management
- Create and manage driver accounts
- Assign vehicles to drivers
- Track driver activity

### 📍 Live Location Tracking
- **Real-time GPS tracking** using browser Geolocation API
- **Interactive maps** with Leaflet.js and OpenStreetMap
- Live location updates every few seconds
- Speed tracking
- Last update timestamps
- Driver can turn on/off tracking
- Manager and Owner can view all vehicle locations

### 🗺️ Trip Management
- Start and complete trips
- Track trip routes with location history
- Record start and end locations
- Add trip purpose and notes
- View trip history
- Distance tracking

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Leaflet.js** - Maps and geolocation
- **React-Leaflet** - React components for Leaflet
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express.js** - Server framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service

## 📋 Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v16 or higher)
- **MongoDB** (v5 or higher)
- **npm** or **yarn**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd vehicle_minorproject
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your settings:
# - MongoDB connection string
# - JWT secret
# - Gmail credentials for email
# - Port (default: 5000)

# Start MongoDB (if not running)
# Windows:
net start MongoDB
# Linux/Mac:
sudo systemctl start mongod

# Start the backend server
npm start

# For development with auto-reload:
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 🔑 Demo Accounts

For testing, you can use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Fleet Owner | owner@fleet.com | password123 |
| Manager | manager@fleet.com | password123 |
| Driver | driver@fleet.com | password123 |

You need to create these accounts first by registering through the app or using the seed script (see below).

## 📊 Database Seeding

To populate the database with sample data:

```bash
cd backend
node seed.js
```

This will create:
- 3 user accounts (Owner, Manager, Driver)
- 5 sample vehicles
- 3 sample trips

## 🌐 Gmail SMTP Setup (for Password Reset)

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Security → App passwords
   - Select "Mail" and your device
   - Copy the generated password
4. Update `.env` file:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

## 📱 Usage

### For Owners (Full Access):
1. Login with owner credentials
2. Add/Edit/Delete vehicles
3. Add/Edit/Delete drivers
4. Assign drivers to vehicles
5. View all live locations
6. Manage trips
7. View dashboard analytics

### For Managers:
1. Login with manager credentials
2. View all vehicles
3. View all drivers (read-only)
4. View live tracking of all vehicles
5. View trip history

### For Drivers:
1. Login with driver credentials
2. View assigned vehicles
3. Start location tracking
4. Start and complete trips
5. View own trip history

### Live Tracking:
1. Navigate to "Live Tracking" from the sidebar
2. Select a vehicle (or auto-selected for drivers)
3. Click "Start Tracking" (drivers only)
4. Location updates automatically every few seconds
5. View real-time position on map
6. See speed and last update time
7. Click "Stop Tracking" to end session

## 🏗️ Project Structure

```
vehicle_minorproject/
├── backend/
│   ├── controllers/      # Route handlers
│   │   ├── authController.js
│   │   ├── vehicleController.js
│   │   ├── tripController.js
│   │   └── driverController.js
│   ├── models/          # Database schemas
│   │   ├── User.js
│   │   ├── Vehicle.js
│   │   └── Trip.js
│   ├── routes/          # API routes
│   │   ├── authRoutes.js
│   │   ├── vehicleRoutes.js
│   │   ├── tripRoutes.js
│   │   └── driverRoutes.js
│   ├── middleware/      # Custom middleware
│   │   └── auth.js
│   ├── utils/           # Utility functions
│   │   └── sendEmail.js
│   ├── .env            # Environment variables
│   ├── server.js       # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/     # Reusable components
    │   │   ├── DashboardLayout.jsx
    │   │   └── PrivateRoute.jsx
    │   ├── context/        # React context
    │   │   └── AuthContext.jsx
    │   ├── pages/          # Page components
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── ForgotPassword.jsx
    │   │   ├── ResetPassword.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Vehicles.jsx
    │   │   ├── Drivers.jsx
    │   │   ├── LiveTracking.jsx
    │   │   └── Trips.jsx
    │   ├── services/       # API services
    │   │   └── api.js
    │   ├── App.jsx        # Main app component
    │   ├── main.jsx       # Entry point
    │   └── index.css      # Global styles
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based authorization
- Password reset with time-limited tokens
- CORS configuration
- Environment variable protection

## 🗺️ Geolocation Features

- **Browser Geolocation API** - Accesses device GPS
- **Leaflet.js** - Interactive map rendering
- **OpenStreetMap** - Free map tiles
- **Real-time Updates** - Location sent to backend via REST API
- **React State Management** - Updates UI in real-time
- **watchPosition** - Continuous location tracking

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/me` - Get current user

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/:id` - Get single vehicle
- `POST /api/vehicles` - Create vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle
- `PUT /api/vehicles/:id/location` - Update vehicle location

### Trips
- `GET /api/trips` - Get all trips
- `GET /api/trips/:id` - Get single trip
- `POST /api/trips` - Create trip
- `PUT /api/trips/:id` - Update trip
- `POST /api/trips/:id/location` - Add location to trip route
- `PUT /api/trips/:id/complete` - Complete trip
- `DELETE /api/trips/:id` - Delete trip

### Drivers
- `GET /api/drivers` - Get all drivers
- `GET /api/drivers/:id` - Get single driver
- `POST /api/drivers` - Create driver
- `PUT /api/drivers/:id` - Update driver
- `DELETE /api/drivers/:id` - Delete driver

## 🎨 UI/UX Features

- **Purple Gradient Theme** - Modern, attractive design
- **Glassmorphism Effects** - Frosted glass UI elements
- **Smooth Animations** - Fade-in, slide-in transitions
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Theme** - Easy on the eyes
- **Interactive Cards** - Hover effects and micro-animations
- **Loading States** - Spinners and skeleton screens

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# Restart MongoDB service
# Windows:
net stop MongoDB
net start MongoDB

# Linux/Mac:
sudo systemctl restart mongod
```

### Port Already in Use
```bash
# Backend (default: 5000)
# Change PORT in backend/.env

# Frontend (default: 5173)
# Change port in frontend/vite.config.js
```

### Email Not Sending
- Verify Gmail credentials in `.env`
- Ensure App Password is correct (not regular password)
- Check "Less secure app access" is disabled (use App Password instead)

### Location Not Working
- Enable location permissions in browser
- Use HTTPS in production (required for geolocation)
- Check browser console for errors

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributors

- Your Name - Initial work

## 🙏 Acknowledgments

- OpenStreetMap for free map tiles
- Leaflet.js for mapping library
- React community for excellent tools
- MongoDB for flexible database

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check browser console for errors
4. Contact support

---

**Built with ❤️ using React, Node.js, MongoDB, and Leaflet.js**
