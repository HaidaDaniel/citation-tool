const express = require('express');
const { getUserTasks } = require('../controllers/getUserTasks'); // Import the controller
const authMiddleware = require('../middlewares/authMiddleware'); // Import the authentication middleware

const router = express.Router();

// Route to fetch all tasks for the authenticated user
router.get('/tasks', authMiddleware, getUserTasks);

module.exports = router;