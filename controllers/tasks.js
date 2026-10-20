const Task = require('../models/Task')
const asyncWrapper = require('../middleware/async')
const { createCustomError } = require('../errors/custom-error')

const getAllTasks = asyncWrapper(async (req, res) => {
  const { priority, category, completed } = req.query
  const filter = { createdBy: req.user.userId }
  if (priority) filter.priority = priority
  if (category) filter.category = category
  if (completed) filter.completed = completed === 'true'

  const tasks = await Task.find(filter).sort('dueDate')
  res.status(200).json({ tasks })
})

const createTask = asyncWrapper(async (req, res) => {
  req.body.createdBy = req.user.userId
  const task = await Task.create(req.body)
  res.status(201).json({ task })
})

const getTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params
  const task = await Task.findOne({ _id: taskID, createdBy: req.user.userId })
  if (!task) {
    return next(createCustomError(`No task with id : ${taskID}`, 404))
  }
  res.status(200).json({ task })
})

const deleteTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params
  const task = await Task.findOneAndDelete({ _id: taskID, createdBy: req.user.userId })
  if (!task) {
    return next(createCustomError(`No task with id : ${taskID}`, 404))
  }
  res.status(200).json({ task })
})

const updateTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params
  delete req.body.createdBy // stop users from reassigning a task to someone else

  const task = await Task.findOneAndUpdate(
    { _id: taskID, createdBy: req.user.userId },
    req.body,
    { new: true, runValidators: true }
  )
  if (!task) {
    return next(createCustomError(`No task with id : ${taskID}`, 404))
  }
  res.status(200).json({ task })
})

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
}