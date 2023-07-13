const mongoose = require('mongoose')
const bcrypt = require("bcrypt")
const mailer = require('../utils/nodemailer.js')
const jwt = require('jsonwebtoken')

const connectDB = require("../utils/db.js")
const User = require("../models/user.js");
const Otp = require("../models/otp.js");

const signupGET = (req, res, next) => {
     res.render("signup", {
          css: "signup.css",
          errors: null,
          error: null,
          note: null, user: req.user
     });
}

const loginGET = (req, res, next) => {
     res.render("login", {
          css: "login.css",
          errors: null,
          error: null,
          note: null, user: req.user
     });
}

const signupPOST = async (req, res) => {
     try {
         const connect = await connectDB();

         if(!connect) {
          res.render("error", {
               css: "error.css",
               error: "فشل الاتصال بالخدمة",
               back: "/signup", user: req.user
          });
          
         } else {

          let { userName, email, password } = req.body
 
                let oldUser = await User.findOne({ email });
                if(oldUser) {
                    res.render("signup", {
                         css: "signup.css",
                         errors: null,
                         error: "البريد الالكتروني مسجل بالفعل",
                         note: null, user: req.user
                     });
                } else {
           
                 saltRounds = 10;
                 hashedPassword = bcrypt.hashSync(password, saltRounds);
            
                 if(hashedPassword) {
                   newUser = new User({
                       userName,
                       email,
                       password: hashedPassword,
                       userId: Math.floor(100000 + Math.random() * 900000)
                 });
        
                let saveUser = await newUser.save();

                if(!saveUser) {
                         res.render("signup", {
                              css: "signup.css",
                              errors: null,
                              error: "فشل التسجيل اعد المحاولة في وقت لاحق #3224582",
                              note: null, user: req.user
                    });

                } else {

                    otp = Math.floor(1000 + Math.random() * 9000);
                    otpHashed = bcrypt.hashSync(otp.toString(), saltRounds);
                    newOtp = new Otp({
                         otp,
                         otpUser: saveUser._id
                    });

                    await newOtp.save();

                    await mailer.sendMail(email, otpHashed, saveUser._id);

                    res.render("signup", {
                         css: "signup.css",
                         errors: null,
                         error: null,
                         note: "تم تسجيل الحساب, تحقق من بريدك الالكتروني للتوثيق", user: req.user
                    });
               }
                 } else {

                  res.render("signup", {
                         css: "signup.css",
                         errors: null,
                         error: "فشل التسجيل اعد المحاولة في وقت لاحق #3223452",
                         note: null, user: req.user
                     });
                  } 
               }
           }
     } catch (error) {
          console.log(error);
          res.render("signup", {
               css: "signup.css",
               errors: null,
               error: "فشل التسجيل اعد المحاولة في وقت لاحق #3223452",
               note: null, user: req.user
           });
     }
}

