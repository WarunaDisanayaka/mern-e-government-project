const express = require("express");
const router = express.Router();
const externalUserController = require("../controllers/externalUserController");

router.post("/signup", externalUserController.createUserAccount);
router.post("/external-login", externalUserController.loginUser);

module.exports = router;
