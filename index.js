const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Pool } = require("pg");
const serverless = require("serverless-http");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});
// .env test
app.get("/env-test", (req, res) => {
  res.json({
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
  });
});

// Make pool available to routes
app.locals.pool = pool;
// ping pong test
app.get("/ping", (req, res) => {
  res.json({message: "pong"});
});
// Basic home route
app.get("/", (req, res) => {
  res.send("RALLE backend is live!");
});

// Import and use route files
const userRoutes = require("./routes/users");
const eventRoutes = require("./routes/events");
const eventRegistrationRoutes = require("./routes/eventRegistrations");
const onboardingRoutes = require("./routes/onboarding");
const gearRoutes = require("./routes/gear"); 
const membershipRoutes = require("./routes/memberships");
const userMembershipRoutes = require("./routes/user_memberships");
const paymentRoutes = require("./routes/payments");


app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", eventRegistrationRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/gear", gearRoutes);
app.use("/api/memberships", membershipRoutes);
app.use("/api/user-memberships", userMembershipRoutes);
app.use("/api/payments", paymentRoutes)

app.use((req, res) => {
  res.status(404).json({ message: "Reached Express, but route not found", path: req.path });
});
// Start server
module.exports.handler = require("serverless-http")(app);

// run locally if not in AWS lambda 
if (process.env.IS_OFFLINE || require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Local server running at http:localhost:${PORT}`);
  });
}

