# 🚀 Quick Start Guide

## Step-by-Step Setup Instructions

### 1️⃣ Install MongoDB

If you don't have MongoDB installed:

**Windows:**
```bash
# Download from: https://www.mongodb.com/try/download/community
# Run the installer with default settings
# MongoDB will start automatically
```

**Linux/Mac:**
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# Mac with Homebrew
brew install mongodb-community
```

**Verify MongoDB is running:**
```bash
mongosh
# Should connect successfully
```

### 2️⃣ Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

### 3️⃣ Configure Email (Optional but recommended)

For password reset functionality:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password

3. **Update backend/.env:**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   ```

> **Note:** If you skip this, the app will work but password reset won't send emails.

### 4️⃣ Seed the Database

```bash
cd backend
node seed.js
```

This creates demo accounts:
- **Owner:** owner@fleet.com / password123
- **Manager:** manager@fleet.com / password123
- **Driver:** driver@fleet.com / password123

### 5️⃣ Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Backend runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

### 6️⃣ Access the Application

Open your browser and go to: **http://localhost:5173**

Click on any demo account card to auto-fill credentials, or use:
- Email: owner@fleet.com
- Password: password123

## 🎯 Testing Live Tracking

### As a Driver:
1. Login as driver (driver@fleet.com)
2. Go to "Live Tracking" in sidebar
3. Vehicle will be auto-selected
4. Click "Start Tracking"
5. **Allow location access** when browser prompts
6. Watch your location update on the map in real-time!

### As Owner/Manager:
1. Login as owner or manager
2. Go to "Live Tracking"
3. Select any vehicle from dropdown
4. View its real-time location on map
5. See speed, last update time, and coordinates

## 📱 Key Features to Test

### ✅ Authentication
- [x] Register new account
- [x] Login with credentials
- [x] Forgot password (if email configured)
- [x] Role-based access

### ✅ Vehicle Management
- [x] Add new vehicle
- [x] Assign driver to vehicle
- [x] Edit vehicle details
- [x] Delete vehicle (owner only)

### ✅ Driver Management
- [x] Add new driver account
- [x] Edit driver details (owner only)
- [x] Delete driver (owner only)

### ✅ Live Tracking
- [x] View all vehicles on map
- [x] Start location tracking (driver)
- [x] Real-time updates every few seconds
- [x] Speed tracking
- [x] Last update timestamp

### ✅ Trip Management
- [x] Start new trip
- [x] Use current location
- [x] Complete ongoing trip
- [x] View trip history
- [x] Delete trips (owner only)

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution:**
```bash
# Check if MongoDB is running
mongosh

# If not running, start it:
# Windows:
net start MongoDB

# Linux/Mac:
sudo systemctl start mongod
```

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Change backend port in backend/.env
PORT=5001

# Also update frontend/src/services/api.js
const API_URL = 'http://localhost:5001/api';
```

### Issue: "Location not working"
**Solution:**
- Click the location icon in browser address bar
- Select "Allow" for location access
- Refresh the page
- Use HTTPS in production (required for geolocation)

### Issue: "Email not sending"
**Solution:**
- Verify Gmail credentials in backend/.env
- Use App Password (not regular password)
- Check EMAIL_USER and EMAIL_PASSWORD are correct
- Test with a simple email first

### Issue: "Module not found"
**Solution:**
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install

cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

## 🎨 Customization

### Change Theme Colors
Edit `frontend/src/index.css`:
```css
:root {
  --purple-primary: #8b5cf6;  /* Change this */
  --purple-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Add More Vehicle Types
Edit `backend/models/Vehicle.js`:
```javascript
type: {
  type: String,
  enum: ['car', 'truck', 'van', 'motorcycle', 'bus', 'bicycle', 'other']
}
```

### Change Map Tiles
Edit `frontend/src/pages/LiveTracking.jsx`:
```javascript
<TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  // Try other providers:
  // url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
/>
```

## 📊 Project Stats

- **Backend Files:** 15+
- **Frontend Components:** 13+
- **API Endpoints:** 20+
- **Database Models:** 3
- **Total Lines of Code:** 3000+

## 🚀 Production Deployment

### Environment Variables for Production:
```env
# Backend .env
NODE_ENV=production
MONGODB_URI=your-cloud-mongodb-uri
JWT_SECRET=generate-strong-secret
FRONTEND_URL=https://your-domain.com
```

### Deploy Backend:
- Heroku, Railway, Render, or DigitalOcean
- Set environment variables in platform settings

### Deploy Frontend:
- Vercel, Netlify, or AWS S3
- Update API_URL to production backend URL

## 📞 Support & Contact

If you encounter issues:
1. Check this guide first
2. Review README.md
3. Check browser console (F12) for errors
4. Check backend terminal for logs

## 🎉 You're All Set!

Enjoy your Vehicle Management System with live tracking! 🚗📍

---

**Happy Tracking! 🗺️✨**
