const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema({
     title: {
          type: String,
          required: true
     },
     description: {
          type: String,
          required: true
     },
     price: {
          type: Number,
          required: true
     },
     learnPoint: {
          type: Array,
          required: true
     },
     thumbnail: {
          type: String,
     },
     students: {
          type: Number,
          default: 0
     },
     lang: {
          type: String,
          required: true
     },
     hours: {
          type: Number,
          required: true,
          default: 0
     },
     lecturesNumber: {
          type: Number,
          default: 0
     },
     chapters: [],
     soon: { type: String, default: "off" }
})

module.exports = mongoose.model('Course', courseSchema)
