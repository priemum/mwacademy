const Course = require("../models/course.js")
const connectDB = require("../utils/db.js")

const main = async (req, res, next) => {
     try {
          const connect = await connectDB()

          if(!connect) {
           res.render("error", {
                css: "error.css",
                error: "فشل الاتصال بالخدمة",
                back: "/"
           })
          } else {

               const courses = await Course.find({}).limit(2);

               if(!courses) {
                    res.render("home", {
                         css: "home.css",
                         error: null,
                         user: req.user,
                         courses: null
                    });
               } else {
                    res.render("home", {
                         css: "home.css",
                         error: null,
                         user: req.user,
                         courses
                    });
               }
          } 
     } catch (error) {
          res.render("home", {
               css: "home.css",
               error: "فشل الاتصال",
               user: null,
               courses: null
     });
          console.log(error);
     }
}

module.exports = { main }
