const { body, validationResult } = require('express-validator');

exports.validateCreateUser = [
     body("userName").not().isEmpty().withMessage("اسم المستخدم مطلوب").bail().isLength({ min: 3, max: 30 }).withMessage("اقل عدد احرف لاسم المستخدم هو 3 احرف والاقصى 30").bail(),
     body("email").not().isEmpty().withMessage("البريد الالكتروني مطلوب").bail().isLength({ min: 5, max: 56 }).withMessage("اقل عدد احرف للبريد الالكتروني هو 5 احرف والاقصى 56").bail().isEmail().withMessage("البريد الالكتروني غير صالح").bail().escape().bail(),
     body("password").not().isEmpty().withMessage("كلمة المرور مطلوبة").bail().isLength({ min: 8, max: 256 }).withMessage("اقل عدد احرف لكلمة المرور هو 8 احرف ").bail().escape().bail(), (req, res, next) => {
          const errors = validationResult(req);
  
           if (!errors.isEmpty()) {
                res.render("signup", {
                    css: "signup.css",
                    errors,
                    error: null,
                    note: null, user: req.user
                });
           } else { next(); }
     }
];

exports.validateLoginUser = [
     body("email").not().isEmpty().withMessage("البريد الالكتروني مطلوب").bail().isLength({ min: 5, max: 56 }).withMessage("اقل عدد احرف للبريد الالكتروني هو 5 احرف والاقصى 56").bail().isEmail().withMessage("البريد الالكتروني غير صالح").bail().escape().bail(),
     body("password").not().isEmpty().withMessage("كلمة المرور مطلوبة").bail().isLength({ min: 8, max: 256 }).withMessage("اقل عدد احرف لكلمة المرور هو 8 احرف ").bail().escape().bail(), (req, res, next) => {
          const errors = validationResult(req);
  
           if (!errors.isEmpty()) {
                res.render("login", {
                    css: "login.css",
                    errors,
                    error: null,
                    note: null, user: req.user
                });
           } else { next(); }
     }
];

exports.validateOtp = [
     body("otp").not().isEmpty().withMessage("رمز التاكيد مطلوب").bail().escape().bail(), (req, res, next) => {
          const errors = validationResult(req);
  
           if (!errors.isEmpty()) {
                res.render("verify", {
                    css: "verify.css",
                    errors,
                    error: null,
                    note: null, user: req.user
                });
           } else { next(); }
     }
];

exports.validatePasswordRecovery = [
     body("email").not().isEmpty().withMessage("البريد الالكتروني مطلوب").bail().isLength({ min: 5, max: 56 }).withMessage("اقل عدد احرف للبريد الالكتروني هو 5 احرف والاقصى 56").bail().isEmail().withMessage("البريد الالكتروني غير صالح").bail().escape().bail(), (req, res, next) => {
          const errors = validationResult(req);
  
           if (!errors.isEmpty()) {
                res.render("forgot-password", {
                    css: "forgotPassword.css",
                    errors,
                    error: null,
                    note: null, user: req.user
                });
           } else { next(); }
     }
];

exports.validatePasswordReset = [
     body("password").not().isEmpty().withMessage("كلمة المرور مطلوبة").bail().isLength({ min: 8, max: 256 }).withMessage("اقل عدد احرف لكلمة المرور هو 8 احرف ").bail().escape().bail(), (req, res, next) => {
          const errors = validationResult(req);
  
           if (!errors.isEmpty()) {
                res.render("resetPassword", {
                    css: "resetPassword.css",
                    errors,
                    error: null,
                    note: null, user: req.user
                });
           } else { next(); }
     }
];

exports.validateAddCourse = [
     body("title").not().isEmpty().withMessage("عنوان الدورة مطلوب").bail().isLength({ min: 8, max: 256 }).withMessage("اقل عدد احرف للعنوان هو 8 احرف ").bail().escape().bail(),
     body("description").not().isEmpty().withMessage("الوصف مطلوب").bail().isLength({ min: 8, max: 2400 }).withMessage("اقل عدد احرف للوصف هو 8 احرف ").bail().escape().bail(),
     body("price").not().isEmpty().withMessage("سعر الدورة مطلوب").bail().isLength({ min: 1, max: 10 }).withMessage("اقل عدد احرف لكلمة المرور هو 1 احرف ").bail().escape().bail(),
     body("lang").not().isEmpty().withMessage("لغة الدورة مطلوبة").bail().isLength({ min: 3, max: 100 }).withMessage("اقل عدد احرف لكلمة المرور هو 3 احرف ").bail().escape().bail(),
     body("hours").not().isEmpty().withMessage("ساعات الدورة مطلوبة").bail().isLength({ min: 1, max: 256 }).withMessage("اقل عدد احرف للساعات هو 1 احرف ").bail().escape().bail(),
     (req, res, next) => {
          const errors = validationResult(req);
  
           if (!errors.isEmpty()) {
                res.render("addCourse", {
                    css: "addCourse.css",
                    errors,
                    error: null,
                    note: null, user: req.user
                });
           } else { next(); }
     }
];
