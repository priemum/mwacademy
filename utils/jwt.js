const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const connectDB = require("./db.js");

const isAuth = async (req, res, next) => {
     try {
          token = req.cookies.toJtkn
          if(!token) {
               res.redirect("/login");
          } else {
               checkToken = jwt.verify(token, process.env.PRIVATE_KEY, (err, data) => {
                    if(err) {
                         res.redirect("/login");
                    } else {
                          req.user = data;
                          next();
                    }
               });
          }
     } catch (error) {
          res.redirect("/");
          console.log(error);
     }
}

const checkAuth = async (req, res, next) => {
     try {
          token = req.cookies.toJtkn;
          if(!token) {
               req.user = null;
               next();
          } else {
               checkToken = jwt.verify(token, process.env.PRIVATE_KEY, async (err, data) => {
                    if(err) {
                         res.redirect("/");
                    } else {
                         req.user = data;
                         next();
                    }
               });
          }
     } catch (error) {
          console.log(error);
          res.redirect("/login");
     }
}

const isNotAuth = async (req, res, next) => {
     try {
          token = req.cookies.toJtkn;
          if(token) {
               res.redirect("/");
          } else {
          req.user = null;
               next();
          }
     } catch (error) {
          res.redirect("/");
          console.log(error);
     }
}

const checkAdmin = async (req, res, next) => {
     try {
          const connect = await connectDB()

          if(!connect) {
           res.render("error", {
                css: "error.css",
                error: "فشل الاتصال بالخدمة",
                back: "/"
           });

          } else {
               let checkIsAdmin = await User.findOne({ email: req.user.data });
               if(!checkIsAdmin) {
                    res.redirect("/");
               } else if(checkIsAdmin.admin == false) {
                    res.redirect("/");
               } else {
                    next();
               }
          }
     } catch (error) {
          console.log(error);
          res.redirect("/");
     }
}

module.exports = { isAuth, isNotAuth, checkAuth, checkAdmin }
