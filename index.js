const express = require("express");
const db = require("./config/db"); // Import the database connection
const districtRoutes = require("./routes/districtRoutes");
const gramaNiladhariRoutes = require("./routes/gramaNiladhariRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware for parsing JSON

// Use your routes
app.use("/api/districts", districtRoutes);
app.use("/api/grama-niladhari", gramaNiladhariRoutes);
app.use("/api", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
