const express = require('express');
const router = express.Router();
const { getTasksByBoard, createTask, updateTask, deleteTask, moveTask, getHistoryTasks, getSuggestedTasks, permanentDeleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.route('/board/:boardId').get(protect, getTasksByBoard);
router.route('/').post(protect, createTask);
router.route('/history').get(protect, getHistoryTasks);
router.route('/suggestions').get(protect, getSuggestedTasks);
router.route('/:id').put(protect, updateTask).delete(protect, deleteTask);
router.route('/:id/permanent').delete(protect, permanentDeleteTask);
router.route('/:id/move').put(protect, moveTask);

module.exports = router;
