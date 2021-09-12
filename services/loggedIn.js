var authService = require("../services/auth");
module.exports = {
  loggedUser: function(req,res,next) {
    let token = req.cookies.jwt;
    if (authService.verifyUser(token)) {
      authService.verifyUser(token).then(user => {
        if (user) {
            next();
        } else {
          res.status(401);
          res.send("Invalid authentication token");
        }
      });
    } else {
      res.status(401);
      res.render("mustLogin");
    }
  },
};