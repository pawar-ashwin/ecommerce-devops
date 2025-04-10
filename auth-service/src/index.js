// auth-service/src/index.js
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const authenticate = require("../middleware/authMiddleware");

const User = require("./models/User");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple health check
app.get("/", (req, res) => {
	// res.send("Auth Service is running 🚀");
	res.send("Auth Service updated and auto-restarted ✅");
});

const JWT_SECRET = process.env.JWT_SECRET || "AngelStatue";

app.post("/register", async (req, res) => {
	try {
		const { username, email, password } = req.body;

		const existingUser = await User.findOne({ email });
		if (existingUser)
			return res.status(400).json({ message: "Email already registered" });

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new User({ username, email, password: hashedPassword });
		await user.save();

		res.status(201).json({ message: "User registered successfully!" });
	} catch (error) {
		console.error("Error in /register:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

app.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });
		if (!user)
			return res.status(401).json({ message: "Invalid email or password" });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch)
			return res.status(401).json({ message: "Invalid email or password" });

		const token = jwt.sign(
			{ userId: user._id, email: user.email },
			JWT_SECRET,
			{
				expiresIn: "1h",
			}
		);

		res.json({ token, message: "Login successful!" });
	} catch (error) {
		console.error("Error in /login:", error);
		res.status(500).json({ message: "Internal server error" });
	}
});

app.get("/profile", authenticate, (req, res) => {
	res.json({
		message: "Welcome to your profile 🎉",
		user: req.user,
	});
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/auth";

mongoose
	.connect(MONGO_URI)
	.then(() => {
		console.log("🟢 Connected to MongoDB");
		app.listen(PORT, () => {
			console.log(`🚀 Auth service running on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.error("❌ MongoDB connection failed:", err.message);
	});
