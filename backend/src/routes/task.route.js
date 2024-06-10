const express = require('express');
const
    {
        createTask,
        deleteTask,
        updateTask,
        searchTasksByName,
        searchTasksByLabel,
        sortTasksByDate
    } = require('../controllers/task.controller');

const authMiddleware = require('../../src/middleware/auth')
const router = express.Router();

router.post('/create', authMiddleware, createTask);
router.delete('/delete/:id', authMiddleware, deleteTask);
router.put('/update/:id', authMiddleware, updateTask);
router.get('/search', authMiddleware, searchTasksByName);
router.get('/lable', authMiddleware, searchTasksByLabel);
router.get('/sort', authMiddleware, sortTasksByDate);

module.exports = router;

