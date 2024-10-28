const db = require("../config/db");
const { hashPassword } = require("../Util/utils"); // Adjust the path as needed

// Controller to get all Grama Niladhari Accounts
exports.getAllGramaNiladhariAccounts = (req, res) => {
  const query = "SELECT * FROM gramanildhari";
  console.log("trigger the API");
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};

// Controller to update a Grama Niladhari Account
exports.updateGramaNiladhariAccount = async (req, res) => {
  const { id } = req.params;
  const { email, phone, division_id, password } = req.body;

  // Hash the password if it's being updated
  const hashedPassword = password ? await hashPassword(password) : undefined;

  // Construct dynamic query based on fields provided
  let updateQuery = "UPDATE gramanildhari SET";
  const updateFields = [];
  const values = [];

  // Check if at least one field is provided for update
  if (email) {
    updateFields.push(" email = ? ");
    values.push(email);
  }
  if (phone) {
    updateFields.push(" phone = ? ");
    values.push(phone);
  }
  if (division_id) {
    updateFields.push(" division_id = ? ");
    values.push(division_id);
  }
  if (hashedPassword) {
    updateFields.push(" password = ? ");
    values.push(hashedPassword);
  }

  // If no fields are provided, return an error
  if (updateFields.length === 0) {
    return res.status(400).json({ message: "No fields provided for update" });
  }

  updateQuery += updateFields.join(", ");
  updateQuery += " WHERE id = ?";
  values.push(id);

  db.query(updateQuery, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.status(200).json({ message: "Account updated successfully" });
  });
};

// Controller to delete a Grama Niladhari Account
exports.deleteGramaNiladhariAccount = (req, res) => {
  const { id } = req.params;

  const deleteQuery = "DELETE FROM gramanildhari WHERE id = ?";
  db.query(deleteQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.status(200).json({ message: "Account deleted successfully" });
  });
};
