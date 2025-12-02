# 🚀 Deploy Backend to Render - Quick Steps

## You MUST deploy the backend for login to work!

### Step 1: Go to Render
1. Visit: https://render.com
2. Sign up with your GitHub account (tejassutrave)

### Step 2: Create Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `tejassutrave/vehicle_management_system`
3. Click **"Connect"**

### Step 3: Configure Service
Fill in these settings:

- **Name**: `vehicle-tracker-backend` (or any name you want)
- **Region**: Singapore (or closest to you)
- **Branch**: `main`
- **Root Directory**: Leave empty (blank)
- **Runtime**: `Node`
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`
- **Instance Type**: `Free`

### Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these ONE BY ONE:

```
MONGODB_URI=mongodb+srv://vehicleadmin:YOUR_PASSWORD@cluster.mongodb.net/vehicle_management

JWT_SECRET=vehicle_tracker_super_secret_key_12345

JWT_EXPIRE=7d

EMAIL_USER=tejassutrave@gmail.com

EMAIL_PASSWORD=your-gmail-app-password

FRONTEND_URL=https://vehiclemanagementsystem-zeta.vercel.app

PORT=5000

NODE_ENV=production
```

**IMPORTANT**: 
- For `MONGODB_URI`: You need a MongoDB Atlas account (see below)
- For `EMAIL_PASSWORD`: Use Gmail App Password (see below)

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. Your backend will be at: `https://vehicle-tracker-backend-xxxx.onrender.com`

### Step 6: Update Frontend API URL
Once you have your Render backend URL:

1. Update `frontend/src/services/api.js`:
   ```javascript
   const API_URL = import.meta.env.PROD
     ? 'https://YOUR-ACTUAL-BACKEND-URL.onrender.com/api'  // ← Change this
     : 'http://localhost:5000/api';
   ```

2. Update `frontend/.env.production`:
   ```
   VITE_API_URL=https://YOUR-ACTUAL-BACKEND-URL.onrender.com/api
   ```

3. Commit and push:
   ```bash
   git add .
   git commit -m "Update backend URL"
   git push
   ```

Vercel will auto-redeploy!

---

## 🗄️ MongoDB Atlas Setup (Required)

You need a cloud database for production:

1. **Sign up**: https://www.mongodb.com/cloud/atlas/register
2. **Create FREE cluster** (M0)
3. **Create user**: 
   - Username: `vehicleadmin`
   - Password: Generate secure password (SAVE IT!)
4. **Network Access**: 
   - Click "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
5. **Get Connection String**:
   - Click "Database" → "Connect" → "Connect your application"
   - Copy the string:
     ```
     mongodb+srv://vehicleadmin:<password>@cluster.xxxxx.mongodb.net/
     ```
   - Replace `<password>` with your actual password
   - Add database name:
     ```
     mongodb+srv://vehicleadmin:YOUR_PASSWORD@cluster.xxxxx.mongodb.net/vehicle_management
     ```

---

## 📧 Gmail App Password (For Password Reset Feature)

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in with `tejassutrave@gmail.com`
3. Enable 2-Factor Authentication if not enabled
4. Generate App Password:
   - App: Mail
   - Device: Other (custom name) → "Vehicle Tracker"
5. Copy the 16-character password
6. Use this in Render environment variables

---

## ✅ After Backend is Deployed

### Seed the Database
1. In Render Dashboard → Your Service → Shell tab
2. Run:
   ```bash
   cd backend
   node seed.js
   ```

OR seed from your local machine:
1. Update local `backend/.env` with production MongoDB URI
2. Run: `cd backend && node seed.js`

This creates demo accounts:
- owner@fleet.com / password123
- manager@fleet.com / password123  
- driver@fleet.com / password123

### Register Your Account
Since your email `tejassutrave@gmail.com` is not in the seed data:

1. Go to: https://vehiclemanagementsystem-zeta.vercel.app/register
2. Fill in:
   - Name: Your name
   - Email: tejassutrave@gmail.com
   - Password: 123456 (or whatever you want)
   - Role: Owner
3. Click "Create Account"

Now you can login!

---

## 🎯 Quick Checklist

- [ ] Render account created
- [ ] MongoDB Atlas cluster created  
- [ ] Database user created with password
- [ ] Connection string copied
- [ ] Backend deployed on Render
- [ ] All environment variables added
- [ ] Backend URL copied
- [ ] Frontend API URL updated
- [ ] Changes pushed to GitHub
- [ ] Vercel auto-redeployed
- [ ] Database seeded OR account registered
- [ ] Login working! ✨

---

## 🆘 If Still Not Working

Check these:

1. **Backend is running**: Visit `https://YOUR-BACKEND-URL.onrender.com`
   - Should show: `{"success":true,"message":"Vehicle Management API is running"}`

2. **Open browser console** (F12) on your Vercel site
   - Look for errors
   - Check Network tab for API calls

3. **Check Render logs**:
   - Render Dashboard → Your Service → Logs
   - Look for errors

4. **Verify CORS**: 
   - Your `backend/server.js` should have your Vercel URL in CORS

---

**Current Status**: 
- ✅ Frontend deployed to Vercel
- ❌ Backend NOT deployed yet
- ❌ Database NOT set up yet

**You need to complete the backend deployment before login works!**
