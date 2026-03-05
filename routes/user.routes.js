
const express = require('express');
const router = express.Router();

// Import controller
const {
  getUsers,
  createUser
} = require('../controllers/user.controller');

// Routes
router.get('/', getUsers);
router.post('/', createUser);

module.exports = router;
