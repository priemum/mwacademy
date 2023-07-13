const mongoose = require("mongoose")

const otpSchema = new mongoose.Schema({
     otp: {
          type: String,
          trim: true,
     },
     otpUser: { 
          type: mongoose.Types.ObjectId,
     }
     
})

module.exports = mongoose.model('Otp', otpSchema)
