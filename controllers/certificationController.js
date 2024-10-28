const db = require("../config/db"); // Adjust the path as needed
const bcrypt = require("bcrypt"); // Import bcrypt if you're using it for password hashing

// Controller to handle certification request creation
exports.createCertificationRequest = (req, res) => {
  const { name, nic, phone, certificateType, reason, divisionId, userId } =
    req.body;

  // Check if the user with the provided userId exists
  const userCheckQuery = "SELECT * FROM externalusers WHERE id = ?";
  db.query(userCheckQuery, [userId], (err, userResults) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (userResults.length === 0) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // Insert the certification request data into certification_requests table
    const insertQuery = `
        INSERT INTO certification_requests (name, nic, phone, certificate_type, reason, division_id, status, user_id)
        VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?)
      `;
    db.query(
      insertQuery,
      [name, nic, phone, certificateType, reason, divisionId, userId],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
          id: results.insertId,
          name,
          nic,
          phone,
          certificateType,
          reason,
          divisionId,
          status: "Pending",
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    );
  });
};

// Controller to get all certification requests
exports.getAllCertificationRequests = (req, res) => {
  const query = "SELECT * FROM certification_requests";

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};

// Controller to get certification requests by user ID
exports.getCertificationRequestsByUserId = (req, res) => {
  const userId = req.params.userId;

  const query = "SELECT * FROM certification_requests WHERE user_id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No certification requests found for this user." });
    }

    res.status(200).json(results);
  });
};

// Controller to get certification requests by division ID
exports.getCertificationRequestsByDivisionId = (req, res) => {
  const divisionId = req.params.divisionId;

  const query = "SELECT * FROM certification_requests WHERE division_id = ?";
  db.query(query, [divisionId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "No certification requests found for this division.",
      });
    }

    res.status(200).json(results);
  });
};

// Controller to update the status of a certification request by ID
exports.updateCertificationRequestStatus = (req, res) => {
  const requestId = req.params.id; // Extract the request ID from the URL
  const { status } = req.body; // Get the new status from the request body

  // Validate the status input
  if (!status) {
    return res.status(400).json({ message: "Status is required." });
  }

  // SQL query to update the certification request status
  const query =
    "UPDATE certification_requests SET status = ?, updated_at = NOW() WHERE id = ?";
  db.query(query, [status, requestId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Certification request not found." });
    }

    res
      .status(200)
      .json({ message: "Certification request status updated successfully." });
  });
};
