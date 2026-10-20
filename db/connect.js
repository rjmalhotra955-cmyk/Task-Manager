const { urlencoded } = require('express')
const mongoose = require('mongoose')

const connectDB = (url) => {
  return mongoose.connect(url)
    
  
}

module.exports = connectDB
