require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const questionRoutes = require("./routes/questionRoutes");
const { protect } = require("./middlewares/authMiddleware");
const { generateInterviewQuestions, generateConceptExplanation } = require("./controllers/aiController");

const app = express();

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:5173";

// Middleware to handle CORS
app.use(cors({
  origin: ALLOWED_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CSRF protection: reject state-changing requests whose Origin doesn't match
// (Works in conjunction with SameSite=Strict cookies)
app.use((req, res, next) => {
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  if (safeMethods.includes(req.method)) return next();

  const origin = req.headers.origin || req.headers.referer || "";
  if (!origin.startsWith(ALLOWED_ORIGIN)) {
    return res.status(403).json({ message: "Forbidden: origin mismatch" });
  }
  next();
});

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { message: 'Too many AI requests, please slow down' },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  message: { message: 'Too many requests, please slow down' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/sessions", apiLimiter, sessionRoutes);
app.use("/api/questions", apiLimiter, questionRoutes);

app.use("/api/ai/generate-questions", aiLimiter, protect, generateInterviewQuestions);
app.use("/api/ai/generate-explanation", aiLimiter, protect, generateConceptExplanation);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));

// Serve frontend (production)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/the-interview-alchemist/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/the-interview-alchemist/dist", "index.html"));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});