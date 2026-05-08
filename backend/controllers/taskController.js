const Task = require('../models/Task');
const Board = require('../models/Board');

const getTasksByBoard = async (req, res) => {
  try {
    const tasks = await Task.find({ boardId: req.params.boardId, isDeleted: false }).sort('order');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  const { title, description, priority, dueDate, columnId, boardId } = req.body;

  try {
    // Basic validation could be added here
    const taskCount = await Task.countDocuments({ boardId, columnId });

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      columnId,
      boardId,
      order: taskCount, // Add to end
    });

    // Emit event via socket
    req.io.to(boardId).emit('task:created', task);

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    Object.assign(task, req.body);
    const updatedTask = await task.save();

    req.io.to(task.boardId.toString()).emit('task:updated', updatedTask);

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const moveTask = async (req, res) => {
  const { columnId, order } = req.body;
  
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.columnId = columnId;
    task.order = order;
    await task.save();

    req.io.to(task.boardId.toString()).emit('task:moved', task);

    res.json(task);
  } catch (error) {
     res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const boardId = task.boardId.toString();
    const taskId = task._id;
    
    // Soft delete
    task.isDeleted = true;
    await task.save();

    req.io.to(boardId).emit('task:deleted', taskId);

    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getHistoryTasks = async (req, res) => {
  try {
    // Find boards where user is owner or member
    const boards = await Board.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    });
    
    const boardIds = boards.map(b => b._id);
    
    const historyTasks = await Task.find({ 
      boardId: { $in: boardIds },
      isDeleted: true 
    }).populate('boardId', 'name').sort('-updatedAt');
    
    res.json(historyTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const permanentDeleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    res.json({ message: 'Task permanently deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSuggestedTasks = async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    });
    
    const boardIds = boards.map(b => b._id);
    
    let tasks = await Task.find({ 
      boardId: { $in: boardIds },
      isDeleted: false 
    }).populate('boardId', 'name');

    // Smart sort logic: Priority > Due Date > Updated
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    
    tasks.sort((a, b) => {
      const pA = priorityWeight[a.priority] || 1;
      const pB = priorityWeight[b.priority] || 1;
      
      if (pA !== pB) return pB - pA;
      
      if (a.dueDate && b.dueDate) {
         return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasksByBoard,
  createTask,
  updateTask,
  moveTask,
  deleteTask,
  getHistoryTasks,
  getSuggestedTasks,
  permanentDeleteTask,
};
