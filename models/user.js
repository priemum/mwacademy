const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
     userName: {
          required: true,
          type: String,
          trim: true,
          minLength: 5,
          maxLength: 30
     },
     email: {
          required: true,
          type: String,
          trim: true,
          minLength: 5,
          maxLength: 100
     },
     password: {
          required: true,
          type: String,
          minLength: 8,
          maxLength: 256,
          trim: true,
     },
     courses: [String],
     verified: { 
          type: Boolean,
           default: false
     },
     userId: {
          type: Number,
     },
     admin: {
          type: Boolean,
          default: false
     }
})

module.exports = mongoose.model('User', userSchema)
