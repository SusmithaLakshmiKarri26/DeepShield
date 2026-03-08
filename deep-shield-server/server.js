const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

// ================= DATABASE =================
connectDB();

// ================= MIDDLEWARE =================
const allowedOrigins = [
  "http://localhost:3000",
  "https://deep-shield-6ayc.vercel.app"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= ROUTES =================
// ================= ROUTES =================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/protected", require("./routes/protectedRoutes"));
app.use("/api/files", require("./routes/fileRoutes"));
app.use("/api/activity", require("./routes/activityRoutes"));
app.use("/api", require("./routes/api")); 

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
