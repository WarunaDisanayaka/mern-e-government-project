const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Controller to create a new user account
exports.createUserAccount = (req, res) => {
  const { name, email, phone, password } = req.body;

  // Case-insensitive check for both email and phone
  const checkQuery =
    "SELECT * FROM externalusers WHERE LOWER(email) = LOWER(?) OR LOWER(phone) = LOWER(?)";

  db.query(checkQuery, [email, phone], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // If a duplicate is found
    if (results.length > 0) {
      return res.status(400).json({
        message:
          "Account with this email or phone number already exists (case-insensitive)",
      });
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: "Error hashing password" });
      }

      // Insert the new user account into externalusers table
      const insertQuery =
        "INSERT INTO externalusers (name, email, phone, password) VALUES (?, ?, ?, ?)";
      db.query(
        insertQuery,
        [name, email, phone, hashedPassword],
        (err, results) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.status(201).json({
            id: results.insertId,
            name,
            email,
            phone,
          });
        }
      );
    });
  });
};

// Controller to handle user login
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  // Query to find the user by email
  const query = "SELECT * FROM externalusers WHERE LOWER(email) = LOWER(?)";

  db.query(query, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Check if user exists
    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];

    // Compare the hashed password with the provided password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate a JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h", // Set token expiration time
        }
      );

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        token, // Send the token back to the client
      });
    });
  });
};
