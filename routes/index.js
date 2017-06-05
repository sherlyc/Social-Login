var express = require('express')
var router = express.Router()

var db = require('../db')

router.get('/', function (req,res){
  res.render('index')
})

router.get('/login', function (req, res) {
  res.render('login')
})

router.post('/signup', function (req,res) {
  res.send('signup')
})

router.post('/login', function (req,res) {
  res.send('loggin in')
})

router.get('/logout', function (req,res) {
  res.send('logging out')
})

router.get('/auth/facebook', function (req,res) {
  res.send('social login')
})

router.get('/auth/facebook/callback', function (req,res) {
  res.send('callback from facebook')
})

router.get('/transactions', function (req, res) {
  res.send('authenticated user can only view this page')
})

router.get('/users/:id/profile/edit', function (req, res) {
  res.send('authenticated user can only view this edit page')
})

router.get('/resource', function (req, res) {
  res.send('for authenticated users only')
})
module.exports = router
