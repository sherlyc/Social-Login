exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.increments('id').primary()
    table.string('name')
    table.string('email').unique()
    table.string('facebookId')
    table.binary('password')
    table.string('facebookPic')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('users')
}
