# Blog / Article System API

This is a simple backend for a blog platform built with Node.js, Express, and MongoDB. It supports user authentication (using JWT in cookies), role-based access control, and full CRUD operations for posts and comments.

## Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (with Mongoose)
* **Authentication:** JSON Web Tokens (JWT) stored in HTTP-Only cookies
* **Frontend:** React (basic)

## Features

* User Registration & Login
* Role-Based Access Control (Admin, Writer, Reader)
* Full CRUD for Blog Posts (Writers can only manage their own)
* Full CRUD for Comments (Users can only delete their own)
* Pagination and Search (by title, content) for published posts
* Admins can manage all content.

---

## Setup & Installation

### 1. Backend Setup

1.  Clone the repository.
2.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Create a `.env` file in the `backend` directory and add the following variables:

    ```env
    PORT=5001
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
    NODE_ENV=development
    FRONTEND_URL=http://localhost:3000
    ```

5.  Run the server:
    ```bash
    npm run dev
    ```
    The server will be running on `http://localhost:5001`.

### 2. Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Important:** Open `frontend/src/App.jsx` and make sure the `axios` base URL matches your backend port (e.g., `http://localhost:5001`).
    ```javascript
    const API_URL = 'http://localhost:5001/api/posts';
    ```
4.  Run the client:
    ```bash
    npm start
    ```
    The React app will open on `http://localhost:3000`.

---

## API Endpoints

### Auth

* `POST /api/auth/register` - Register a new user (default role: Reader)
* `POST /api/auth/login` - Login a user, returns an httpOnly cookie
* `POST /api/auth/logout` - Logout a user, clears the cookie

### Blog Posts

* `GET /api/posts` - Get all *published* posts.
    * Query Params: `page`, `limit`, `search` (searches title & content)
* `POST /api/posts` - Create a new post (Requires 'Writer' or 'Admin' role)
* `GET /api/posts/:id` - Get a single post (checks if published, or if user is author/admin)
* `PUT /api/posts/:id` - Update a post (Requires 'Writer' (own post) or 'Admin' role)
* `DELETE /api/posts/:id` - Delete a post (Requires 'Writer' (own post) or 'Admin' role)

### Comments

* `POST /api/comments/:postId` - Add a comment to a published post (Requires auth)
* `GET /api/comments/:postId` - Get all comments for a post
* `DELETE /api/comments/:commentId` - Delete a comment (Requires 'Admin' or author)

---

## Deployment

### Backend (e.g., Railway / Render)

1.  Push your code to a GitHub repository.
2.  Connect your repository to Railway or Render.
3.  Set the Environment Variables in the service settings (same as your `.env` file).
4.  Set the `NODE_ENV` to `production`.
5.  Set the `FRONTEND_URL` to your deployed Vercel link.
6.  Deploy.

### Frontend (Vercel)

1.  Push your code to a GitHub repository.
2.  Connect your repository to Vercel.
3.  In `frontend/src/App.jsx`, change the `API_URL` to your live backend URL.
4.  Deploy.

**Live Frontend URL:** `[PASTE YOUR VERCEL LINK HERE]`