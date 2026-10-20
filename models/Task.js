const mongoose = require('mongoose')


const TaskSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'must provide name'], trim: true, maxlength: [50, 'name can not be more than 50 characters'] },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  category: { type: String, trim: true, default: 'general' },
  createdBy: { type: mongoose.Types.ObjectId, ref: 'User', required: [true, 'Please provide user'] },
}, { timestamps: true })

module.exports = mongoose.model('Task', TaskSchema)
