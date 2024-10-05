const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Route to create a new user
router.post("/create", userController.createUser);

// Route to retrieve all users
router.get("/all", userController.getAllUsers);

// Route to retrieve a single user by ID
router.get("/:id", userController.getUserNIC);

// Route to update a user by ID
router.put("/:id", userController.updateUser);

// Route to delete a user by ID
router.delete("/:id", userController.deleteUser);

module.exports = router;
