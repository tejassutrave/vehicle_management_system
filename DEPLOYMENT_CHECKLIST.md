# Deployment Checklist

## Before Deployment

### 1. Environment Variables Setup

#### MongoDB Atlas
- [ ] Account created
- [ ] Cluster created (M0 Free tier)
- [ ] Database user created
- [ ] Password saved securely
- [ ] IP whitelist: 0.0.0.0/0 added
- [ ] Connection string copied

#### Gmail App Password (for emails)
- [ ] 2FA enabled on Gmail
- [ ] App password generated
- [ ] Password saved securely

### 2. Code Preparation

- [ ] All code committed to Git
- [ ] `.env` files NOT committed (in .gitignore)
- [ ] Production URLs updated in code
- [ ] CORS configuration updated

### 3. GitHub Setup (if using)

- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub
- [ ] Repository set to public (or connected to Render/Vercel)

## Deployment Steps

### Backend Deployment (Render)

- [ ] Render account created
- [ ] New Web Service created
- [ ] GitHub repository connected (or manual deploy)
- [ ] Build command: `cd backend && npm install`
- [ ] Start command: `cd backend && npm start`
- [ ] Environment variables added:
  - [ ] MONGODB_URI
  - [ ] JWT_SECRET
  - [ ] JWT_EXPIRE
  - [ ] EMAIL_USER
  - [ ] EMAIL_PASSWORD
  - [ ] FRONTEND_URL
  - [ ] PORT
  - [ ] NODE_ENV=production
- [ ] Deployment completed successfully
- [ ] Backend URL accessible: `https://your-backend.onrender.com`
- [ ] API health check returns success

### Frontend Deployment (Vercel)

- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Framework preset: Vite
- [ ] Root directory: `frontend`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variables added:
  - [ ] VITE_API_URL=https://your-backend.onrender.com/api
- [ ] Deployment completed successfully
- [ ] Frontend URL accessible: `https://your-project.vercel.app`

### Database Seeding

- [ ] Production database seeded with demo data
- [ ] Demo accounts working:
  - [ ] owner@fleet.com / password123
  - [ ] manager@fleet.com / password123
  - [ ] driver@fleet.com / password123

## Post-Deployment Testing

### Functionality Tests

- [ ] Frontend loads without errors
- [ ] Login page displays correctly
- [ ] Can register new account
- [ ] Can login with demo account
- [ ] Dashboard loads with stats
- [ ] Can view vehicles list
- [ ] Can add new vehicle
- [ ] Can edit vehicle
- [ ] Can delete vehicle (as owner)
- [ ] Can view drivers list (as owner/manager)
- [ ] Can add new driver (as owner)
- [ ] Live tracking page loads
- [ ] Map displays correctly
- [ ] Can select vehicle
- [ ] Live tracking works (driver can start/stop)
- [ ] Location updates on map
- [ ] Can view trips list
- [ ] Can start new trip
- [ ] Can complete trip
- [ ] Password reset email sends
- [ ] Password reset link works

### Performance Tests

- [ ] Page load time < 3 seconds
- [ ] API response time < 1 second
- [ ] Map loads smoothly
- [ ] No console errors
- [ ] Mobile responsive design works

### Security Tests

- [ ] Cannot access dashboard without login
- [ ] Driver cannot access driver management
- [ ] Driver cannot delete vehicles
- [ ] JWT tokens expire correctly
- [ ] Passwords are hashed
- [ ] HTTPS enabled on both frontend and backend

## URLs to Share

Record your live URLs:

- **Frontend**: _______________________________
- **Backend**: _______________________________
- **Database**: MongoDB Atlas (private)

## Demo Accounts

Share these with users:

```
Owner Account:
Email: owner@fleet.com
Password: password123

Manager Account:
Email: manager@fleet.com
Password: password123

Driver Account:
Email: driver@fleet.com
Password: password123
```

## Monitoring

- [ ] Render dashboard bookmarked
- [ ] Vercel dashboard bookmarked
- [ ] MongoDB Atlas dashboard bookmarked
- [ ] Error logging reviewed
- [ ] Usage metrics checked

## Optional Enhancements

- [ ] Custom domain configured
- [ ] SSL certificate verified
- [ ] Analytics added (Google Analytics)
- [ ] Error tracking added (Sentry)
- [ ] Uptime monitoring added
- [ ] Upgrade to paid plans (if needed)

## Backup Plan

- [ ] Database backup scheduled
- [ ] Code repository backed up
- [ ] Environment variables documented
- [ ] Deployment notes saved

---

## Quick Deploy Commands

```bash
# If using GitHub, push code:
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/vehicle-tracker.git
git push -u origin main

# Seed production database (after backend is deployed):
# Update MONGODB_URI in backend/.env to Atlas connection string
cd backend
node seed.js
```

---

**✅ Deployment Complete!**

Your Vehicle Management System is now live and accessible from anywhere! 🎉
