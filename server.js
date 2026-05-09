// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const path = require("path");
// const connectDB = require("./config/db");

// dotenv.config();
// connectDB();

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.get("/", (req, res) => {
//   res.send("Exam Backend API is running");
// });

// app.use("/api/admin", require("./routes/adminRoutes"));
// app.use("/api/institutes", require("./routes/instituteRoutes"));
// app.use("/api/batches", require("./routes/batchRoutes"));
// app.use("/api/students", require("./routes/studentRoutes"));
// app.use("/api/exams", require("./routes/examRoutes"));
// app.use("/api/submissions", require("./routes/submissionRoutes"));
// app.use("/api/results", require("./routes/resultRoutes"));

// app.use(require("./middleware/errorMiddleware"));

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Database connect
connectDB();

// CORS setup
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      process.env.CLIENT_URL,
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Exam Backend API is running");
});

// Routes
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/institutes", require("./routes/instituteRoutes"));
app.use("/api/batches", require("./routes/batchRoutes"));
app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/exams", require("./routes/examRoutes"));
app.use("/api/submissions", require("./routes/submissionRoutes"));
app.use("/api/results", require("./routes/resultRoutes"));

// Error middleware
app.use(require("./middleware/errorMiddleware"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});