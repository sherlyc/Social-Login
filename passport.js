var passport = require('passport')
var Strategy = require('passport-local').Strategy
var db = require('./db')
var func = require('./functions')

module.exports = function (app) {
  var connection = app.get("connection")
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new Strategy({
    usernameField: 'email'
    },

    function(email, password, done) {
      db.findByEmail(email, connection)
       .then (function(user) {
        if (!user) {
          return done(null, false, {message: 'User is not found'});
        }
        // bcrypt compare
        if (!func.comparePassword(password, user.password)) {
          return done(null, false, {message: 'Incorrect Password'});
        }
        // passswords match
        return done(null, user)
      })
    })
  ) //passport.use

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  })

  passport.deserializeUser(function(id, done) {
    db.findById(id)
      .then(function(user) {
        done(null, user)
      })
      .catch(done)

    })

    return passport
}
