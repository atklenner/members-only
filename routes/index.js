var express = require("express");
var router = express.Router();

const indexController = require("../controllers/indexController");

/* GET home page. */
router.get("/", indexController.index);

router.post("/", indexController.indexSecret);

router.get("/sign-up", indexController.signupGet);

router.post("/sign-up", indexController.signupPost);

router.get("/sign-in", indexController.signInGet);

router.post("/sign-in", indexController.signInPost);

router.get("/log-out", indexController.logOut);

router.get("/message-form", indexController.messageGet);

router.post("/message-form", indexController.messagePost);

router.get("/admin-upgrade", indexController.adminGet);

router.post("/admin-upgrade", indexController.adminPost);

router.get("/delete/:id", indexController.deleteGet);

router.post("/delete/:id", indexController.deletePost);

module.exports = router;
