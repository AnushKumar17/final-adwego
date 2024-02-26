const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const path = require("path");
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');
const commentRoute = require('./routes/comments');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database is connected successfully!");
    } catch (err) {
        console.error("Error connecting to database:", err);
        process.exit(1); // Exit with failure
    }
};

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies
app.use(cors({ origin: "*", credentials: true })); // Enable CORS for all origins

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);

// Serve static files (e.g., frontend build)
const frontendDistPath = path.join(__dirname, "..", "frontend", "dist");

app.use(express.static(frontendDistPath));

// Serve images
const imagesPath = path.join(__dirname, "images");
app.use("/images", express.static(imagesPath));

// Route to serve the frontend's index.html for all other routes
app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
});

// Image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("Image has been uploaded successfully!");
});

// Start the server
const PORT = process.env.PORT || 3000; // Use PORT from environment variables or default to 3000
app.listen(PORT, () => {
    connectDB();
    console.log("Server is running on port " + PORT);
});
