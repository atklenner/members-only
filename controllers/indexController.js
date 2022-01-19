const User = require("../models/user");
const Message = require("../models/message");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const bcrypt = require("bcryptjs");

exports.index = function (req, res, next) {
  Message.find()
    .sort({ timestamp: -1 })
    .exec((err, messages) => {
      if (err) {
        return next(err);
      }
      res.render("index", { title: "Home Page", messages: messages });
    });
};

exports.indexSecret = [
  body("secret", "Incorrect secret").custom(
    (value) => value === "poopoopeepee"
  ),
  (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.redirect("/");
    } else {
      const user = new User({
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        username: req.user.username,
        password: req.user.password,
        membership: true,
        _id: req.user._id,
      });
      User.findByIdAndUpdate(req.user._id, user, {}, (err, user) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    }
  },
];

exports.signupGet = function (req, res, next) {
  res.render("signup", { title: "Sign your life away" });
};

exports.signupPost = [
  body("firstName", "First Name is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("lastName", "Last Name is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("username", "Email is required").isEmail().escape(),
  body("password", "Password is required").trim().isLength({ min: 1 }).escape(),
  body("confirmPassword", "Password confirmation is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords must be the same");
    }
    return true;
  }),
  (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("signup", { title: "Try that one again" });
    } else {
      User.findOne({ username: req.body.username }).exec((err, foundUser) => {
        if (err) {
          return next(err);
        }
        if (foundUser) {
          res.redirect("/");
        } else {
          bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
            const user = new User({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              username: req.body.username,
              password: hashedPassword,
            });
            user.save((err) => {
              if (err) {
                return next(err);
              }
              res.redirect("/");
            });
          });
        }
      });
    }
  },
];

exports.signInGet = (req, res, next) => {
  res.render("signin", { title: "Sign Ins" });
};

exports.signInPost = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/",
});

exports.logOut = (req, res, next) => {
  req.logout();
  res.redirect("/");
};

exports.messageGet = (req, res, next) => {
  res.render("message", { title: "Tell us about your day" });
};

exports.messagePost = [
  body("title", "Title is required").trim().isLength({ min: 1 }).escape(),
  body("message", "Message is required").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("/");
    }
    const message = new Message({
      title: req.body.title,
      message: req.body.message,
      user: req.user.firstName,
    });
    message.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  },
];

exports.adminGet = (req, res, next) => {
  res.render("admin", { title: "Are you ready?" });
};

exports.adminPost = [
  body("secret", "Incorrect secret").custom((value) => value === "Kill Barney"),
  (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.redirect("/");
    } else {
      const user = new User({
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        username: req.user.username,
        password: req.user.password,
        membership: true,
        admin: true,
        _id: req.user._id,
      });
      User.findByIdAndUpdate(req.user._id, user, {}, (err, user) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    }
  },
];

exports.deleteGet = (req, res, next) => {
  Message.findById(req.params.id).exec((err, message) => {
    if (err) {
      return next(err);
    }
    res.render("deleteMessage", { title: "Delete Message?", message: message });
  });
};

exports.deletePost = (req, res, next) => {
  Message.findByIdAndRemove(req.params.id, function deleteMessage(err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
