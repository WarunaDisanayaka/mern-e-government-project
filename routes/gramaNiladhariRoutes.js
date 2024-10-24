const express = require("express");
const router = express.Router();
const gramaNiladhariController = require("../controllers/gramaNiladhariController");

// Route to create a new Grama Niladhari Division
router.post("/", gramaNiladhariController.createGramaNiladhariDivision);

// Route to get all Grama Niladhari Divisions
router.get("/", gramaNiladhariController.getAllGramaNiladhariDivisions);

router.get(
  "/:district_id",
  gramaNiladhariController.getGramaNiladhariDivisionsByDistrict
);

// Route to create a new Grama Niladhari Division
router.post(
  "/create-account",
  gramaNiladhariController.createGramaNiladhariAccount
);

module.exports = router;
