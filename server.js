var path = require('path')

var express = require('express')
var bodyParser = require('body-parser')
var hbs = require('express-handlebars')
var session = require('express-session')
var passport = require('./passport')
var db = require('./db')

var index = require('./routes/index')

var app = express()
var connection = app.get("connection")

// Middleware

app.engine('hbs', hbs({extname: 'hbs'}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))
app.use(bodyParser.urlencoded({ extended: true }))



// Routes



module.exports = (connection) => {
  app.set('connection', connection)
  //setup passport
  passport(app)

  app.use('/', index)
  return app
}
