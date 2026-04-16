# 🚀 Quick Deploy to Railway

## Frontend Already Deployed! ✅

**Frontend URL:** https://frontend-ftek7krmm-gogulwarsakshis-projects.vercel.app

---

## Backend Deploy on Railway (5 minutes)

### Step 1: MongoDB Atlas Setup (3 minutes)

1. **MongoDB Atlas** pe jaayein: https://cloud.mongodb.com
2. **Sign up** karein (free)
3. **Create Cluster** → **Free Tier (M0)**
4. **Cluster Name:** `cloud-erp`
5. **Create** click karein

6. **Database Access** → **Add User**
   - Username: `erpadmin`
   - Password: (copy kar lein)
   - **Add User**

7. **Network Access** → **Add IP**
   - **Allow Access from Anywhere** (0.0.0.0/0)
   - **Confirm**

8. **Connect** → **Drivers** → Connection string copy karein:
   ```
   mongodb+srv://erpadmin:<password>@cloud-erp.xxxxx.mongodb.net/cloud-erp?retryWrites=true&w=majority
   ```

### Step 2: Railway Deploy (2 minutes)

1. **Railway** pe jaayein: https://railway.app
2. **GitHub se login** karein
3. **New Project** → **Deploy from GitHub repo**
4. **Repository select karein:** `cloud-erp-system`
5. **Select folder:** `backend`

6. **Variables** add karein:
   ```
   MONGODB_URI = mongodb+srv://erpadmin:YOUR_PASSWORD@cloud-erp.xxxxx.mongodb.net/cloud-erp
   JWT_SECRET = your-super-secret-key-12345
   NODE_ENV = production
   PORT = 5000
   ```

7. **Deploy** ho jayega automatically!

8. **Settings** → **Domains** → **Generate Domain**
   - URL milega: `https://cloud-erp-production.up.railway.app`

### Step 3: Vercel Frontend Update

1. **Vercel Dashboard** → Apna project select karein
2. **Settings** → **Environment Variables**
3. **Add Variable:**
   - Name: `VITE_API_URL`
   - Value: `https://cloud-erp-production.up.railway.app/api`
4. **Save**

5. **Redeploy** karein:
   ```bash
   cd C:\Users\gogul\cloud-erp-system\frontend
   vercel --prod
   ```

---

## ✅ Done!

**Frontend:** https://frontend-ftek7krmm-gogulwarsakshis-projects.vercel.app
**Backend:** https://cloud-erp-production.up.railway.app

---

## Test Karein

1. Frontend URL open karein
2. Register karein
3. Login karein
4. Dashboard dikhega! 🎉

---

## Alternative: Full Stack on Railway

Agar dono (frontend + backend) Railway pe rakhna ho:

```bash
# Railway CLI install karein
npm install -g @railway/cli

# Login karein
railway login

# Backend deploy karein
cd backend
railway init
railway up

# Frontend deploy karein
cd ../frontend
railway init
railway up
```

---

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://erpadmin:password@cluster.mongodb.net/cloud-erp
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=production
PORT=5000
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.up.railway.app/api
```

---

## Troubleshooting

### Backend nahi chal raha?
Railway dashboard pe **Logs** check karein

### MongoDB connection error?
- Connection string sahi hai?
- IP whitelist: 0.0.0.0/0?
- Password sahi copy kiya?

### Frontend API calls fail?
- VITE_API_URL sahi hai?
- CORS enabled hai backend mein?

---

**Koi help chahiye toh Railway/Vercel docs check karein!** 🚀
