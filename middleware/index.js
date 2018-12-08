const User = require("../models/user");

module.exports = {
  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/backend/login");
  },
  seedUser: (username, password) => {
    User.register(new User({username: username}), password, (err, user) => {
      if (err) {
        console.log(err);
      } else {
        console.log("user " + username + " seeded...");
      }
    });
  }
}