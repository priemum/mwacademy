const User = require("../models/user.js");
const Course = require("../models/course.js");
const connectDB = require("../utils/db.js");
const Counter = require("../models/counter.js");

const dashboardGET = async (req, res, next) => {
    try {
     const connect = await connectDB();

          if(!connect) {
           res.render("error", {
                css: "error.css",
                error: "فشل الاتصال بالخدمة",
                back: "/", user: req.user
           });

          } else {

               const counts = await Counter.findOne({});
               if(!counts) {
                    res.render("dashboard", {
                         css: "dashboard.css", user: req.user, error: null, count: null
                    });
               } else {
                    res.render("dashboard", {
                         css: "dashboard.css", user: req.user, error: null, count: counts.count
                    });
               }
          }
    } catch (error) {
     res.render("dashboard", {
          css: "dashboard.css", user: req.user, error: "فشل الاتصال", count: null
     })
    }
}

const dashboardPOST = async (req, res, next) => {
     try {
          const connect = await connectDB();

          if(!connect) {
           res.render("error", {
                css: "error.css",
                error: "فشل الاتصال بالخدمة",
                back: "/", user: req.user
           });

          } else {
               let userIdentify = req.body.userIdentify;

               const user = await User.findOne({ userId: userIdentify });
               if(!user) {
                    res.render("dashboard", {
                         css: "dashboard.css", user: req.user, error: "لا يوجد مستخدم بهذا المعرف", count: null,
                    });
               } else {
                    res.redirect(`/admin/manage/${user._id}`);
               }
          }
     } catch (error) {
          res.render("dashboard", {
               css: "dashboard.css", user: req.user, error: "فشل الاتصال", count: null
          });
          console.log(error);
     }
}

const userManageGET = async (req, res, next) => {
     try {
          const connect = await connectDB();

          if(!connect) {
           res.render("error", {
                css: "error.css",
                error: "فشل الاتصال بالخدمة",
                back: "/", user: req.user
           });
          } else {
               const userId = req.params.userId;
               let userM = await User.findOne({ _id: userId });

               if(!userM) {
                    res.render("userManage", {
                         css: "userManage.css", user: req.user, error: "لا يوجد مستخدم بهذا المعرف", userM: null, courses: null
                    });
               } else {

                    const courses = await Course.find({});
                    if(!courses) {
                         res.render("userManage", {
                              css: "userManage.css", user: req.user, error: "فشل جلب الدورات او لا يوجد دورات بالفعل", userM, courses: null
                         });
                    } else {
                         res.render("userManage", {
                              css: "userManage.css", user: req.user, error: null, userM, courses
                         });
                    }
               }
          }

     } catch (error) {
          res.render("userManage", {
               css: "userManage.css", user: req.user, error: "فشل الاتصال", userM: null, courses: null
          });
          console.log(error);
     }
}

