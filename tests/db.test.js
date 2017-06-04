// Note: we use AVA here because it makes setting up the
// conditions for each test relatively simple. The same
// can be done with Tape using a bit more code.

var test = require('ava')

var configureDatabase = require('./helpers/database-config')
configureDatabase(test)

var db = require('../db')


test('Find By Id - given 2 returns baboon', function (t) {
  var expected = 'Bamboozled Baboon'
  return db.findById(2, t.context.connection)
    .then(function (result) {
      var actual = result.name
      t.is(expected, actual)
    })
})

test('Find a user by email', function (t) {
  var expected = 'Dilapidated Duck'
  return db.findByEmail('duck@example.org',t.context.connection)
    .then(function (result){
      var actual = result.name
      t.is(expected, actual)
    })
})


test('Find user by facebook id', function (t){
  var expected = 'Curious Capybara'
  return db.findByFaceBookID('capybara',t.context.connection)
    .then(function (result){
      var actual = result.name

    })
})

test('Add user without email check', function (t) {
  var expected = 'James'
  let data = { name: 'James', email: 'james@email.com'}
  return db.addUser(data, t.context.connection)
    .then(function (result) {
        const id = result[0]
        return db.findById(id, t.context.connection)
          .then(function (result) {
              var actual = result.name
              t.is(expected, actual)
          })
    })
})

test('Add user with existing email', function (t) {
  var expected = 'err'
  let data = { name: 'John', email: 'duck@example.org'}
  return db.createUser(data, t.context.connection)
    .then(function (result) {
              var actual = result
              t.is(expected, actual)
          })
  })
