# Taskra

![React Native](https://img.shields.io/badge/React%20Native-0.81-blue?logo=react)
![Expo](https://img.shields.io/badge/Expo-54-black?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-lightgrey?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)

A full-stack mobile task tracker built with **React Native (Expo)**, **TypeScript**, **Node.js**, **Express**, and **MongoDB**. Features JWT authentication, swipe-gesture task management, animated splash screen, real-time progress tracking, and server-state syncing via TanStack Query.

---

## Demo Video

> [📹 Watch the demo video](https://drive.google.com/drive/folders/12jrpPrq64zr0h0F2ltoakbj6M3B6dC0M?usp=drive_link)

---

## Tech Stack

| Layer      | Technology                                                                      |
| ---------- | ------------------------------------------------------------------------------- |
| Mobile     | React Native, Expo (SDK 54), TypeScript, Expo Router, TanStack Query, Reanimated |
| Backend    | Node.js, Express 5, TypeScript, JWT, bcryptjs, Mongoose                         |
| Database   | MongoDB                                                                         |

---

## Features

### Core
- **Authentication** — Signup and login with JWT-based auth; token persisted via AsyncStorage
- **Task CRUD** — Create, view, complete, and delete tasks through a REST API
- **Task Fields** — Title, optional description, completion status, created timestamp

### UI / UX
- **Swipe Gestures** — Right-swipe to complete (green), left-swipe to delete (red) — inspired by iOS Mail / Todoist
- **Animated Splash Screen** — Logo spring animation, typewriter effect, progress bar, then navigates based on auth state
- **Bottom Sheet** — Slide-up sheet with backdrop to add new tasks; keyboard-aware with auto-dismiss
- **Filter Tabs** — All / Pending / Done tabs with local filtering via `useMemo`
- **Progress Bar** — Animated completion progress using Reanimated; turns green at 100%
- **Task Counter Badge** — Shows remaining task count or "🎉 All tasks done!" when complete
- **Timestamps** — Relative time display on each task (Just now, 5m ago, Yesterday, 12 May)
- **Pull-to-Refresh** — Swipe down to refresh the task list
- **Loading & Error States** — Activity indicators during fetch, alert dialogs on mutation failure
- **Empty States** — Context-aware empty messages per active filter

---

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** (comes with Node.js)
- **MongoDB** — local instance or cloud (e.g. MongoDB Atlas)
- **Expo Go** app on your phone, or Android Studio / Xcode emulator

---

## Setup & Run

### 1. Clone the repository

```bash
git clone https://github.com/Priyansh-dabhi/Taskra.git
cd Taskra
```

### 2. Backend

```bash
cd backend
npm install
```

> This installs all runtime dependencies (Express, Mongoose, JWT, bcrypt, etc.) and dev dependencies (`nodemon`, `tsx`, `typescript`, type definitions). No global installs needed.

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskra
JWT_SECRET=your_super_secret_jwt_key
```

> Replace `MONGO_URI` with your MongoDB Atlas connection string if using a cloud database.

Start the development server:

```bash
npm run dev
```

This runs `nodemon` watching the `src/` folder for `.ts` file changes and executes the TypeScript entry point (`src/server.ts`) using `tsx`. The server will auto-restart on every file save.

You should see:

```
MongoDB Connected Successfully
Server running on port 5000
```

The API will be available at `http://localhost:5000`.

**Production build (optional):**

```bash
npm run build    # Compiles TypeScript → dist/
npm start        # Runs compiled JS from dist/server.js
```

### 3. Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
EXPO_PUBLIC_API_BASE_URL=http://YOUR_LOCAL_IP:5000
```

> ⚠️ Replace `192.168.1.10` with your machine's local network IP. Use `localhost` only if testing on an emulator running on the same machine.

Start the Expo dev server:

```bash
npx expo start
```

Then press `a` for Android, `i` for iOS, or scan the QR code with Expo Go on your phone.

---

## Environment Variables

| App      | Variable                      | Required | Example                              | Description                          |
| -------- | ----------------------------- | -------- | ------------------------------------ | ------------------------------------ |
| Backend  | `PORT`                        | No       | `5000`                               | Express server port                  |
| Backend  | `MONGO_URI`                   | Yes      | `mongodb://127.0.0.1:27017/taskra`   | MongoDB connection string            |
| Backend  | `JWT_SECRET`                  | Yes      | `super_secret_key`                   | Secret for signing/verifying JWTs    |
| Frontend | `EXPO_PUBLIC_API_BASE_URL`    | Yes      | `http://192.168.1.10:5000`           | Backend API base URL                 |

---

## API Endpoints

| Method   | Route           | Auth | Description                                   |
| -------- | --------------- | ---- | --------------------------------------------- |
| `POST`   | `/auth/signup`  | No   | Register a new user (name, email, password)    |
| `POST`   | `/auth/login`   | No   | Authenticate user and return JWT               |
| `GET`    | `/tasks`        | Yes  | Fetch all tasks for the authenticated user     |
| `POST`   | `/tasks`        | Yes  | Create a new task                              |
| `PATCH`  | `/tasks/:id`    | Yes  | Update a task (title, description, completed)  |
| `DELETE` | `/tasks/:id`    | Yes  | Delete a task after ownership verification     |

All protected routes require an `Authorization: Bearer <token>` header.

---

## Folder Structure

```
Taskra/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts                 # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts    # Signup, login, password hashing
│   │   │   └── task.controller.ts    # CRUD operations for tasks
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts    # JWT verification middleware
│   │   ├── models/
│   │   │   ├── task.model.ts         # Mongoose Task schema
│   │   │   └── user.model.ts         # Mongoose User schema
│   │   ├── routes/
│   │   │   ├── auth.routes.ts        # POST /auth/signup, /auth/login
│   │   │   └── task.routes.ts        # GET/POST/PATCH/DELETE /tasks
│   │   ├── types/
│   │   │   └── express.d.ts          # Express Request type extension
│   │   ├── app.ts                    # Express app setup + middleware
│   │   └── server.ts                 # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── app/                          # Expo Router (file-based routing)
│   │   ├── (auth)/
│   │   │   ├── LoginScreen.tsx       # Login screen UI
│   │   │   ├── SignupScreen.tsx      # Signup screen UI
│   │   │   ├── _layout.tsx           # Auth group layout
│   │   │   ├── login.tsx             # Login route
│   │   │   └── signup.tsx            # Signup route
│   │   ├── (main)/
│   │   │   ├── TasksScreen.tsx       # Main task list with filters & progress
│   │   │   ├── _layout.tsx           # Main group layout (header, logout)
│   │   │   └── tasks.tsx             # Tasks route
│   │   ├── _layout.tsx               # Root layout (providers, splash control)
│   │   └── index.tsx                 # Animated splash screen + auth redirect
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.ts               # Auth API functions
│   │   │   ├── client.ts             # Axios instance + token interceptor
│   │   │   └── tasks.ts              # Task API functions + types
│   │   ├── components/
│   │   │   ├── AddTaskSheet.tsx       # Bottom sheet for creating tasks
│   │   │   └── TaskCard.tsx           # Swipeable task card with timestamps
│   │   ├── context/
│   │   │   └── AuthContext.tsx        # Auth state provider (login/signup/logout)
│   │   └── hooks/
│   │       └── useTasks.ts            # TanStack Query hooks (CRUD + cache)
│   ├── app.json
│   ├── metro.config.js
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

## Key Implementation Details

### Authentication Flow
1. User signs up or logs in → backend returns a JWT
2. Token is stored in AsyncStorage via `AuthContext`
3. Axios interceptor in `client.ts` attaches `Authorization: Bearer <token>` to every request
4. On app launch, the splash screen checks AsyncStorage for an existing token and navigates accordingly

### State Management
- **TanStack Query** handles all server state — `useQuery` for fetching, `useMutation` for create/update/delete
- Every successful mutation triggers `queryClient.invalidateQueries` to keep the UI in sync
- Local filtering (All/Pending/Done) uses `useMemo` — no redundant API calls

### Task Interactions
- **Swipe right** → Mark as completed (green action, checkmark icon)
- **Swipe left** → Delete task (red action, trash icon)
- Uses `Swipeable` from `react-native-gesture-handler` with `friction={2}` and `overshootFriction={8}` for a snappy, native feel

### Animations
- Splash screen uses `react-native-reanimated` — spring scale, typewriter effect, progress bar, fade-out
- Task progress bar animates with `withTiming` and changes color to green at 100% completion

---

## Notes

- The backend must be running before the frontend can authenticate or fetch tasks.
- When testing on a physical device, use your machine's LAN IP (not `localhost`) in `EXPO_PUBLIC_API_BASE_URL`.
- The app uses Expo's New Architecture (`newArchEnabled: true`) with React Native 0.81.
