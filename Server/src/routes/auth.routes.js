const express = require("express");
const { register } = require("../controllers/auth.controller");
const {login} = require("../controllers/auth.controller")
const {getCurrentUser} = require("../controllers/auth.controller")
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", register);

router.post("/login",login)

router.get("/me", auth, getCurrentUser)

module.exports = router;