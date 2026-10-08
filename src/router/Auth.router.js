const express = require('express');
const Authcontroller = require('../controllers/Auth.controllers');
const router = express.Router();

router.post("/register", Authcontroller.registeruser);
router.post("/login", Authcontroller.loginuser);
router.post("/logout",Authcontroller.logoutuser);


module.exports = router;