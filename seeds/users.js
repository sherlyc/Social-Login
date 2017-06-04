exports.seed = function (knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({ name: 'Ambitious Aardvark', email: 'aardvark@example.org', facebookId: 'aardvark'}),
        knex('users').insert({ name: 'Bamboozled Baboon', email: 'baboon@example.org', facebookId: 'baboon'}),
        knex('users').insert({ name: 'Curious Capybara', email: 'capybara@example.org', facebookId: 'capybara'}),
        knex('users').insert({ name: 'Dilapidated Duck', email: 'duck@example.org', facebookId: 'duck'})
      ]);
    });
};
