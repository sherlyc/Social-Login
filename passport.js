var passport = require('passport')
var Strategy = require('passport-local').Strategy
var FacebookStrategy = require('passport-facebook').Strategy;
var db = require('./db')
var func = require('./functions')

module.exports = function(app) {
  var connection = app.get("connection")
  app.use(require('cookie-parser')());
  app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
  }));
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new Strategy({
      usernameField: 'email'
    },

    function(email, password, done) {
      db.findByEmail(email, connection)
        .then(function(user) {
          if (!user) {
            return done(null, false, {
              message: 'User is not found'
            });
          }
          // bcrypt compare
          if (!func.comparePassword(password, user.password)) {
            return done(null, false, {
              message: 'Incorrect Password'
            });
          }
          // passswords match
          return done(null, user)
        })
    })) //passport.use

  passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: 'http://localhost:3000/auth/facebook/callback'
    },

    function(accessToken, refreshToken, profile, done) {

      console.log(profile)
      db.findByFaceBookID(profile.id, connection)
       .then (function(err, user) {
          if (err) {
            return done(err)

          }

          if (user) {
              return done(null, user); // user found, return that user
            } else {
              var newUser = {facebookId : profile.id,
                             name: profile.displayName}




          }
        )



       db.addUser(newUser, connection)
       .then(function(err, user) {
          if (err)
            throw err;
          return done(null, user);
        });
      }
    })) //passport.use

  passport.serializeUser(function(user, done) {
    console.log('seriialize');
    done(null, user.id);
  })

  passport.deserializeUser(function(id, done) {
    console.log('deserialize');
    db.findById(id, connection)
      .then(function(user) {
        console.log("deserialized user", {
          user
        });
        done(null, user)
      })
      .catch(done)

  })

  return passport
}
