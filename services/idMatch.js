const jwt = require("jsonwebtoken");
const models = require("../models/index");
const bcrypt = require("bcryptjs");
const posts = require("../models/posts");

var idMatch = {
  match: function(users, posts) {
    if(models.users.UserId === models.posts.UserId){
        return next();
    } else {
        res.send("NOT YOUR POST!");
    }
  },
};

module.exports = idMatch;