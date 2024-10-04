const express = require("express");
const router = express.Router();
const districtController = require("../controllers/districtController");

// Route to create a new district
router.post("/", districtController.createDistrict);

// Route to get all districts
router.get("/", districtController.getAllDistricts);

module.exports = router;
