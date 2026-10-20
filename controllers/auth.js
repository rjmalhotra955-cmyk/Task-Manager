const User = require('../models/User')
const asyncWrapper = require('../middleware/async')
const { createCustomError } = require('../errors/custom-error')

const register = asyncWrapper(async (req, res) => {
  const user = await User.create({ ...req.body })
  res.status(201).json({ user: { name: user.name }, token: user.createJWT() })
})

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return next(createCustomError('Please provide email and password', 400))
  }
  const user = await User.findOne({ email })
  if (!user || !(await user.comparePassword(password))) {
    return next(createCustomError('Invalid credentials', 401))
  }
  res.status(200).json({ user: { name: user.name }, token: user.createJWT() })
})

module.exports = { register, login }