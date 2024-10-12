const express = require("express");
const cors = require("cors"); // Import the cors middleware
const db = require("./config/db"); // Import the database connection
const districtRoutes = require("./routes/districtRoutes");
const gramaNiladhariRoutes = require("./routes/gramaNiladhariRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all origins (you can specify your frontend URL instead if needed)
app.use(cors());

// Middleware for parsing JSON
app.use(express.json());

// Use your routes
app.use("/api/districts", districtRoutes);
app.use("/api/grama-niladhari", gramaNiladhariRoutes);
app.use("/api", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
