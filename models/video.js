const mongoose = require("mongoose")

const videoSchema = new mongoose.Schema({
     url: {
          type: String,
          required: true
     },
     date: {
          type: Date,
          default: Date.now()
     },
     title: {
          type: String,
          required: true
     },
     chapter: mongoose.Types.ObjectId
})

module.exports = mongoose.model('Video', videoSchema)
