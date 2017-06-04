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
      var actual = result[0].name
      t.is(expected, actual)
    })
})
