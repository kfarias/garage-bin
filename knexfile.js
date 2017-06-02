module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/items',
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true,
  },
  test: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost/testitems',
    migrations: {
      directory: '/db/migrations'
    },
    seeds: {
      directory: '/db/seeds/test'
    },
    useNullAsDefault: true,
  },
};
