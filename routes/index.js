var express = require('express')
var router = express.Router()
var passport = require('passport')
var func = require('../functions')
var db = require('../db')


function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    res.redirect('/login')
  }
}

function isAuthorisedUser (req, res, next) {
  if (!req.user){
  res.redirect('/login')
  } else if (req.user.id == req.params.id ) {
    return next()
  } else {
    res.redirect('/not-authorised')
  }
}

router.get('/', function (req,res){
  res.render('index')
})

router.get('/login', function (req, res) {
  res.render('login', {message: req.flash('error')})
})

router.post('/login',
  passport.authenticate('local', { successRedirect: '/resource', failureRedirect: '/login', failureFlash: true }))


router.get('/signup', function (req,res) {
  res.render('signup', {message: req.flash('error')})
})


router.post('/signup',function (req,res) {
  req.body.password = func.hashPassword(req.body.password)
  db.addUser(req.body, req.app.get('connection'))
  .then(function (result) {
        res.status(200).send('success')
    })
    .catch(function (err) {
        req.flash('error', 'email is not unique')
        res.redirect(302, 'signup')
    })
})

router.get('/logout', function (req,res) {
  req.logout();
  res.render('logout')
})

router.get('/resource', ensureAuthenticated, function (req, res) {
    console.log("from router resource")
    console.log(req.user)
    res.render('resource', {user: req.user})
})

router.get('/not-authorised', function (req,res) {
  res.send('not authorised')
})

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email']}))

router.get('/auth/facebook/callback',  passport.authenticate('facebook', {
            successRedirect : '/resource',
            failureRedirect : '/'
}));

router.get('/transactions', ensureAuthenticated, function (req, res) {
  res.render('transactions')
})

router.get('/users/:id/profile/edit', isAuthorisedUser, function (req, res) {
  res.send('welcome user')
})


module.exports = router
