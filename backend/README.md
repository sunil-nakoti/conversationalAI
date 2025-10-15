# Arc AI Backend

This is the backend server for the Arc AI application. It is built with Node.js, Express, and MongoDB. Its primary responsibilities are to handle user authentication (registration, login) and manage user profiles using JSON Web Tokens (JWT).

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (either a local instance or a cloud-hosted one like MongoDB Atlas)

## Installation

1.  **Navigate to the Backend Directory**
    ```bash
    cd backend
    ```

2.  **Install Dependencies**
    Run the following command to install all the necessary packages:
    ```bash
    npm install
    ```

3.  **Create Environment Configuration**
    Create a new file named `config.env` inside the `backend/config/` directory.

4.  **Add Environment Variables**
    Open `backend/config/config.env` and add the following variables. Replace the placeholder values with your actual configuration.

    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
    JWT_EXPIRE=30d
    API_KEY=your_google_genai_api_key
    ```
    - `MONGO_URI`: Your MongoDB connection string.
    - `JWT_SECRET`: A long, random, and secret string used to sign the JWTs.
    - `API_KEY`: Your API key for the Google Gemini AI.

## Running the Application

You can run the server in two modes:

-   **Development Mode**
    This uses `nodemon` to automatically restart the server when file changes are detected.
    ```bash
    npm run dev
    ```

-   **Production Mode**
    This runs the server using `node`.
    ```bash
    npm start
    ```

The server will start on the port specified in your `config.env` file (defaulting to 5000).

## API Endpoints

All endpoints are prefixed with `/api`.

### Authentication

---

#### 1. Register User

-   **Endpoint:** `POST /auth/register`
-   **Description:** Creates a new user account.
-   **Access:** Public
-   **Request Body:**
    ```json
    {
      "name": "Test User",
      "email": "test@example.com",
      "password": "password123",
      "role": "user"
    }
    ```
-   **Success Response (201):**
    ```json
    {
      "success": true,
      "token": "JWT_TOKEN",
      "user": {
        "id": "60d...",
        "name": "Test User",
        "email": "test@example.com",
        "role": "user"
      }
    }
    ```
-   **Error Response (400):** If the user already exists or data is invalid.

---

#### 2. Login User

-   **Endpoint:** `POST /auth/login`
-   **Description:** Authenticates a user and returns a JWT.
-   **Access:** Public
-   **Request Body:**
    ```json
    {
      "email": "test@example.com",
      "password": "password123"
    }
    ```
-   **Success Response (200):**
    ```json
    {
      "success": true,
      "token": "JWT_TOKEN",
      "user": {
        "id": "60d...",
        "name": "Test User",
        "email": "test@example.com",
        "role": "user"
      }
    }
    ```
-   **Error Response (401):** If credentials are invalid.

---

### Users

#### 1. Get User Profile

-   **Endpoint:** `GET /users/profile`
-   **Description:** Retrieves the profile of the currently logged-in user.
-   **Access:** Private (requires authentication)
-   **Headers:**
    ```
    Authorization: Bearer <JWT_TOKEN>
    ```
-   **Success Response (200):**
    ```json
    {
      "success": true,
      "user": {
        "id": "60d...",
        "name": "Test User",
        "email": "test@example.com",
        "role": "user"
      }
    }
    ```
-   **Error Response (401):** If the token is missing or invalid.

## Project Structure

```
/backend
├── config/         # Database and environment configuration
├── controllers/    # Logic for handling requests
├── middleware/     # Custom middleware (e.g., auth protection)
├── models/         # Mongoose schemas for the database
├── routes/         # Express route definitions
├── package.json
└── server.js       # Main application entry point
```