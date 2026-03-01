# CodeBuddy Backend

This is the **backend** for **CodeBuddy**, a platform to connect developers, assign and complete tasks, track weekly coding goals, and visualize progress. Built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**.

---

## Features

- User authentication with JWT
- Assign tasks to coding buddies
- Complete tasks with proof submission
- Approve tasks and award points
- Track weekly hours spent on tasks
- Dashboard data for tasks, points, and progress
- API endpoints for frontend consumption

---

## Tech Stack

- **Node.js + TypeScript**
- **Express.js** for server
- **MongoDB / Mongoose** for database
- **JWT** for authentication
- **Axios** for API testing (frontend)
- **Vite / React** consumes this API (frontend)

---

## 📝 Setup

1. Clone the repository:

```bash
git clone <backend-repo-url>
cd codebuddy-backend
```

2. Install dependencies:

```bash
yarn
```

3. Create a `.env` file at the root with:

```env
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
```

4. Start the development server:

```bash
yarn dev
```

The backend should now run at `http://localhost:5000` (or the port you specified).

---

## 📁 Folder Structure

```
src/
├─ controllers/   # API logic for tasks, auth, users, etc.
├─ middleware/    # Authentication & error handling
├─ models/        # Mongoose schemas
├─ routes/        # Express routes
├─ utils/         # Helper functions
├─ app.ts         # Express app setup
├─ server.ts      # Server entry point
```

---

## 🔗 Environment Variables

| Name         | Description                       |
| ------------ | --------------------------------- |
| `PORT`       | Port for the backend server       |
| `MONGO_URI`  | MongoDB connection string         |
| `JWT_SECRET` | Secret key for JWT authentication |

---

## 📦 Scripts

| Command      | Description              |
| ------------ | ------------------------ |
| `yarn dev`   | Start development server |
| `yarn build` | Build TypeScript code    |
| `yarn start` | Start production server  |

---

## 📄 Notes

- Ensure MongoDB is running and URI is added in the .env file before starting the backend.
- All tasks and users are handled via this backend API.
- JWT tokens are required for all protected routes.
