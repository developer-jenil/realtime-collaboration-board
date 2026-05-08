const Board = require('../models/Board');

const getBoards = async (req, res) => {
  try {
    // Find boards where user is owner or member
    const boards = await Board.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    });
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBoard = async (req, res) => {
  const { name } = req.body;

  try {
    const board = await Board.create({
      name,
      owner: req.user._id,
      members: [req.user._id],
      columns: [
        { id: 'todo', title: 'To Do' },
        { id: 'inprogress', title: 'In Progress' },
        { id: 'done', title: 'Done' }
      ]
    });

    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate('members', 'name email')
      .populate('owner', 'name email');
      
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    
    // Check access
    const isMember = board.members.some(member => member._id.toString() === req.user._id.toString());
    const isOwner = board.owner._id.toString() === req.user._id.toString();
    
    if (!isMember && !isOwner) {
       return res.status(403).json({ message: 'Not authorized to access this board' });
    }

    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBoards,
  createBoard,
  getBoardById,
};
