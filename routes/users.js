var express = require("express");
var router = express.Router();
var models = require("../models");
var authService = require("../services/auth");
const {
  loggedUser
} = require("../services/loggedIn");

/* GET users listing. */
router.get("/", loggedUser, (req, res, next) => {
  res.send("uhhhhhhhhhhhhh....");
});

// Render the signup view
router.get("/signup", function (req, res, next) {
  res.render("signup");
});

// Create new user if one doesn't exist
router.post("/signup", function (req, res, next) {
  models.users
    .findOrCreate({
      where: {
        Username: req.body.username
      },
      defaults: {
        FirstName: req.body.firstName,
        LastName: req.body.lastName,
        Email: req.body.email,
        Password: authService.hashPassword(req.body.password)
      }
    })
    .then(function (created) {
      if (created) {
        res.redirect("login");
      } else {
        res.send("This user already exists");
      }
    });
});

// Render the login view
router.get("/login", function (req, res, next) {
  res.render("login");
});

// Login user and return JWT as cookie
router.post("/login", function (req, res, next) {
  models.users
    .findOne({
      where: {
        Username: req.body.username
      }
    })
    .then(user => {
      if (!user || user.Deleted) {
        console.log("User not found");
        return res.status(401).json({
          message: "User does not exist or was deleted"
        });
      } else {
        let passwordMatch = authService.comparePasswords(
          req.body.password,
          user.Password
        );
        if (passwordMatch) {
          let token = authService.signUser(user);
          res.cookie("jwt", token);
          res.redirect("profile");
        } else {
          console.log("Wrong password");
          res.send("Wrong password");
        }
      }
    });
});

router.get("/profile", function (req, res, next) {
  var title = "Profile";
  let token = req.cookies.jwt;
  if (authService.verifyUser(token)) {
    authService.verifyUser(token).then(user => {
      if (user) {
        models.users
          .findAll({
            where: {
              UserId: user.UserId
            },
            include: [{
              model: models.posts,
              Deleted: false
            }]
          })
          .then(result => {
            models.users
              .update({
                lastLogin: Date.now()
              }, {
                where: {
                  UserId: user.UserId
                },
                raw: true
              })
            // console.log(result);
            res.render("profile", {
              user: result[0],
              title: title
            });
          });
      } else {
        res.status(401);
        res.send("Invalid authentication token");
      }
    });
  } else {
    res.status(401);
    res.render("mustLogin");
  }
});

// Profile route, updates lastLogin with current date/time
// router.get("/profile", function (req, res, next) {
//   var title = "Profile";
//   let token = req.cookies.jwt;
//   if (authService.verifyUser(token)) {
//     authService.verifyUser(token).then(user => {
//       if (user) {
//         models.users
//           .findAll({
//             where: {
//               UserId: user.UserId
//             },
//             include: [{
//               model: models.posts,
//               Deleted: false
//             }]
//           })
//           .then(result => {
//             models.users
//               .update({
//                 lastLogin: Date.now()
//               }, {
//                 where: {
//                   UserId: user.UserId
//                 },
//                 raw: true
//               })
//             // console.log(result);
//             res.render("profile", {
//               user: result[0],
//               title: title
//             });
//           });
//       } else {
//         res.status(401);
//         res.send("Invalid authentication token");
//       }
//     });
//   } else {
//     res.status(401);
//     res.render("mustLogin");
//   }
// });

// basic logout route, we like that
router.get("/logout", function (req, res, next) {
  res.cookie("jwt", "", {
    expires: new Date(0)
  });
  res.redirect("login");
});

// Admin route to see all NON deleted users, you need to be an admin for this!
router.get("/admin", async (req, res, next) => {
  let token = req.cookies.jwt;
  if (authService.verifyUser(token)) {
    const user = await authService.verifyUser(token);
    if (user.Admin) {
      models.users
        .findAll({
          where: {
            Deleted: false
          },
          raw: true
        })
        .then(usersFound => res.render("adminView", {
          users: usersFound,
          user: user
        }));
    } else {
      res.send("unauthorized");
    };
  } else {
    res.send("unauthorized");
  }
});

// Render the editUser view per user id, you need to be an admin for this!
router.get("/admin/editUser/:id", function (req, res, next) {
  let userId = parseInt(req.params.id);
  let token = req.cookies.jwt;
  if (authService.verifyUser(token)) {
    authService.verifyUser(token).then(user => {
      if (user.Admin) {
        models.users
          .findOne({
            where: {
              UserId: userId
            },
            raw: true
          })
          .then(user => res.render("editUser", {
            user: user
          }));
      } else {
        res.send("unauthorized");
      }
    });
  }
});

// Make the user an admin as found on the editUser view, you need to be an admin for this!
router.put("/admin/editUser/:id", function (req, res, next) {
  let userId = parseInt(req.params.id);
  let token = req.cookies.jwt;
  if (authService.verifyUser(token)) {
    authService.verifyUser(token).then(user => {
      if (user.Admin) {
        models.users
          .update({
            Admin: true
          }, {
            where: {
              UserId: userId
            },
            raw: true
          })
          .then(user => res.redirect("/users/admin"));
      } else {
        res.send("unauthorized");
      }
    });
  }
});

// Delete user based on their id, you need to be an admin for this!
router.delete("/admin/editUser/:id", function (req, res, next) {
  let userId = parseInt(req.params.id);
  let token = req.cookies.jwt;
  if (authService.verifyUser(token)) {
    authService.verifyUser(token).then(user => {
      if (user.Admin) {
        models.users
          .update({
            Deleted: true
          }, {
            where: {
              UserId: userId
            },
            raw: true
          })
          .then(user => res.redirect("/users/admin"));
      } else {
        res.send("unauthorized");
      }
    });
  }
});

//LEAVE AT THE BOTTOM... Oops?
// Specific user profile route using their username instead of their id
router.get("/:username", function (req, res, next) {
  let username = req.params.username;
  let token = req.cookies.jwt;
  console.log(token);
  if (authService.verifyUser(token)) {
    authService.verifyUser(token).then(user => {
      if (user) {
        models.users
          .findOne({
            where: {
              Username: username
            },
            raw: true
          })
          .then(user => res.render("oneuser", {
            user: user
          }));
      } else {
        res.send("unauthorized");
      }
    });
  }
});


module.exports = router;