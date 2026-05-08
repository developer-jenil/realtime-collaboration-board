const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  columns: [{
    id: { type: String, required: true },
    title: { type: String, required: true },
  }]
}, { timestamps: true });

const Board = mongoose.model('Board', boardSchema);
module.exports = Board;
