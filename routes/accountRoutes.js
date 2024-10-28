const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountsController");

router.get("/all-accounts", accountController.getAllGramaNiladhariAccounts);

router.put("/update/:id", accountController.updateGramaNiladhariAccount);

router.delete("/delete/:id", accountController.deleteGramaNiladhariAccount);

module.exports = router;
