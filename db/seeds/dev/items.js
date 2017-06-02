exports.seed = function (knex, Promise) {
  return knex('items').del()
  .then(() => {
    return Promise.all([
      knex('items').insert({
        name: 'Unicorn',
        whyItStays: 'Magical Powers',
        cleanliness: 'sparkling'
      }),
      knex('items').insert({
        name: 'Basketball',
        whyItStays: 'To play some b-ball',
        cleanliness: 'dusty'
      }),
      knex('items').insert({
        name: 'luggage',
        whyItStays: 'Need new luggage but this will do for now',
        cleanliness: 'rancid'
      }),
      knex('items').insert({
        name: 'hoola-hoop',
        whyItStays: 'Future pro hoola-hoop master',
        cleanliness: 'dusty'
      }),
      knex('items').insert({
        name: 'books',
        whyItStays: 'Future house library',
        cleanliness: 'dusty'
      }),
    ]);
  });
};
