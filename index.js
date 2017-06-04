var createServer = require('./server')

var environment = process.env.NODE_ENV || 'development'
var config = require('./knexfile')[environment]
var connection = require('knex')(config)

var server = createServer(connection)

var PORT = process.env.PORT || 3000

if (require.main === module) {
  server.listen(port, function () {
    console.log(`server listening on ${port}`)
  })
}
