const express = require("express");
const router = express.Router();
const gramaNiladhariController = require("../controllers/gramaNiladhariController");

// Route to create a new Grama Niladhari Division
router.post("/", gramaNiladhariController.createGramaNiladhariDivision);

// Route to get all Grama Niladhari Divisions
router.get("/", gramaNiladhariController.getAllGramaNiladhariDivisions);

module.exports = router;
