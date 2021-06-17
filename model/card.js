const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: {
    type: [{
      type: String,
      ref: 'user',
    }],
    default: [],
  },
  createdAt: {
    type: Date,
    defualt: Date.now,
  },
});

module.exports = mongoose('card', cardSchema);
