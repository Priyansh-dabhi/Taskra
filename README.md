# Taskra

![React Native](https://img.shields.io/badge/React%20Native-0.81-blue?logo=react)
![Expo](https://img.shields.io/badge/Expo-54-black?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-lightgrey?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-ODM-880000)

Taskra is a full-stack mobile task tracker built with React Native, Expo, TypeScript, Node.js, Express, and MongoDB. It provides JWT-based authentication, protected task CRUD operations, persistent login with AsyncStorage, and a clean mobile-first interface powered by TanStack Query for fast server-state syncing. The project is organized as separate `backend` and `frontend` applications so the API and the Expo app can be developed and deployed independently.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React Native, Expo, TypeScript, React Navigation, TanStack Query, Axios, AsyncStorage |
| Backend | Node.js, Express, TypeScript, JWT, bcryptjs, Mongoose |
| Database | MongoDB |

## Prerequisites

- Node.js 18+ recommended
- npm
- Expo CLI or Expo via `npx expo`
- MongoDB instance local or cloud
- Android Studio emulator, iOS simulator, or Expo Go on a physical device

## Backend Setup

1. Clone the repository:

```bash
git clone <your-repo-url>
cd Taskra
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Create a `.env` file in `backend`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskra
JWT_SECRET=your_super_secret_jwt_key
```

4. Start the backend in development:

```bash
npm run dev
```

5. Build for production if needed:

```bash
npm run build
npm start
```

The API will run on `http://localhost:5000` unless you change `PORT`.

## Frontend Setup

1. Open the mobile app folder:

```bash
cd frontend
```

2. Install frontend dependencies:

```bash
npm install
```

3. Configure the API base URL for Expo.

Create a `.env` file in `frontend`:

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.10:5000
```

Use your machine's local network IP when testing on a physical device. `localhost` only works when the emulator/device can reach the backend on the same machine.

4. Start the Expo app:

```bash
npm start
```

5. Run on a target platform:

```bash
npm run android
```

```bash
npm run ios
```

```bash
npm run web
```

## Environment Variables

### `.env.example`

| App | Variable | Required | Example | Description |
| --- | --- | --- | --- | --- |
| Backend | `PORT` | No | `5000` | Express server port |
| Backend | `MONGO_URI` | Yes | `mongodb://127.0.0.1:27017/taskra` | MongoDB connection string |
| Backend | `JWT_SECRET` | Yes | `super_secret_key` | Secret used to sign and verify JWT tokens |
| Frontend | `EXPO_PUBLIC_API_BASE_URL` | Yes | `http://192.168.1.10:5000` | Base URL for the Taskra backend API |

Example backend `.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskra
JWT_SECRET=super_secret_key
```

Example frontend `.env.example`:

```env
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.10:5000
```

## API Endpoints

| Method | Route | Auth Required | Description |
| --- | --- | --- | --- |
| `POST` | `/auth/signup` | No | Register a new user, hash password, and return JWT |
| `POST` | `/auth/login` | No | Authenticate a user and return JWT |
| `GET` | `/tasks` | Yes | Fetch all tasks belonging to the authenticated user |
| `POST` | `/tasks` | Yes | Create a new task for the authenticated user |
| `PATCH` | `/tasks/:id` | Yes | Update a task by ID after ownership verification |
| `DELETE` | `/tasks/:id` | Yes | Delete a task by ID after ownership verification |

## Demo Video

[Watch the demo video](https://example.com/taskra-demo)

## Folder Structure

### Backend

```text
backend/
├── src/
│   ├── config/
│   │   └── db.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── task.controller.ts
│   ├── middleware/
│   │   └── auth.middleware.ts
│   ├── models/
│   │   ├── task.model.ts
│   │   └── user.model.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   └── task.routes.ts
│   ├── app.ts
│   └── server.ts
├── package.json
└── tsconfig.json
```

### Mobile App

```text
frontend/
├── src/
│   ├── api/
│   │   ├── auth.ts
│   │   ├── client.ts
│   │   └── tasks.ts
│   ├── components/
│   │   └── TaskCard.tsx
│   ├── hooks/
│   │   └── useTasks.ts
│   └── screens/
│       ├── LoginScreen.tsx
│       ├── SignupScreen.tsx
│       └── TasksScreen.tsx
├── App.tsx
├── app.json
├── package.json
└── tsconfig.json
```

## Notes

- The backend must be running before the mobile app can authenticate or fetch tasks.
- Protected task routes require an `Authorization: Bearer <token>` header.
- The Expo app stores the JWT in AsyncStorage and automatically attaches it to API requests.
