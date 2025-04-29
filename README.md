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

## 🌎 Deployment

The backend is deployed on Render and can be accessed at:
```
https://phishing-backend-<your-subdomain>.onrender.com
```

Replace `<your-subdomain>` with your actual deployment URL.

## 📄 License

This project is for educational purposes as part of the Programación para Internet SIS3410 course.