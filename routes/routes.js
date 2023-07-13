const express = require("express")
const bodyParser = require("body-parser")


const MainControllers = require("../controllers/main.controllers.js")
const AuthControllers = require("../controllers/auth.controllers.js")
const CoursesControllers = require("../controllers/course.controllers.js")
const UserControllers = require("../controllers/user.controllers.js")
const AdminControllers = require("../controllers/admin.controllers.js")
const WatchControllers = require("../controllers/watch.controllers.js")

const validator = require("../utils/validator.js")
const protectRoute = require("../utils/jwt.js")
const counter = require("../utils/viewsCounter.js")
const storageEngine = require("../utils/storageEngine.js")

const router = express.Router()

// isNotAuth if you dont want user to enter when he is logged in
// isAuth if you dont want user to enter when he is not logged in
// checkAuth to get user informations if available
// checkAdmin to give or regret user access to the admin routes

router.get("/", protectRoute.checkAuth, MainControllers.main)

router.get("/signup", protectRoute.isNotAuth, AuthControllers.signupGET)
router.post("/signup", protectRoute.isNotAuth, bodyParser.urlencoded({ extended: true }), validator.validateCreateUser, AuthControllers.signupPOST)

router.get("/verify/:id/:otp", protectRoute.isNotAuth, AuthControllers.verify)
router.post("/verify/:id", protectRoute.isNotAuth, bodyParser.urlencoded({ extended: true }), AuthControllers.newVerify)

router.get("/forgot-password", AuthControllers.forgotPasswordGET)
router.post("/forgot-password/", bodyParser.urlencoded({ extended: true }), validator.validatePasswordRecovery, AuthControllers.forgotPasswordPOST)

router.get("/reset-password/:email/:otp", protectRoute.isNotAuth, AuthControllers.resetPasswordGET)
router.post("/reset-password/:email/:otp", protectRoute.isNotAuth, bodyParser.urlencoded({ extended: true }), validator.validatePasswordReset, AuthControllers.resetPasswordPOST)

router.get("/login", protectRoute.isNotAuth, AuthControllers.loginGET)
router.post("/login", protectRoute.isNotAuth, bodyParser.urlencoded({ extended: true }), validator.validateLoginUser, AuthControllers.loginPOST)

router.get("/courses", protectRoute.checkAuth, CoursesControllers.coursesShopGET)
router.get("/course/:courseId", protectRoute.checkAuth, CoursesControllers.courseGET)
router.get("/payment/:courseId/", protectRoute.isAuth, CoursesControllers.coursePayment)

router.get("/admin/manage/courses/", protectRoute.isAuth, protectRoute.checkAdmin, CoursesControllers.manageCoursesGET)
router.get("/admin/course/manage/:courseId", protectRoute.isAuth, protectRoute.checkAdmin, CoursesControllers.courseManageGET)
router.post("/admin/course/manage/:courseId", protectRoute.isAuth, protectRoute.checkAdmin, CoursesControllers.courseManagePOST)
router.post("/admin/manage/course/:courseId/add-video", protectRoute.isAuth, protectRoute.checkAdmin, bodyParser.urlencoded({ extended: true }), CoursesControllers.AddVideoToCoursePOST)
router.post("/admin/manage/course/:courseId/soon", protectRoute.isAuth, protectRoute.checkAdmin, bodyParser.urlencoded({ extended: true }), CoursesControllers.changeCourseSoon)
router.get("/admin/manage/:userId", protectRoute.isAuth, protectRoute.checkAdmin, AdminControllers.userManageGET)
router.post("/admin/manage/:userId", protectRoute.isAuth, protectRoute.checkAdmin, AdminControllers.userManageGET, bodyParser.urlencoded({ extended: true }))
router.post("/admin/add/:userId/:courseId", protectRoute.isAuth, protectRoute.checkAdmin, bodyParser.urlencoded({ extended: true }), AdminControllers.addCourseToUser)
router.post("/admin/remove/:userId/:courseId", protectRoute.isAuth, protectRoute.checkAdmin, bodyParser.urlencoded({ extended: true }), AdminControllers.removeCourseToUser)
router.get("/admin/add/course", protectRoute.isAuth, protectRoute.checkAdmin, AdminControllers.addCourseGET)
router.post("/admin/add/course", protectRoute.isAuth, protectRoute.checkAdmin, bodyParser.urlencoded({ extended: true }), storageEngine.upload.single("thumbnail"), validator.validateAddCourse, AdminControllers.addCoursePOST)

router.get("/profile", protectRoute.isAuth, UserControllers.userProfileGET)

router.get("/dashboard", protectRoute.isAuth, protectRoute.checkAdmin, AdminControllers.dashboardGET)
router.post("/dashboard", protectRoute.isAuth, protectRoute.checkAdmin, bodyParser.urlencoded({ extended: true }), AdminControllers.dashboardPOST)

router.get("/watch/:courseId/:videoId", protectRoute.isAuth, WatchControllers.watchGET)

module.exports = router;
