const db = require("../config/db"); // Assuming you have a db.js for database connection

exports.createUser = (req, res) => {
  const {
    full_name,
    address,
    nic,
    father_name,
    father_address,
    religion,
    gender,
    is_srilankan,
    income,
    family_members,
    language,
    grama_niladhari_division,
    is_receiving_benefits,
    current_jobs,
  } = req.body;

  // Check if NIC already exists
  const checkQuery = "SELECT * FROM Users WHERE nic = ?";
  db.query(checkQuery, [nic], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      return res
        .status(400)
        .json({ message: "User with this NIC already exists" });
    }

    // If NIC is unique, insert the new user record
    const insertQuery = `
      INSERT INTO Users (
        full_name, address, nic, father_name, father_address, religion, gender, 
        is_srilankan, created_at, income, family_members, language, 
        grama_niladhari_division, is_receiving_benefits, current_jobs
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?)
    `;
    db.query(
      insertQuery,
      [
        full_name,
        address,
        nic,
        father_name,
        father_address,
        religion,
        gender,
        is_srilankan,
        income,
        family_members,
        language,
        grama_niladhari_division,
        is_receiving_benefits,
        current_jobs,
      ],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
          id: results.insertId,
          full_name,
          address,
          nic,
          father_name,
          father_address,
          religion,
          gender,
          is_srilankan,
          created_at: new Date(), // Adds the creation date to the response
          income,
          family_members,
          language,
          grama_niladhari_division,
          is_receiving_benefits,
          current_jobs,
        });
      }
    );
  });
};

exports.getAllUsers = (req, res) => {
  const query = "SELECT * FROM Users";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};

exports.getUserNIC = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM Users WHERE nic = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(results[0]);
  });
};

exports.updateUser = (req, res) => {
  const { id } = req.params;
  const {
    full_name,
    address,
    nic,
    father_name,
    father_address,
    religion,
    gender,
    is_srilankan,
    income,
    family_members,
    language,
    grama_niladhari_division,
    is_receiving_benefits,
    current_jobs,
  } = req.body;

  // Check if the NIC already exists (excluding the current user)
  const checkQuery = "SELECT * FROM Users WHERE nic = ? AND id != ?";
  db.query(checkQuery, [nic, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      return res
        .status(400)
        .json({ message: "Another user with this NIC already exists" });
    }

    // Update the user if NIC is unique
    const updateQuery = `
      UPDATE Users 
      SET full_name = ?, address = ?, nic = ?, father_name = ?, father_address = ?, 
          religion = ?, gender = ?, is_srilankan = ?, income = ?, family_members = ?, 
          language = ?, grama_niladhari_division = ?, is_receiving_benefits = ?, current_jobs = ?
      WHERE id = ?
    `;
    db.query(
      updateQuery,
      [
        full_name,
        address,
        nic,
        father_name,
        father_address,
        religion,
        gender,
        is_srilankan,
        income,
        family_members,
        language,
        grama_niladhari_division,
        is_receiving_benefits,
        current_jobs,
        id,
      ],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User updated successfully" });
      }
    );
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM Users WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  });
};
