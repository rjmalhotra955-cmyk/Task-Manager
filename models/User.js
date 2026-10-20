const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please provide name'], maxlength: 50, trim: true },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    unique: true,
  },
  password: { type: String, required: [true, 'Please provide password'], minlength: 6 },
})

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  })
}

UserSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

module.exports = mongoose.model('User', UserSchema)