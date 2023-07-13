const connectDB = require("../utils/db.js")
const User = require("../models/user.js");
const Course = require("../models/course.js")
const mongoose = require("mongoose")

const watchGET = async (req, res) => {
     try {
          const connect = await connectDB()

         if(!connect) {
          res.render("error", {
               css: "error.css",
               error: "فشل الاتصال بالخدمة",
               back: "/signup", user: req.user
          })
          
         } else {
          const courseId = req.params.courseId
          const videoId = req.params.videoId

          const course = await Course.findOne({ _id: courseId })
          if(!course) {
               res.render("watch", {
                    css: "watch.css",
                    user: req.user,
                    error: "رابط تحميل الفيديو خاطئ",
                    videoUrl: null,
                    course: null
               })
          } else {
               const user = await User.findOne({ email: req.user.data, courses: { $in: course._id.toString() } })
               if(!user) {
                    res.redirect(`/course/${course._id}`)
               } else {
                    res.render("watch", {
                         css: "watch.css",
                         user: req.user,
                         error: null,
                         videoUrl: req.params.videoId,
                         course
                    })
               }
          }
         }

     } catch (error) {
         console.log(error) 
         res.render("watch", {
          css: "watch.css",
          user: req.user,
          error: "فشل التحميل  #3227208 الرابط غير صالح",
          videoUrl: null,
          course: null
     })
     }
}

module.exports = { watchGET }
