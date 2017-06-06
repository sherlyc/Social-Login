var test = require('ava')
var request = require('supertest')
var cheerio = require('cheerio')

var createServer = require('../server')

var configureDatabase = require('./helpers/database-config')
configureDatabase(test, createServer)

test('GET /logout', (t) => {
  return request(t.context.app)
    .get('/logout')
    .expect(200)
    .then((res) => {
      const $ = cheerio.load(res.text)
      t.is($('h1').first().text(), 'Bye and be gone!')
    })

})

test('signup:Success', (t) => {

	return request(t.context.app)
		.post('/signup')
		.send({email: 'ava@rocks.com', password: '123123'})
        .expect(200)
        .then((res) => {
            t.is(res.status, 200);
        	t.is(res.body.email, 'ava@rocks.com');
        })

})
