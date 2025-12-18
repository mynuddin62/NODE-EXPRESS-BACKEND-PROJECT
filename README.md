Vehicle Rental Management System – Backend API

A robust backend (REST API) for administering a vehicle rental system with secure authentication, role-based authorization, and complete booking lifecycle management.

---

## 🌐 Live URL

> **API Base URL:**  
> https://rental-system-backend.vercel.app



---

## 🎯 Project Overview

This project is a **Vehicle Rental Management System Backend API** built using **Node.js, TypeScript, Express, and PostgreSQL**.  
It provides secure and scalable APIs to manage:

- **Customer** (Vehicle viewing and personal booking management) & **Admin** (Full system access) accounts
- Authentication & role-based access control
- Vehicle inventory
- Bookings Management

---

## Key Features

### 🔐 Authentication & Authorization
- Secure user registration and login
- Password hashing using **bcrypt**
- JWT-based authentication
- Role-based access control (Admin / Customer)
- Protected routes using middleware

### 🚘 Vehicle Management
- Add, update, delete vehicles (Admin only)
- View all vehicles or individual vehicle details (Public api)
- Vehicle availability tracking (`available` / `booked`) (Admin All, Customer Own)

### 👤 User Management
- Admin can view and manage all users
- Customers can update their own profiles
- User deletion restricted if active bookings exist

### 📅 Booking Management
- Create bookings with date validation
- Automatic rental cost calculation
- Vehicle availability validation
- Booking cancellation (customers, before start date)
- Vehicle return handling (admin)
- Auto status update after rental period ends

---

## 🛠️ Technology Stack

**Backend**
- Node.js
- TypeScript
- Express.js

**Database**
- PostgreSQL

**Security**
- bcrypt (password hashing)
- jsonwebtoken (JWT authentication)

**Architecture**
- Modular
- Clean separation of concerns:
  - Routes
  - Controllers
  - Services
  - Middlewares
  - Database access layer