const addCourseToUser = async (req, res, next) => {
     try {
          const connect = await connectDB();

          if(!connect) {
           res.render("error", {
                css: "error.css",
                error: "فشل الاتصال بالخدمة",
                back: "/", user: req.user
           });

          } else {
               const userId = req.params.userId;
               let courseId = req.params.courseId;
               let user = await User.findOne({ _id: userId });

               if(!user) {
                    res.render("userManage", {
                         css: "userManage.css", user: req.user, error: "فشل اضافة الدروة لم يتم ايجاد المستخدم", userM: null, courses: null
                    });
               } else {
                  const addCheck = await User.findOneAndUpdate(
                         { _id: user._id },
                         { $push: { courses: courseId } },
                         { new: true }
                       );
                       if(!addCheck) {
                         res.render("userManage", {
                              css: "userManage.css", user: req.user, error: "فشل اضافة الدروة", userM: null, courses: null
                         });
                       } else {
                         await Course.findOneAndUpdate({ _id: courseId }, { $inc: { students: 1 } });
                       }
                       
                    res.redirect(`/admin/manage/${user._id}`);
               }
          }
     } catch (error) {
          console.log(error);
          res.render("userManage", {
               css: "userManage.css", user: req.user, error: "فشل اضافة الدروة", userM: null, courses: null
          })
     }
}
const removeCourseToUser = async (req, res, next) => {
     try {
          const connect = await connectDB();

          if(!connect) {
           res.render("error", {
                css: "error.css",
                error: "فشل الاتصال بالخدمة",
                back: "/", user: req.user
           });

          } else {
               const userId = req.params.userId;
               let courseId = req.params.courseId;
               let user = await User.findOne({ _id: userId });

               if(!user) {
                    res.render("userManage", {
                         css: "userManage.css", user: req.user, error: "فشل ازالة الدروة لم يتم ايجاد المستخدم", userM: null, courses: null
                    });
               } else {
                  const removeCheck = await User.findOneAndUpdate(
                         { _id: user._id },
                         { $pull: { courses: courseId } },
                         { new: true }
                       );
                       if(!removeCheck) {
                         res.render("userManage", {
                              css: "userManage.css", user: req.user, error: "فشل ازالة الدروة", userM: null, courses: null
                         });
                       } else {
                         await Course.findOneAndUpdate({ _id: courseId }, { $inc: { students: -1 } });
                       }
                    res.redirect(`/admin/manage/${user._id}`);
               }
          }
     } catch (error) {
          console.log(error)
          res.render("userManage", {
               css: "userManage.css", user: req.user, error: "فشل اضافة الدروة", userM: null, courses: null
          });
     }
}

const addCourseGET = async (req, res) => {
     res.render("addCourse", {
          css: "addCourse.css",
          error: null,
          errors: null,
          note: null, user: req.user
     });
}

const addCoursePOST = async (req, res) => {
     try {
          const connect = await connectDB()

          if(!connect) {
           res.render("error", {
                css: "error.css",
                error: "فشل الاتصال بالخدمة",
                back: "/", user: req.user
           });
          } else {

               let { title, soon, hours, lecturesNumber, description, lang, learnPoint, price, chapterTitle, videoTitle, videoUrl, videoChapter} = req.body;
               var chapters = [];
               const thumbnail = req.file.filename;
               var videos = [];
               
               if (videoTitle.length === videoUrl.length) {
                    for (let j = 1; j <= chapterTitle.length; j++) {
                      const chapter = { chapTitle: chapterTitle[j - 1], videos: [] };
                      chapters.push(chapter);
                    }
                  
                    for (let i = 0; i < videoUrl.length; i++) {
                      const video = { vidTitle: videoTitle[i], vidUrl: videoUrl[i], vidChapter: videoChapter[i] };
                      videos.push(video);
                    }
                  
                    for (var i = 0; i < videos.length; i++) {
                      var video = videos[i];
                      var vidChapter = parseInt(video.vidChapter);
                  
                      if (chapters[vidChapter - 1]) {
                        chapters[vidChapter - 1].videos.push({
                          title: video.vidTitle,
                          url: video.vidUrl
                        });
                      }
                    }
                  }

               let newCourse = new Course({
                    title,
                    hours, 
                    lecturesNumber, 
                    description, 
                    lang, 
                    learnPoint, 
                    thumbnail, 
                    price,
                    chapters, 
                    soon
               });

               saveCourse = await newCourse.save();
               if(!saveCourse) {
                    res.render("addCourse", {
                         css: "addCourse.css",
                         error: "فشل اضافة الدورة, حاول مرةً اخرى في وقتِ لاحق او تحقق من ما ادخلته",
                         errors: null,
                         note: null, user: req.user
                    });
               } else {
                    res.render("addCourse", {
                         css: "addCourse.css",
                         error: null,
                         errors: null,
                         note: "تمت اضافة الدورى بنجاح", user: req.user
                    });
               }
              
          }
     } catch (error) {
          console.log(error);
          res.render("addCourse", {
               css: "addCourse.css",
               error: "فشل تحميل الكورس",
               errors: null,
               note: null, user: req.user
          })
     }
}

module.exports = { addCourseGET, addCoursePOST, dashboardGET, dashboardPOST, userManageGET, addCourseToUser, removeCourseToUser }
