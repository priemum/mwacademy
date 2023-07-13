const Counter = require("../models/counter.js");
const connectDB = require("../utils/db.js");

const count = async (req, res, next) => {
     const connect = await connectDB();

          if(!connect) {
           next();
          } else {
               let CounterLength = await Counter.count();
               if (CounterLength <= 0) {
                  let counter = new Counter({ count: 0 });
                    await counter.save();
                  } else {
                       
                   let count = await Counter.findOneAndUpdate({}, { $inc: { count: 1 } });

                    }
                  next();
          }
}

module.exports = { count }
