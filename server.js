var path = require('path')
var express = require('express')
var bodyParser = require('body-parser')
var hbs = require('express-handlebars')
var session = require('express-session')
var passport = require('./passport')
var db = require('./db')
var flash = require('connect-flash');
var index = require('./routes/index')
require('dotenv').config()


// Routes



module.exports = (connection) => {
  var app = express()

  // Middleware

  app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'main'}))
  app.set('view engine', 'hbs')
  app.set('views', path.join(__dirname, 'views'))
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json({ extended: true }))
  app.use(express.static('public'))
  app.use(flash());


  app.set('connection', connection)
  //setup passport
  passport(app)

  app.use('/', index)
  return app
}
