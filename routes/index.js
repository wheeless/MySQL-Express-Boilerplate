var express = require('express');
var router = express.Router();
var models = require("../models"); //<--- Add models
var authService = require("../services/auth"); //<--- Add authentication service

/* GET home page. */

router.get("/", function(req, res, next) {
  let token = req.cookies.jwt;
  if (authService.verifyUser(token)) {
    authService.verifyUser(token).then(user => {
      if (user) {
        res.render("loggedInIndex", { user: user });
      } else {
        res.send("unauthorized");
      }
    });
  } else {
    res.render('index', { title: 'Express' });
  }
});

router.get("/test", function(req, res, next) {
  let token = req.cookies.jwt;
  if (token) {
    authService.verifyUser(token).then(user => {
      if (user) {
        res.render("loggedInIndex", { user: user });
      } else {
        res.send("unauthorized");
      }
    });
  } else {
    res.render('index', { title: 'Express' });
  }
});

router.get('/error', function(req, res, next) {
  res.render('error', { title: 'Error' });
});

router.get('/cannotAccess', function(req, res, next) {
  res.render('mustLogin', { title: 'Login Please' });
});


module.exports = router;
