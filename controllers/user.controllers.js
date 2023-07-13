const User = require("../models/user.js")
const Course = require("../models/course.js")
const mongoose = require("mongoose")
const connectDB = require("../utils/db.js")

const userProfileGET = async (req, res, next) => {
     try {
          const connect = await connectDB()

          if(!connect) {
 
           res.render("error", {
                css: "error.css",
                error: "فشل الاتصال بالخدمة",
                back: "/profile", user: req.user
           }) 
          } else {
               let userFind = await User.findOne({ email: req.user.data })

               if(!userFind) {
                    res.render("userProfile", {
                    css: "userProfile.css",
                    error: "فشل الاتصال",
                    user: null
          })
               } else {

                    var courses = []

                    for (let i = 0; i < userFind.courses.length; i++) {
                         const findCourse = await Course.findOne({ _id:userFind.courses[i] });
                         courses.push(findCourse)
                    }

                    console.log(courses)
                    res.render("userProfile", {
                         css: "userProfile.css",
                         error: null,
                         user: userFind,
                         courses
                    })
               }
          }

     } catch (error) {
          console.log(error)
          res.render("userProfile", {
               css: "userProfile.css",
               error: "فشل الاتصال",
               user: null
          })
     }
     
} 

module.exports = { userProfileGET }