const verify = async (req, res) => {
     try {
          const connect = await connectDB();

         if(!connect) {
          res.render("error", {
               css: "error.css",
               error: "فشل الاتصال بالخدمة",
               back: "/signup", user: req.user
          });
          
         } else {

          let { id, otp } = req.params;
          checkId = mongoose.isValidObjectId(id);
          if(!checkId) {
               res.render("verify", {
                    css: "verify.css",
                    errors: null,
                    error: "فشل التوثيق المستخدم غير موجود",
                    note: null,
                    newCode: false, user: req.user
               });
          } else {

          let user = await User.findOne({ _id: id });

          if(!user) {
               res.render("verify", {
                    css: "verify.css",
                    errors: null,
                    error: "فشل التوثيق المستخدم غير موجود",
                    note: null,
                    newCode: false, user: req.user
               });

          } else {
                    if (user.verified == true) {
                         res.render("verify", {
                              css: "verify.css",
                              errors: null,
                              error: "الحساب موثق بالفعل! سجل الدخول",
                              note: null,
                              newCode: false, user: req.user
                         });
                    } else {
                    let checkOtp = await Otp.findOne({ otpUser: user._id });

                    if(!checkOtp) {
                         res.render("verify", {
                              css: "verify.css",
                              errors: null,
                              error: "فشل التوثيق انتهت صلاحية الرمز",
                              note: null,
                              newCode: user._id, user: req.user
                         });

                    } else {

                         otp = otp.replace(/slash/g, "/");
                         
                         decryptOtp = bcrypt.compareSync(checkOtp.otp.toString(), otp);

                         if(!decryptOtp) {
                              res.render("verify", {
                                   css: "verify.css",
                                   errors: null,
                                   error: "فشل التوثيق الرمز غير صالح",
                                   note: null,
                                   newCode: true, user: req.user
                              });
                         } else {

                         verifyUser = await User.findByIdAndUpdate(user._id, { verified: true });
                         await Otp.findOneAndDelete({ _id: checkOtp._id });
                              if(!verifyUser) {
                                   res.render("verify", {
                                        css: "verify.css",
                                        errors: null,
                                        error: "فشل التوثيق حاول مرةً اخرى في وقت اخر",
                                        note: null,
                                        newCode: false, user: req.user
                                   });
                              } else {
                                   res.render("verify", {
                                        css: "verify.css",
                                        errors: null,
                                        error: null,
                                        note: null,
                                        newCode: false, user: req.user
                                   });
                              }
                         }
                      }
                  }
               }
          }
     }
          } catch (error) {
               res.render("verify", {
                    css: "verify.css",
                    errors: null,
                    error: "فشل التوثيق #3228756 ",
                    note: null, user: req.user
               })
               console.log(error)
          }
}

const newVerify = async (req, res) => {
     try {
          const connect = await connectDB();

         if(!connect) {

          res.render("error", {
               css: "error.css",
               error: "فشل الاتصال بالخدمة",
               back: "/signup", user: req.user
          });

      } else {

          let id = req.params.id;
          let checkUser = await User.findOne({ _id: id });

          if(!checkUser) {
               res.render("verify", {
                    css: "verify.css",
                    errors: null,
                    error: "فشل ارسال بريد التوثيق, المستخدم غير موجود",
                    note: null, user: req.user
               });
          } else if(checkUser.verified == true) {
               res.render("verify", {
                    css: "verify.css",
                    errors: null,
                    error: "الحساب موثق بالفعل! سجل الدخول",
                    note: null,
                    newCode: false, user: req.user
               });
          } else {
               checkOtp = await Otp.findOne({ otpUser: checkUser._id });
               if(checkOtp) {
                    res.render("verify", {
                         css: "verify.css",
                         errors: null,
                         error: "تم ارسال بريد التوثيق بالفعل, تحقق من بريدك الالكتروني مجدداً",
                         note: null,
                         newCode: false, user: req.user
                    });
               } else {

                    otp = Math.floor(1000 + Math.random() * 9000);
                    otpHashed = bcrypt.hashSync(otp.toString(), 10);
                    newOtp = new Otp({
                         otp,
                         otpUser: checkUser._id
                    });

                    await newOtp.save();

                    mailer.sendMail(checkUser.email, otpHashed, checkUser._id)
                    res.render("verify", {
                         css: "verify.css",
                         errors: null,
                         error: "تم ارسال بريد توثيق اخر",
                         note: null,
                         newCode: false, user: req.user
                    });
               }
          }
      } 

     } catch (error) {
          console.log(error)
          res.render("verify", {
               css: "verify.css",
               errors: null,
               error: "فشل ارسال بريد التوثيق, حاول مرةً اخرى في وقت لاحق #3225480 ",
               note: null,
               newCode: false, user: req.user
          });
     }
}

