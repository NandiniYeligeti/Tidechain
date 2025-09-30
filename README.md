# TideChain - Blue Carbon Credit Platform

A full-stack application for managing blue carbon projects with blockchain verification.

## Architecture

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: SQLite3
- **Authentication**: JWT tokens

## Project Structure

```
/
├── backend/           # Node.js/Express backend
│   ├── src/
│   │   ├── server.ts     # Main server file
│   │   ├── database.ts   # Database operations
│   │   ├── middleware.ts # Auth middleware
│   │   └── types.ts      # Type definitions
│   ├── package.json
│   └── tsconfig.json
├── src/
│   ├── react-app/     # React frontend
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Route components
│   │   └── utils/        # API client
│   └── shared/
│       └── types.ts      # Shared types
└── package.json       # Frontend dependencies
```

## User Roles & Routes

### NGO (`/ngo/dashboard`)
- Create and manage blue carbon projects
- Upload project images via camera button
- Edit project details
- View project status (Pending/Verified/Rejected)

### Buyer (`/buyer/dashboard`)
- Browse verified carbon credit projects
- Use carbon footprint calculator
- Purchase flexible amounts of credits
- Download certificates

### Admin (`/admin/dashboard`)
- Review and approve/reject NGO projects
- Set custom pricing per credit
- Assign total credits to projects
- Monitor platform activity

## Setup Instructions

### Backend Setup
```bash
cd backend
npm install
npm run dev
```
The backend will start on `http://localhost:3001`

### Frontend Setup
```bash
npm install
npm run dev
```
The frontend will start on `http://localhost:5173`

### Full Development
```bash
npm run dev:full
```
This starts both backend and frontend concurrently.

## Features

### NGO Dashboard
- **ProjectCard Component**: 
  - Edit button for project modifications
  - Camera icon for image uploads (supports JPG, PNG, GIF)
  - Status badges with color coding

### Buyer Dashboard
- **Flexible Credit Purchase**: Buyers can select any amount of credits
- **Carbon Calculator**: 
  - Input electricity, fuel, travel, waste consumption
  - Calculates total CO₂ emissions
  - Suggests number of credits needed
- **Project Discovery**: Browse verified projects with detailed information

### Admin Dashboard
- **Project Management**: Approve/reject NGO submissions
- **Dynamic Pricing**: Set custom price per credit for each project
- **Credit Allocation**: Assign total available credits per project
- **Revenue Tracking**: View potential revenue from credit sales

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### NGO Routes
- `POST /api/projects` - Create new project
- `GET /api/projects/my` - Get NGO's projects
- `POST /api/projects/:id/photos` - Upload project photos

### Buyer Routes
- `GET /api/projects/verified` - Get verified projects
- `POST /api/transactions` - Purchase credits
- `GET /api/transactions/my` - Get purchase history

### Admin Routes
- `GET /api/admin/projects` - Get all projects
- `PUT /api/admin/projects/:id` - Update project (status, pricing, credits)

### Utility
- `POST /api/calculator/emissions` - Calculate carbon emissions
- `GET /api/transactions/:id/certificate` - Download certificate

## Status Badge Colors

- **Pending**: Yellow (`bg-yellow-100 text-yellow-800`)
- **Verified**: Green (`bg-green-100 text-green-800`)
- **Rejected**: Red (`bg-red-100 text-red-800`)

## Default Credentials

**Admin Access**: Direct URL access only (`/admin`)
- Email: `admin@tidechain.com`
- Password: `admin123`

## Environmental Impact

Each acre of blue carbon ecosystem generates approximately 25 tons of CO₂ credits annually through:
- Seagrass meadow restoration
- Mangrove conservation
- Salt marsh protection
- Coastal wetland preservation

## Certificate Generation

Automatic PDF certificate generation includes:
- Project details and location
- Land size in acres
- Credits purchased
- Verification status
- Purchase timestamp
- Unique certificate ID
