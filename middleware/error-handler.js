const { CustomAPIError } = require('../errors/custom-error')

const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }

  // Duplicate value (e.g. email already registered)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(400).json({ msg: `${field} already in use` })
  }

  // Mongoose validation errors (missing name, bad email, invalid priority, etc.)
  if (err.name === 'ValidationError') {
    const msg = Object.values(err.errors).map((item) => item.message).join(', ')
    return res.status(400).json({ msg })
  }

  // Invalid ObjectId in the URL (e.g. /tasks/abc)
  if (err.name === 'CastError') {
    return res.status(404).json({ msg: `No item found with id : ${err.value}` })
  }

  console.log(err) // helps you debug unexpected errors
  return res.status(500).json({ msg: 'Something went wrong, please try again' })
}

module.exports = errorHandlerMiddleware