const jwt = require('jsonwebtoken')
const { createCustomError } = require('../errors/custom-error')

const auth = (req, res, next) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return next(createCustomError('Authentication invalid', 401))
  }
  try {
    const payload = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET)
    req.user = { userId: payload.userId, name: payload.name }
    next()
  } catch (error) {
    return next(createCustomError('Authentication invalid', 401))
  }
}

module.exports = auth