const loginPOST = async (req, res) => {
     try {
          const connect = await connectDB();

         if(!connect) {

          res.render("error", {
               css: "error.css",
               error: "فشل الاتصال بالخدمة",
               back: "/login", user: req.user
          });

      } else {
          let { email, password } = req.body;

          let user = await User.findOne({ email });
          if(!user) {
               res.render("login", {
                    css: "login.css",
                    errors: null,
                    error: "لا يوجد مستخدم بهذا البريد الالكتروني",
                    note: null, user: req.user
                });
          } else {
               if(user.verified == false) {
                    res.render("login", {
                         css: "login.css",
                         errors: null,
                         error: "يجب تاكيد البريد الالكتروني اولاً, تحقق من بريدك الالكتروني",
                         note: null, user: req.user
                     });
               } else {
                    let checkPassword = bcrypt.compareSync(password, user.password);

                    if(!checkPassword) {
                         res.render("login", {
                              css: "login.css",
                              errors: null,
                              error: "كلمة المرور او البريد الالكتروني خاطئة",
                              note: null, user: req.user
                          });
                    } else {
                         const token = jwt.sign({
                              data: user.email,
                              admin: user.admin
                         }, process.env.PRIVATE_KEY, (err, token) => {
                              if(err) {
                                   res.render("login", {
                                        css: "login.css",
                                        errors: null,
                                        error: "فشلت عملية تسجيل الدخول, حاول مرة اخرى في وقت لاحق #3221128",
                                        note: null, user: req.user
                                    });
                                   console.log(err)
                              } else {
                                   res.cookie("toJtkn", token, {
                                        httpOnly: true,
                                        sameSite: "strict"
                                   });
                                   res.redirect("/");
                              }
                         });
                    }
               }
          }
      }
     } catch (error) {
          console.log(error);
          res.redirect("/");
     }
}

const forgotPasswordGET = async (req, res) => {
     try {
          const connect = await connectDB();

          if(!connect) {
 
           res.render("error", {
                css: "error.css",
                error: "فشل الاتصال بالخدمة",
                back: "/login", user: req.user
           });
 
       } else {
          res.render("forgot-password", {
               css: "forgotPassword.css",
               error: null,
               errors: null,
               note: null, user: req.user
          });
       }
     } catch (error) {
          res.render("forgot-password", {
               css: "forgotPassword.css",
               error: "يتعذر ارسال طلب اعادة تعيين كلمة مرورك في الوقت الحالي",
               errors: null,
               note: null, user: req.user
          });
     }
}

