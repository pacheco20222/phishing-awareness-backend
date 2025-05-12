# phishing-awareness-backend
# Phishing Awareness Backend

This project is the backend of the **Phishing Awareness Website**, designed to provide secure user authentication, phishing awareness tips, real-world examples, and protection guidelines against phishing attacks.

## 📚 Description

The backend supports:
- User registration with Two-Factor Authentication (2FA)
- User login and JWT-based authentication
- CRUD operations on user data
- Secure password hashing using bcryptjs
- MongoDB Atlas database connection via Mongoose

## 🚀 Technologies Used

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- speakeasy (for 2FA)
- qrcode

## ⚙️ Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd phishing-awareness-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file and set the following environment variables:
   ```env
   MONGO_URI=your_mongo_db_connection_string
   JWT_SECRET=your_secret_key
   TWO_FA_ENCRYPTION_KEY=your_encryption_key
   ```

4. Start the server locally:
   ```bash
   node server.js
   ```

## 🛡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/auth/signup` | Register a new user with 2FA setup |
| POST   | `/api/auth/login` | Authenticate a user and obtain a JWT token |
| GET    | `/api/auth/profile` | Retrieve logged-in user profile (protected) |
| PUT    | `/api/auth/update/:id` | Update user data (protected) |
| DELETE | `/api/auth/delete/:id` | Delete a user (protected) |

> ## 🧪 How to Run Locally with Frontend

> To run this backend locally and serve the frontend:

> 1. Clone both this backend repo and the frontend repo into the **same parent directory**.
> 2. Navigate into the backend project folder.
> 3. Install dependencies:
>    ```
>    npm install
>    ```
> 4. Create a `.env` file with your environment variables (e.g., MongoDB URI, JWT secret, 2FA key).
> 5. Start the backend server:
>    ```
>    npm run dev
>    ```
> 6. Open your browser and visit:
>    ```
>    http://localhost:3000
>    ```

> 🔗 Make sure your `server.js` is serving the frontend's `/public` folder.

## 🌎 Deployment

The backend is deployed on Render and can be accessed at:
```
https://phishing-backend-<your-subdomain>.onrender.com
```

Replace `<your-subdomain>` with your actual deployment URL.

## 📄 License

This project is for educational purposes as part of the Programación para Internet SIS3410 course.

© 2025 Phishing Awareness. Educational project for cybersecurity training.