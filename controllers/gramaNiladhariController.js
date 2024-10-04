const db = require("../config/db");

// Controller to create a new Grama Niladhari Division
exports.createGramaNiladhariDivision = (req, res) => {
  const { name, division_number } = req.body;

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

    // If no duplicates, insert the new Grama Niladhari Division
    const insertQuery =
      "INSERT INTO GramaNiladhariDivisions (name, division_number) VALUES (?, ?)";
    db.query(insertQuery, [name, division_number], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: results.insertId, name, division_number });
    });
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
