const { Router } = require("express");
const User = require("../models/User");
const { RegisterUser, LoginUser } = require("../controllers/user");

const router = Router();

router.post("/register", RegisterUser);
router.post("/login", LoginUser);

module.exports = router;
