# 🌐 Cloud-Based ERP System

A comprehensive **Enterprise Resource Planning (ERP)** system built with modern technologies for managing various business operations across departments.

![ERP System](https://img.shields.io/badge/ERP-Cloud%20Based-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Modules](#modules)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Multi-tenancy support
- Permission-based module access

### 👥 Human Resources (HR)
- Employee management
- Attendance tracking (Check-in/Check-out)
- Leave management
- Payroll processing
- Department management

### 💰 Finance & Accounting
- Transaction management (Income/Expense)
- Account management
- Invoice generation
- Financial reporting
- Multi-currency support

### 📦 Inventory Management
- Product catalog
- Warehouse management
- Stock tracking
- Purchase orders
- Vendor management
- Stock movements

### 🏢 Company Management
- Multi-company support
- Company settings
- Subscription management
- Customizable preferences

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** express-validator
- **Logging:** Winston

### Frontend
- **Framework:** React 18
- **UI Library:** Material-UI (MUI)
- **CSS Framework:** Bootstrap
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **State Management:** React Context API

### DevOps
- **Containerization:** Docker
- **Orchestration:** Docker Compose
- **Cloud:** AWS (ECS, S3, CloudFront)
- **CI/CD:** GitHub Actions

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Web App   │  │  Mobile App │  │  API Calls  │     │
│  │   (React)   │  │   (Future)  │  │  (Postman)  │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │
└─────────┼────────────────┼────────────────┼────────────┘
          │                │                │
          └────────────────┼────────────────┘
                           │
┌──────────────────────────▼────────────────────────────┐
│                 Load Balancer (AWS ALB)                │
└──────────────────────────┬────────────────────────────┘
                           │
┌──────────────────────────▼────────────────────────────┐
│                  API Gateway / Backend                 │
│  ┌─────────────────────────────────────────────────┐  │
│  │           Express.js Server (Node.js)           │  │
│  │  ┌──────────┐ ┌──────────┐ ┌────────────────┐  │  │
│  │  │   Auth   │ │  Finance │ │      HR        │  │  │
│  │  │  Module  │ │  Module  │ │    Module      │  │  │
│  │  └──────────┘ └──────────┘ └────────────────┘  │  │
│  │  ┌──────────┐ ┌──────────┐ ┌────────────────┐  │  │
│  │  │Inventory │ │ Company  │ │    Reports     │  │  │
│  │  │  Module  │ │  Module  │ │    Module      │  │  │
│  │  └──────────┘ └──────────┘ └────────────────┘  │  │
│  └─────────────────────────────────────────────────┘  │
└──────────────────────────┬────────────────────────────┘
                           │
┌──────────────────────────▼────────────────────────────┐
│                  Data Layer (MongoDB)                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │  Users   │ │Transactions│ │Employees │ │Products │ │
│  │ Company  │ │ Invoices  │ │Attendance│ │Inventory│ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
└───────────────────────────────────────────────────────┘
```

## 📊 Modules

### 1. Authentication Module
- User registration and login
- Password reset
- Token management
- Session handling

### 2. User Management
- User CRUD operations
- Role assignment
- Permission management
- Profile management

### 3. Company Management
- Company registration
- Settings configuration
- Subscription management
- Multi-tenancy

### 4. Finance Module
- Chart of accounts
- Journal entries
- Accounts payable/receivable
- Bank reconciliation
- Tax management

### 5. HR Module
- Employee database
- Organizational structure
- Time and attendance
- Leave management
- Payroll processing
- Performance management

### 6. Inventory Module
- Product management
- Stock control
- Warehouse management
- Purchase management
- Vendor management
- Order fulfillment

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (v6 or higher) or MongoDB Atlas account
- **npm** or **yarn**
- **Git**

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/yourusername/cloud-erp-system.git
cd cloud-erp-system
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# MONGODB_URI=mongodb://localhost:27017/cloud-erp
# JWT_SECRET=your-secret-key
```

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your API URL
# VITE_API_URL=http://localhost:5000/api
```

#### 4. Start MongoDB (if running locally)

```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

#### 5. Run the Application

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend (new terminal):**
```bash
cd frontend
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## 📖 Usage

### Default Login

After running the application, register a new account or use:

```
Email: admin@company.com
Password: admin123
```

### Creating Your First Company

1. Register a new account
2. Enter your company name during registration
3. You'll be logged in automatically
4. Navigate through modules using the sidebar

### Key Features Demo

1. **Add Employees:** Go to HR → Employees → Add New
2. **Record Transactions:** Go to Finance → Transactions → New Transaction
3. **Add Products:** Go to Inventory → Products → Add Product
4. **Mark Attendance:** Go to HR → Attendance → Check In

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

```http
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
GET    /api/auth/me           - Get current user
POST   /api/auth/logout       - Logout user
```

### User Endpoints

```http
GET    /api/users             - Get all users
GET    /api/users/:id         - Get user by ID
PUT    /api/users/:id         - Update user
DELETE /api/users/:id         - Delete user
```

### Finance Endpoints

```http
GET    /api/finance/transactions     - Get transactions
POST   /api/finance/transactions     - Create transaction
GET    /api/finance/accounts         - Get accounts
POST   /api/finance/accounts         - Create account
GET    /api/finance/invoices         - Get invoices
POST   /api/finance/invoices         - Create invoice
```

### HR Endpoints

```http
GET    /api/hr/employees             - Get employees
POST   /api/hr/employees             - Create employee
POST   /api/hr/attendance/check-in   - Check in
POST   /api/hr/attendance/check-out  - Check out
GET    /api/hr/leave                 - Get leave requests
POST   /api/hr/payroll               - Generate payroll
```

### Inventory Endpoints

```http
GET    /api/inventory/products       - Get products
POST   /api/inventory/products       - Create product
GET    /api/inventory/warehouses     - Get warehouses
POST   /api/inventory/movements      - Record stock movement
GET    /api/inventory/vendors        - Get vendors
```

## 🌍 Deployment

### Docker Deployment (Recommended)

```bash
# Build and run all services
docker-compose up --build

# Access the application
# Frontend: http://localhost
# Backend: http://localhost:5000
```

### AWS Deployment

See [AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md) for detailed AWS deployment instructions.

### Environment Variables

#### Backend (.env)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/cloud-erp
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=7d
```

#### Frontend (.env)
```env
VITE_API_URL=http://your-api-url/api
```

## 📸 Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Login
![Login](./screenshots/login.png)

### Employee Management
![Employees](./screenshots/employees.png)

### Transactions
![Transactions](./screenshots/transactions.png)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

For support, email support@clouderp.com or open an issue in the repository.

## 🙏 Acknowledgments

- Material-UI for the component library
- MongoDB for the database
- Express.js for the backend framework
- React team for the frontend library

---

**Built with ❤️ using the MERN Stack**
