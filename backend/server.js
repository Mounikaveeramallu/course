
const path = require("path");
require("dotenv").config({
    path: path.join(__dirname, ".env")
});

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const registrationRoutes = require("./routes/registrationRoutes");

const app = express();

const FRONTEND_URL = (
    process.env.FRONTEND_URL || "https://course-27h1.vercel.app"
).replace(/\/+$/, "");

const allowedOrigins = [
    FRONTEND_URL,
    "https://course-27h1.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
];

// CORS Configuration
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("CORS: Origin not allowed"));
    },
    methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS"
    ],
    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ],
    credentials: true
}));

// Handle Preflight Requests
app.options(/.*/, cors({
    origin: allowedOrigins,
    credentials: true
}));

// Middleware
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get(["/", "/api/health"], (req, res) => {
    res.json({
        success: true,
        message: "Course Registration Portal API is running",
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use("/", authRoutes);
app.use("/", courseRoutes);
app.use("/", registrationRoutes);

// API Compatibility
app.use("/api", authRoutes);
app.use("/api", courseRoutes);
app.use("/api", registrationRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `API Route not found: ${req.method} ${req.originalUrl}`
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error"
    });
});

// MongoDB Connection
let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
    }
};

// Vercel Serverless Handler
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

// Export for Vercel
module.exports = app;

// Local Development
if (require.main === module) {
    const PORT = process.env.PORT || 5000;

    connectDB()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        })
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}
