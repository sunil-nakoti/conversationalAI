const mongoose = require('mongoose');

const StateManagementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  states: [
    {
      code: { type: String, required: true },
      status: { type: String, enum: ['Included', 'Excluded'], default: 'Included' }
    }
  ]
});

module.exports = mongoose.model('StateManagement', StateManagementSchema);
