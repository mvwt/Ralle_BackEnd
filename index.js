const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Make pool available to routes
app.locals.pool = pool;

// Basic home route
app.get("/", (req, res) => {
  res.send("RALLE backend is live!");
});

// Import and use route files
const userRoutes = require("./routes/users");
const eventRoutes = require("./routes/events");
const eventRegistrationRoutes = require("./routes/eventRegistrations");
const onboardingRoutes = require("./routes/onboarding");
const merchRoutes = require("./routes/merch");
const membershipRoutes = require("./routes/memberships");
const userMembershipRoutes = require("./routes/user_memberships");


app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", eventRegistrationRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/merch", merchRoutes);
app.use("/api/memberships", membershipRoutes);
app.use("/api/user-memberships", userMembershipRoutes);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