const forgotPasswordPOST = async (req, res) => {
     try {
          const connect = await connectDB();

          if(!connect) {
 
           res.render("error", {
                css: "error.css",
                error: "فشل الاتصال بالخدمة",
                back: "/login", user: req.user
           });
 
       } else {
          let { email } = req.body;
          let user = await User.findOne({ email: email });

          if(!user) {
               res.render("forgot-password", {
                    css: "forgotPassword.css",
                    error: "البريد الالكتروني غير مسجل",
                    errors: null,
                    note: null, user: req.user
     
               });
          } else {
               if(user.verified == false) {
                    res.render("forgot-password", {
                         css: "forgotPassword.css",
                         error: "يجب توثيق بريدك الالكتروني اولاً",
                         errors: null,
                         note: null, user: req.user
                    });
               } else {

                    checkOtp = await Otp.findOne({ otpUser: user._id });

                    if (checkOtp) {
                         res.render("forgot-password", {
                              css: "forgotPassword.css",
                              error: "تم ارسال بريد اعادة تعيين كلمة المرور بالفعل, تحقق من بريدك الالكتروني",
                              errors: null,
                              note: null, user: req.user
                         });
                    } else {
                         otp = Math.floor(1000 + Math.random() * 9000);
                         otpHashed = bcrypt.hashSync(otp.toString(), 10);
     
                         otpHashed = otpHashed.replace(/\//g, "slash");
     
     
                         newOtp = new Otp({
                              otp,
                              otpUser: user._id
                         });
          
                         await newOtp.save();
          
                         sendmailcheck = mailer.sendResetMail(user.email, otpHashed);
     
                         res.render("forgot-password", {
                              css: "forgotPassword.css",
                              error: null,
                              errors: null,
                              note: "تم ارسال البريد, تحقق من بريدك الالكتروني", user: req.user
                         });
                    }
               }
          }
       }
     } catch (error) {
          console.log(error)
          res.render("forgot-password", {
               css: "forgotPassword.css",
               error: "فشل ارسال بريد لاعادة التعيين حاول مرةً اخرى لاحقاً",
               errors: null,
               note: null, user: req.user
          })
     }
}

const resetPasswordGET = async (req, res) => {
     try {
          const connect = await connectDB();

          if(!connect) {
 
           res.render("error", {
                css: "error.css",
                error: "فشل الاتصال بالخدمة",
                back: "/login", user: req.user
           });
 
       } else {

          let email = req.params.email;
          let otp = req.params.otp;

          otp = otp.replace(/slash/g, "/");

          findUser = await User.findOne({ email: email });
          if(!findUser) {
               res.render("resetPassword", {
                    css: "resetPassword.css",
                    error: "البريد الالكتروني غير مسجل",
                    errors: null,
                    note: null, user: req.user
               });
          } else {
               findOtp = await Otp.findOne({ otpUser: findUser._id })
               if(!findOtp) {
                    res.render("resetPassword", {
                         css: "resetPassword.css",
                         error: "الجلسة غير صالحة, اعد الارسال مرة اخرى",
                         errors: null,
                         note: null, user: req.user
                    });
               } else {
                    encryptedOtp = bcrypt.compareSync(findOtp.otp.toString(), otp.toString())

                    if(encryptedOtp) {
                         res.render("resetPassword", {
                              css: "resetPassword.css",
                              error: null,
                              errors: null,
                              note: null, user: req.user
                         });
                    } else {
                         res.render("resetPassword", {
                              css: "resetPassword.css",
                              error: "الجلسة غير صالحة, اعد الارسال مرة اخرى",
                              errors: null,
                              note: null, user: req.user
                         });
                    }
               }
          }
       }
     } catch (error) {
          console.log(error)
          res.render("resetPassword", {
               css: "resetPassword.css",
               error: "الجلسة غير صالحة, اعد الارسال مرة اخرى",
               errors: null,
               note: null, user: req.user
          });
     }
}

const resetPasswordPOST = async (req, res) => {
     try {
          const connect = await connectDB();

          if(!connect) {
 
           res.render("error", {
                css: "error.css",
                error: "فشل الاتصال بالخدمة",
                back: "/login", user: req.user
           });
 
       } else {
          let email = req.params.email;
          let newPassword = req.body.password;
          let user = await User.findOne({ email });

          if(!user) {
               res.render("resetPassword", {
                    css: "resetPassword.css",
                    error: "البريد الالكتروني غير مسجل",
                    errors: null,
                    note: null, user: req.user
               });
          } else {
               otpCheck = await Otp.findOne({ otpUser: user._id });

               if(!otpCheck) {
                    res.render("resetPassword", {
                         css: "resetPassword.css",
                         error: "الجلسة غير صالحة, اعد الارسال مرة اخرى",
                         errors: null,
                         note: null, user: req.user
                    });
               } else {
                    hashedPassword = bcrypt.hashSync(newPassword.toString(), 10);
                    updatePassword = await User.findOneAndUpdate({ email: user.email, password: hashedPassword });
                    await Otp.findOneAndDelete({ otpUser: user._id });
                    if(!updatePassword) {
                         res.render("resetPassword", {
                              css: "resetPassword.css",
                              error: "فشل اعادة التعيين, جرب مرة اخرى في وقت لاحق",
                              errors: null,
                              note: null, user: req.user
                         });
                    } else {
                         res.render("resetPassword", {
                              css: "resetPassword.css",
                              error: null,
                              errors: null,
                              note: "تم اعادة تعيين كلمة المرور, سجل دخولك الان", user: req.user
                         });
                    }
               }
          }
       }
     } catch (error) {
          console.log(error)
          res.render("resetPassword", {
               css: "resetPassword.css",
               error: "فشل اعادة التعيين, جرب مرة اخرى في وقت لاحق",
               errors: null,
               note: null, user: req.user
          })
     }
}

const logout = (req, res, next) => {
     res.redirect("/");
     res.clearCookie('toJtkn');
}

module.exports = { signupGET, loginGET, loginPOST, signupPOST, verify, newVerify, forgotPasswordGET, forgotPasswordPOST, resetPasswordGET, resetPasswordPOST, logout }
