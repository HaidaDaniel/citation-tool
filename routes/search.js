const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const authMiddleware = require('../middlewares/authMiddleware');

// Создание задачи для поиска
router.post('/create', authMiddleware, searchController.createSearchTask);

// Проверка статуса задачи
router.get('/status/:taskId', authMiddleware, searchController.checkTaskStatus);

// Получение результатов поиска
router.get('/results/:taskId', authMiddleware, searchController.getSearchResults);

module.exports = router;