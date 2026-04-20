const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");
const routes = require("./src/routes");
const errorHandler = require("./src/middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// expose pagination headers
app.use((req, res, next) => {
  res.header(
    "Access-Control-Expose-Headers",
    "X-Total-Count, X-Total-Pages, X-Current-Page, Link"
  );
  next();
});

// routes
app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

app.use("/api", routes);

// error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});