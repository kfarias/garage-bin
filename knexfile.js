module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/items',
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    }
  },
  test: {
  client: 'pg',
  connection: process.env.DATABASE_URL || 'postgres://localhost/testitems',
  migrations: {
    directory: __dirname + '/db/migrations'
  },
  seeds: {
    directory: __dirname + '/db/seeds/test'
  },
    useNullAsDefault: true
  }
}
