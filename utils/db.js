const mongoose = require("mongoose");

const connectDB = async () => {
     try {
        const conn =  await mongoose.connect(process.env.MONGO_URI, {
          serverSelectionTimeoutMS: 30000
        })
          console.log("Connected to DB . .");
     return conn;
     } catch (error) {
          console.log(error);
          res.render("error", {
               error: "فشل الاتصال, حاول مرةً اخرى في وقت لاحق"
          });
     }
}

module.exports = connectDB;
