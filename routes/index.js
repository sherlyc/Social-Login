var express = require('express')
var router = express.Router()
var passport = require('passport')

function specialLogger (req, res, next) {
  console.log('you hit sign up')
  next()
}


var db = require('../db')

router.get('/', function (req,res){
  res.render('index')
})

router.get('/login', function (req, res) {
  res.render('login')
})

router.post('/login',
  specialLogger,
  passport.authenticate('local', { failureRedirect: '/login'}),

function (req,res) {
  res.send('loggin in')
})

router.get('/signup', function (req,res) {
  res.render('signup')
})


router.post('/signup',
passport.authenticate('local', { failureRedirect: '/login'}),

function (req,res) {

  res.send('signup')
})


router.get('/logout', function (req,res) {
  res.render('logout')
})

router.get('/resource', function (req, res) {
  res.render('resource')
})

router.get('/auth/facebook', function (req,res) {
  res.send('social login')
})

router.get('/auth/facebook/callback', function (req,res) {
  res.send('callback from facebook')
})

router.get('/transactions', function (req, res) {
  res.render('transactions')
})

router.get('/users/:id/profile/edit', function (req, res) {
  res.send('authenticated user can only view this edit page')
})


module.exports = router
