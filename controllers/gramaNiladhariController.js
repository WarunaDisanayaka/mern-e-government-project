const db = require("../config/db");
const jwt = require("jsonwebtoken");

// Controller to create a new Grama Niladhari Division
exports.createGramaNiladhariDivision = (req, res) => {
  const { name, division_number, district_id } = req.body;

  // Case-insensitive check for both name and division_number
  const checkQuery =
    "SELECT * FROM GramaNiladhariDivisions WHERE LOWER(name) = LOWER(?) OR LOWER(division_number) = LOWER(?)";

  db.query(checkQuery, [name, division_number], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // If a duplicate is found
    if (results.length > 0) {
      return res.status(400).json({
        message:
          "Grama Niladhari Division name or division number already exists (case-insensitive)",
      });
    }

    // If no duplicates, insert the new Grama Niladhari Division with district_id
    const insertQuery =
      "INSERT INTO GramaNiladhariDivisions (name, division_number, district_id) VALUES (?, ?, ?)";
    db.query(
      insertQuery,
      [name, division_number, district_id],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res
          .status(201)
          .json({ id: results.insertId, name, division_number, district_id });
      }
    );
  });
};

// Controller to get all Grama Niladhari Divisions
exports.getAllGramaNiladhariDivisions = (req, res) => {
  const query = "SELECT * FROM GramaNiladhariDivisions";

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// Controller to get Grama Niladhari Divisions by District
exports.getGramaNiladhariDivisionsByDistrict = (req, res) => {
  const { district_id } = req.params; // Get district_id from request parameters

  const query = "SELECT * FROM GramaNiladhariDivisions WHERE district_id = ?";

  db.query(query, [district_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // If no divisions found for the given district
    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No divisions found for this district." });
    }

    res.json(results);
  });
};

// Controller to create a new Grama Niladhari Account
exports.createGramaNiladhariAccount = (req, res) => {
  const { email, phone, division_id, password } = req.body;

  // Case-insensitive check for both email and phone
  const checkQuery =
    "SELECT * FROM gramanildhari WHERE LOWER(email) = LOWER(?) OR LOWER(phone) = LOWER(?)";

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

    // Hash the password (use bcrypt or any hashing library)
    const hashedPassword = hashPassword(password); // Implement this function as needed

    // If no duplicates, insert the new Grama Niladhari Account
    const insertQuery =
      "INSERT INTO gramanildhari (email, phone, division_id, password) VALUES (?, ?, ?, ?)";
    db.query(
      insertQuery,
      [email, phone, division_id, hashedPassword],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res
          .status(201)
          .json({ id: results.insertId, email, phone, division_id });
      }
    );
  });
};

// Example password hashing function using bcrypt
const bcrypt = require("bcrypt");
const hashPassword = (password) => {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds); // Synchronous version for simplicity
};

// Controller to login a Grama Niladhari Account
exports.loginGramaNiladhari = (req, res) => {
  const { email, password } = req.body;

  // Check if email exists in the database (case-insensitive)
  const checkQuery =
    "SELECT * FROM gramanildhari WHERE LOWER(email) = LOWER(?)";

  db.query(checkQuery, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // If email is not found
    if (results.length === 0) {
      return res
        .status(400)
        .json({ message: "Email or password is incorrect." });
    }

    // Get the user details (assuming only one account per email)
    const user = results[0];

    // Compare provided password with the hashed password stored in the database
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Email or password is incorrect." });
    }

    // If password is valid, generate a JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, division_id: user.division_id },
      process.env.JWT_SECRET, // Ensure this is set in your environment
      { expiresIn: "1h" } // Token expiry time
    );

    // Respond with user details and the token
    res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        division_id: user.division_id,
      },
    });
  });
};
