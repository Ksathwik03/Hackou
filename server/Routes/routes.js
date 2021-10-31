const express = require("express");
const router = express.Router();

const {
  // getProfile,
  addProfile,
  login,
  updateUser,
  deleteUser,
  getUserById,
  verifyUser,
  forgotPassword,
  resetPassword,
  ipMiddleware,
  logoutUser
} = require("../controllers/authController");

router.post("/login/",ipMiddleware, login);
router.route("/register/").post(addProfile);
router.patch("/profile/update",ipMiddleware,verifyUser,updateUser);
router.delete("/profile/delete",ipMiddleware,verifyUser, deleteUser);
router.get("/profile",ipMiddleware,verifyUser,getUserById);
router.post("/logout",verifyUser,logoutUser)
router.post('/forgotpassword',ipMiddleware,forgotPassword);
const {verifyEmail, sendEmail, sendMailController} = require("../controllers/emailController")
router.get('/verifyEmail/:username/:hashid', verifyEmail)
router.get('/reset/:hashid', function(req,res){ res.send('Password Reset page where we enter the password to be done by frontend') })
router.post('/reset/:hashid',ipMiddleware, resetPassword)
router.post('/sendmail',ipMiddleware, sendMailController)
router.post('/changePassword/:username/:hashid', forgotPassword)

module.exports = router;
