const express = require("express");
const router = express.Router();

const {signup,login,forgotPassword,resetPassword,logout,} = require("../controller/auth");


router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


module.exports = router;