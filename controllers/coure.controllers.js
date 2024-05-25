const User = require("../models/user.js");
const Course = require("../models/course.js");
const connectDB = require("../utils/db.js");
const course = require("../models/course.js");

const coursesShopGET = async (req, res, next) => {
        
     try {
          const connect = await connectDB();

          if(!connect) {
           res.render("error", {
                css: "error.css",
                error: "فشل الاتصال بالخدمة",
                back: "/", user: req.user
           });

          } else {

               let courses = await Course.find({});

               if(!courses || !courses.length) {
                    res.render("courseShop", {
                         css: "courseShop.css",
                         error: "لا يوجد كورسات متوفرة حاليا",
                         courses: null, user: req.user
                    });
               } else {
                    res.render("courseShop", {
                         css: "courseShop.css",
                         error: null,
                         courses, user: req.user
                    });
               }

             
          }
     } catch (error) {
          res.render("courseShop", {
               css: "courseShop.css",
               error: "لا يوجد كورسات متوفرة حاليا",
               courses: null, user: req.user
          });
          console.log(error);
     }
}

const courseGET = async (req, res, next) => {
     try {

          const connect = await connectDB();

          if(!connect) {
           res.render("error", {
                css: "error.css",
                error: "فشل الاتصال بالخدمة",
                back: "/", user: req.user
           });
          } else {

               const courseId = req.params.courseId;

               const course = await Course.findOne({ _id: courseId });

               if(!course) {
                    res.render("course", {
                         css: "course.css",
                         error: "عذراً, هذه الدورة غير متوفرة في الوقت الحالي",
                         course: null, user: req.user
                    });
               } else {
                    res.render("course", {
                         css: "course.css",
                         error: null,
                         course, user: req.user
                    });
               }
          }
     } catch (error) {
          console.log(error);
          res.render("course", {
               css: "course.css",
               error: "فشل جلب معلومات الدورة",
               course: null, user: req.user
          });
     }
}

const manageCoursesGET = async (req, res, next) => {
     try {
          const connect = await connectDB();

          if(!connect) {
           res.render("error", {
                css: "error.css",
                error: "فشل الاتصال بالخدمة",
                back: "/", user: req.user
           });
          } else {
               
               const courses = await Course.find({});

               if(!courses) {
                    res.render("manageCourses", {
                         css: "manageCourses.css", error: "فشل جلب الدورات", user: req.user, courses: null
                    });
               } else {
                    res.render("manageCourses", {
                         css: "manageCourses.css", error: null, user: req.user, courses
                    });
               }
          }
     } catch (error) {
          res.render("manageCourses", {
               css: "manageCourses.css", error: "فشل جلب الدورات", user: req.user, courses: null
          });
          console.log(error);
     }
}

const courseManageGET = async (req, res, next) => {
     try {
          const connect = await connectDB();

          if(!connect) {
           res.render("error", {
                css: "error.css",
                error: "فشل الاتصال بالخدمة",
                back: "/", user: req.user
           });
          } else {

               courseId = req.params.courseId;

               const course = await Course.findOne({ _id: courseId })
               if(!course) {
                    res.render("courseManage", {
                         course: null, error: "لا يوجد دورة", user: req.user, note: null, css: "courseManage.css"
                    });
               } else {
                    res.render("courseManage", {
                         course, error: null, user: req.user, note: null, css: "courseManage.css"
                    });
               }
          }
     } catch (error) {
          console.log(error);
          res.render("courseManage", {
               course: null, error: "فشل التنفيذ", user: req.user, note: null, css: "courseManage.css"
          })
     }
}

const courseManagePOST = async (req, res, next) => {
     try {
          const connect = await connectDB();

          if(!connect) {
           res.render("error", {
                css: "error.css",
                error: "فشل الاتصال بالخدمة",
                back: "/", user: req.user
           });
          } else {

               courseId = req.params.courseId;

               const course = await Course.findOneAndDelete({ _id: courseId })
               if(!course) {
                    res.render("courseManage", {
                         course: null, error: "لا يوجد دورة فشل الحذف", user: req.user, note: null, css: "courseManage.css"
                    });
               } else {
                    res.render("courseManage", {
                         course: null, error: null, user: req.user, note:"تم حذف الدورة بنجاح", css: "courseManage.css"
                    });
               }
          }
     } catch (error) {
          console.log(error);
          res.render("courseManage", {
               course: null, error: "فشل التنفيذ", user: req.user, note: null, css: "courseManage.css"
          })
     }
}

const AddVideoToCoursePOST = async (req, res, next) => {
     try {
       const courseId = req.params.courseId;
       const { videoTitle, videoUrl } = req.body;
   
       const result = await Course.findOneAndUpdate(
         { _id: courseId },
         { $push: { "chapters.0.videos": { title: videoTitle, url: videoUrl } } },
         { new: true }
       );
   
       if (!result) {
         return res.render("courseManage", {
           course: null,
           error: "لا يوجد دورة فشل التعديل",
           user: req.user,
           note: null,
           css: "courseManage.css"
         });
       }
   
       return res.render("courseManage", {
         course: result,
         error: null,
         user: req.user,
         note: "تم اضافة الفيديو بنجاح",
         css: "courseManage.css"
       });
     } catch (error) {
       console.log(error);
       return res.render("courseManage", {
         course: null,
         error: "فشل التنفيذ",
         user: req.user,
         note: null,
         css: "courseManage.css"
       });
     }
   };

const changeCourseSoon = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const { soon } = req.body;

    const result = await Course.findOne({ _id: courseId });

    if (!result) {
      return res.render("courseManage", {
        course: null,
        error: "لا يوجد دورة فشل التعديل",
        user: req.user,
        note: null,
        css: "courseManage.css"
      });
    } else {
      if (soon === "on") {
        result.soon = "off";
      } else {
        result.soon = "on";
      }

      await result.save();

      if (result) {
        res.redirect(`/admin/course/manage/${result._id}`)
      } else {
        return res.render("courseManage", {
          course: result,
          error: "فشل التعديل",
          user: req.user,
          note: null,
          css: "courseManage.css"
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.render("courseManage", {
      course: null,
      error: "فشل التنفيذ",
      user: req.user,
      note: null,
      css: "courseManage.css"
    });
  }
};

const coursePayment = async (req, res, next) => {
     try {

          const connect = await connectDB()

          if(!connect) {
           res.render("error", {
                css: "error.css",
                error: "فشل الاتصال بالخدمة",
                back: "/", user: req.user
           })
          } else {

               const courseId = req.params.courseId

               const course = await Course.findOne({ _id: courseId })
               if(!course) {
                    res.render("payment", {
                         css: "payment.css",
                         error: "فشل جلب معلومات الدورة",
                         course: null, user: req.user
                    })
               } else if(course.soon == true) {
                    backURL = req.header('Referer') || '/';
                    console.log(backURL)
                    res.redirect(backURL)
               } else {
                    res.render("payment", {
                         css: "payment.css",
                         error: null,
                         course, user: req.user
                    })
               }
          }
     } catch (error) {
          console.log(error)
          res.render("payment", {
               css: "payment.css",
               error: "فشل جلب معلومات الدورة",
               course: null, user: req.user
          })
     }
}

module.exports = { coursesShopGET, changeCourseSoon, courseGET, courseManageGET, courseManagePOST, manageCoursesGET, coursePayment, AddVideoToCoursePOST }
