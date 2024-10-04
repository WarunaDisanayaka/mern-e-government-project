const db = require("../config/db");

// Controller to create a new district
exports.createDistrict = (req, res) => {
  const { name } = req.body;

  // Case-insensitive check for district name
  const checkQuery = "SELECT * FROM Districts WHERE LOWER(name) = LOWER(?)";
  db.query(checkQuery, [name], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      return res
        .status(400)
        .json({ message: "District name already exists (case-insensitive)" });
    }

    // Insert the new district
    const insertQuery = "INSERT INTO Districts (name) VALUES (?)";
    db.query(insertQuery, [name], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: results.insertId, name });
    });
  });
};

// Controller to get all districts
exports.getAllDistricts = (req, res) => {
  const query = "SELECT * FROM Districts";

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};
