# Smart Study Planner

## Favorite Quote

> "Productivity is never an accident; it is always the result of intelligent planning." – Paul J. Meyer

> "Start where you are. Use what you have. Do what you can." Arthur Ashe

> "Dreaming is essential to life. If we cannot dream, we cannot believe. If we cannot believe, we cannot trust. If we cannot trust, then we cannot live a life of meaning." - Renée Ahdieh, Park Avenue

## 📌 Project Overview

Smart Study Planner helps students organize study schedules, assignments, and deadlines efficiently. It provides a centralized platform to plan, track, and analyze study habits, improving productivity and consistency.

## ✨ Features

- 🔐 **User Authentication** – Secure login and personalized dashboard
- ✅ **Task Management** – Create, edit, and prioritize study tasks
- 📅 **Calendar Integration** – Add classes, exams, and assignment deadlines
- 📊 **Progress Tracking** – Visual charts showing completed vs. pending tasks
- 👤 **Profile Management** - Simple profile management to update email address with verification and change password
- 🔄 **Cross-Platform** – Access planner from phone or computer wtih dynamic views

## 🛠️ Technology Stack

**Frontend**:

- Next.js 16.2.11
- React 18.2.0
- Tailwind CSS 4.3.3

**Backend**:

- Next.js API Routes
- Firebase Authentication 12.16.0
- Firebase Admin SDk 14.2.0

**Database**

- MongoDB Atlas with Mongoose 9.7.4

**Visualization**:

- Chart.js 4.5.1, React Chart.js 2 5.3.1

**Calendar**:

- React Big Calendar 1.20.0

**Deployment**:

- Vercel

**Language**:

- JavaScript (ES6+)

## 👥 Team

- Julyanne Lee Rue Yuin (Project Lead)
- Sampson Havor
- Uthman Abisola Kolawole

## 🚀 Getting Started

1. Clone the repository:

```bash
git clone https://github.com/havor13/smart-study-planner.git
```

2. Navigate into the project:

```bash
cd smart-study-planner
```

3. Install dependencies:

```bash
npm install
```

### Environment Variables

Copy [.env.example](.env.example) to [.env.local](.env.local) and fill in the required values.

The project requires:

- Firebase client configuration for Firebase Authentication
- Firebase Admins SDK credentials for server-side authentication verification
- MongoDB Atlas connection URI for database access

### Firebase Setup & Credentials

Follow **Step 1** of the official [Firebase Documentation](https://firebase.google.com/docs/web/setup) to setup a Firebase project.

1. Create a Firebase project
2. Register/Add a Web App
3. Enable Authentication > Sign-in method > Email/Password
4. Obtain the client configuration from Settings > General
5. Generate Firebase Admin SDK from Settings > Service accounts > Generate a new private key

#### MongoDB Atlas Setup & Credentials

Guide: [MongoDB Atlas Tutorial](https://www.mongodb.com/resources/products/platform/mongodb-atlas-tutorial)

1. Create a MongoDB Atlas project
2. Create a cluster
3. Create a database user (can create multiple if you wish to separate development and production credentials)
4. Configure network access from Security > Database & Network Access > Network Access > IP Access List
5. Get connection string from Project Overview dashboard

### Run Development Server

After setting up the project with the needed credentials, start the development server:

```bash
npm run dev
```

## Available Scripts

```bash
npm run dev             # Start development server
npm run build           # Create production build
npm start               # Start production server
npm run lint            # Run ESLint
npm run format:check    # Check code formats with prettier
npm run format:fix      # Fix code formats with prettier
```

## Database Seeding

To populate the database with a set of usable data, replace the Firebase UID [here](seed.js#L65) with your own Firebase UID. Then run:

```bash
npm run seed
```

## Troubleshooting

- Missing environment variables: check [.env.local](.env.local)
- Firebase Admin errors: verify service-account credentials
- MongoDB connection errors: check Atlas network access and connection string
- Authentication/API errors: make sure Firebase Auth is enabled and the app is using the correct project
