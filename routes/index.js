var express = require('express')
var router = express.Router()
var passport = require('passport')
var func = require('../functions')
var db = require('../db')

function specialLogger (req, res, next) {
  console.log('you hit sign up')
  next()
}

function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    res.redirect('/login')
  }
}

router.get('/', function (req,res){
  res.render('index')
})

router.get('/login', function (req, res) {
  res.render('login')
})

router.post('/login',
  passport.authenticate('local', { successRedirect: '/resource', failureRedirect: '/login'}))


router.get('/signup', function (req,res) {
  res.render('signup')
})


router.post('/signup',function (req,res) {

  req.body.password = func.hashPassword(req.body.password)
  console.log(req.body)
  db.addUser(req.body, req.app.get('connection'))
  .then(function (result) {
        res.send('success')
    })
    .catch(function (err) {
      res.status(500).send('DATABASE ERROR: ' + err.message)
    })
})


router.get('/logout', function (req,res) {
  res.render('logout')
})

router.get('/resource', ensureAuthenticated, function (req, res) {
  res.render('resource')
})

router.get('/auth/facebook', function (req,res) {
  res.send('social login')
})

router.get('/auth/facebook/callback', function (req,res) {
  res.send('callback from facebook')
})

router.get('/transactions', ensureAuthenticated, function (req, res) {
  console.log(req.user);
  res.render('transactions')
})

router.get('/users/:id/profile/edit', function (req, res) {
  res.send('authenticated user can only view this edit page')
})


module.exports = router
