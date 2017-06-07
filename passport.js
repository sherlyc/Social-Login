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
      callbackURL: 'http://localhost:3000/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'email', 'photos']

    },

    function(accessToken, refreshToken, profile, done) {
        console.log(profile)
            db.findByFaceBookID(profile.id, connection)
            .then(function(user){
                if(user) {
                    return done(null, user)
                } else {
                    let newUser = {facebookId: profile.id, name: profile.displayName, email: profile.emails[0].value, facebookPic: profile.photos[0].value}
                    db.addUser(newUser, connection)
                    .then(function(res){
                        newUser.id = res[0]
                        user = newUser
                        console.log("after addUser")
                        console.log(user)
                        return done(null, user);

                    })
                    .catch(function (err) {
                        return done(null, false, {
                          message: 'DB Error'
                        });
                    })
                }
            })

    })) //passport.use

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  })

  passport.deserializeUser(function(id, done) {
    db.findById(id, connection)
      .then(function(user) {
        done(null, user)
      })
      .catch(done)

  })

  return passport
}
