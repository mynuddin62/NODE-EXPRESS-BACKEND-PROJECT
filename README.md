  # Vehicle Rental Management System – Backend

  A robust backend (REST API) for administering a vehicle rental system with secure authentication, role-based authorization, and complete booking lifecycle management.

  [**API Base URL**](https://rental-system-backend.vercel.app)

  __**https://rental-system-backend.vercel.app**__

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


  ---


  ## ⚙️ Setup & Usage Instructions

  Follow the steps below to set up and run the project locally.


  ### 🔧 Prerequisites

  Make sure the following are installed on your system:

  - Node.js (v24 or later recommended)
  - npm
  - PostgreSQL

  ### 📥 1. Clone the Repository 
  ```
    git clone https://github.com/mynuddin62/NODE-EXPRESS-ASSIGNMENT-2-PROJECT

  ```

  ### 📦 2. Install Dependencies 

  ``` 
  npm install

  ```
  ### 🔐 3. Environment Configuration

  ##### Create a .env file in the project root and configure the following variables:
  ```
  PORT=5000
  DATABASE_URL=postgresql://<username>:<password>@localhost:5432/vehicle_rental
  JWT_SECRET=your_secret_key

  ```

  ### ▶️ 4. Run the Application

  ##### Development Mode

  ```
  npm run dev

  ```

  ##### Production Mode

  ```
  npm run build
  npm start
  
  ```

