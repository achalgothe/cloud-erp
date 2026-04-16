# Quick Start Guide

## Prerequisites
- Node.js v18+ installed
- MongoDB installed or MongoDB Atlas account
- Git (optional)

## Step 1: Install Dependencies

```bash
# From project root
npm run install:all
```

## Step 2: Configure Environment

Backend `.env` is already created. Update if needed:
```bash
# backend/.env
MONGODB_URI=mongodb://localhost:27017/cloud-erp
```

Frontend `.env`:
```bash
cd frontend
cp .env.example .env
```

## Step 3: Start MongoDB

```bash
# Windows (run as service or manually)
mongod

# Or use MongoDB Atlas connection string in backend/.env
```

## Step 4: Run the Application

### Option A: Run separately (2 terminals)

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

### Option B: Use Docker (Recommended)

```bash
# From project root
npm run docker:up
```

## Step 5: Access the Application

- **Frontend:** http://localhost:5173 (or http://localhost with Docker)
- **Backend API:** http://localhost:5000
- **API Health:** http://localhost:5000/api/health

## Step 6: Register & Login

1. Go to http://localhost:5173
2. Click "Register"
3. Fill in the form:
   - First Name, Last Name
   - Email
   - Password (min 6 chars)
   - Company Name
   - Department
   - Designation
4. Click "Register" - you'll be logged in automatically!

## Default Test Credentials

After registration, use your credentials to login.

## Common Commands

```bash
# Install all dependencies
npm run install:all

# Run backend in dev mode
npm run dev:backend

# Run frontend in dev mode
npm run dev:frontend

# Build for production
npm run build:frontend
npm run build:backend

# Docker commands
npm run docker:up      # Start all services
npm run docker:down    # Stop all services
npm run docker:logs    # View logs

# Run tests
npm test
```

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running: `mongod`
- Or use MongoDB Atlas connection string

### Port Already in Use
- Backend: Change PORT in backend/.env
- Frontend: Add port in frontend/vite.config.js

### Docker Issues
```bash
# Clean up Docker
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## Next Steps

1. **Explore Modules:**
   - Dashboard - Overview
   - HR → Employees - Add employees
   - HR → Attendance - Check in/out
   - Finance → Transactions - Record income/expenses
   - Finance → Invoices - Create invoices
   - Inventory → Products - Add products
   - Inventory → Warehouses - Manage warehouses

2. **Customize:**
   - Update company settings
   - Add more users
   - Configure permissions

3. **Deploy:**
   - See README.md for deployment options
   - Use Docker for production
   - Or deploy to AWS (see AWS_DEPLOYMENT.md)

## Support

For issues or questions:
1. Check README.md
2. Check API documentation
3. Review AWS_DEPLOYMENT.md for cloud setup

---

**Happy Coding! 🚀**
