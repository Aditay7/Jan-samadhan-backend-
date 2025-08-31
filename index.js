require("dotenv").config({ quiet: true });
const express = require("express");
const { sequelize } = require("./models");
const app = express();
const PORT = process.env.SERVER_PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Routes
const userRoute = require("./routes/user");
const mobileAuthRoute = require("./routes/mobileAuth");
const adminAuthRoute = require("./routes/adminAuth");

app.get("/", (req, res) => {
  res.json({
    message: "Jal Samadhan Backend API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      "Web Dashboard": "/api/admin",
      "Mobile App": "/api/mobile",
      "General Auth": "/api/auth",
    },
  });
});

// Authentication routes
app.use("/api/auth", userRoute); // General auth (email/password)
app.use("/api/mobile", mobileAuthRoute); // Mobile auth (OTP-based)
app.use("/api/admin", adminAuthRoute); // Admin/Department auth (web dashboard)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.path,
  });
});

app.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");
    console.log("📝 Note: Run 'npm run db:migrate' to set up database tables.");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
});
