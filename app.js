const express = require("express")
const morgan = require("morgan")
const session = require("express-session")
const mongoose = require("mongoose")
const ejs = require("ejs")
const expressValidator = require("express-validator")
const counter = require("./utils/viewsCounter.js")
require('dotenv').config()

const routes = require("./routes/routes.js")
const connectDB = require("./utils/db.js")
const cookieParser = require("cookie-parser")
const storageEngine = require("./utils/storageEngine.js")

const app = express()

app.use(session({
     secret: "secreto",
     resave: true,
     saveUninitialized: true
}))

app.set("view engine", "ejs")

app.use(cookieParser())

app.use(express.static("public"));

app.use("*",counter.count)
app.use(routes)
app.use(morgan("dev"))

app.get('/logout', (req, res) => {
     res.clearCookie('toJtkn');
     res.redirect('/login');
   });

app.listen(process.env.PORT || 3000, (err) => {
     if(err) {
          console.log(err)
     }
})
