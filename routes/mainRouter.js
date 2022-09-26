const express = require("express");
const router = express.Router();

const {
  register,
  login,
  autoLogin,
  logout,
  addPicture,
  getUsers,
  filterUsers,
} = require("../controllers/mainCOntroller");
const { validateRegistration } = require("../modules/validators");
const { validateUsername } = require("../modules/usernameValidation");

router.post("/register", validateUsername, validateRegistration, register);
router.post("/login", login);
router.get("/autoLogin", autoLogin);
router.get("/logout", logout);
router.post("/addPicture", addPicture);
router.post("/getUsers", getUsers);
router.post("/filter", filterUsers);

module.exports = router;
