# 🔧 Database Setup & Troubleshooting

## ✅ Steps to Fix Database and See Data in MongoDB Compass

### Step 1: Clear Old Database (Remove Old Indexes)

```bash
cd backend
node clear-db.js
```

This removes old collections and indexes that were causing conflicts.

### Step 2: Seed the Database with Fresh Data

```bash
node seed.js
```

This creates:
- ✅ 4 user accounts (Owner, Manager, 2 Drivers)
- ✅ 5 sample vehicles
- ✅ 3 sample trips

### Step 3: Open MongoDB Compass

1. **Open MongoDB Compass**
2. **Connect to**: `mongodb://localhost:27017`
3. **Click "Connect"**

### Step 4: View Your Data

1. In Compass, click on **"vehicle_management"** database
2. You'll see three collections:
   - **users** - 4 documents
   - **vehicles** - 5 documents
   - **trips** - 3 documents

3. Click on each collection to view the data

## 📊 What You Should See in MongoDB Compass

### Users Collection (4 documents)
```json
{
  "_id": ObjectId("..."),
  "name": "Fleet Owner",
  "email": "owner@fleet.com",
  "role": "owner",
  "createdAt": ISODate("...")
}
```

### Vehicles Collection (5 documents)
```json
{
  "_id": ObjectId("..."),
  "vehicleNumber": "MH-12-AB-1234",
  "model": "Toyota Fortuner",
  "type": "car",
  "year": 2023,
  "color": "White",
  "driver": ObjectId("..."),
  "status": "active",
  "currentLocation": {
    "type": "Point",
    "coordinates": [77.5946, 12.9716],
    "address": "Bangalore, Karnataka",
    "speed": 0,
    "lastUpdated": ISODate("...")
  },
  "createdBy": ObjectId("..."),
  "createdAt": ISODate("...")
}
```

### Trips Collection (3 documents)
```json
{
  "_id": ObjectId("..."),
  "vehicle": ObjectId("..."),
  "driver": ObjectId("..."),
  "startLocation": {
    "type": "Point",
    "coordinates": [77.5946, 12.9716],
    "address": "Bangalore Central"
  },
  "status": "completed",
  "purpose": "Customer delivery",
  "createdAt": ISODate("...")
}
```

## 🚨 If You Still Get Errors

### Error: "E11000 duplicate key"
**Solution**: Run `node clear-db.js` again, then `node seed.js`

### Error: "Cannot connect to MongoDB"
**Solution**: 
```bash
# Windows
net start MongoDB

# Check if it's running
mongosh
```

### Error: "MongoServerError"
**Solution**: Make sure MongoDB service is running:
1. Open Services (Win + R, type `services.msc`)
2. Find "MongoDB"
3. Right-click → Start

## 🎯 Quick Commands Summary

```bash
# 1. Clear database
cd backend
node clear-db.js

# 2. Seed fresh data
node seed.js

# 3. Start backend (new terminal)
npm start

# 4. Start frontend (new terminal)
cd ../frontend
npm run dev

# 5. Open MongoDB Compass
# Connect to: mongodb://localhost:27017
# View database: vehicle_management
```

## ✅ Success Checklist

After running the commands, you should have:

- ✅ MongoDB Compass connected to `localhost:27017`
- ✅ Database: `vehicle_management`
- ✅ Collection: `users` with 4 documents
- ✅ Collection: `vehicles` with 5 documents
- ✅ Collection: `trips` with 3 documents
- ✅ Backend running on http://localhost:5000
- ✅ Frontend running on http://localhost:5173

## 🔍 Verify Data in Compass

1. **Open Compass**
2. **Connect**: mongodb://localhost:27017
3. **Click**: "vehicle_management" database
4. **Click**: "vehicles" collection
5. **See**: 5 vehicles with location data

You should see each vehicle with:
- Vehicle number (e.g., MH-12-AB-1234)
- Model, type, year, color
- Driver assigned (some vehicles)
- Current location coordinates
- Status (active/inactive/maintenance)

## 🎉 Now Your Data is Ready!

You can now:
1. ✅ View all data in MongoDB Compass
2. ✅ Login to the app at http://localhost:5173
3. ✅ Use demo accounts to test features
4. ✅ See live tracking on maps

---

**Need more help? Check README.md or QUICKSTART.md**
