// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  developments: {
    client: 'postgresql',
    connection: {
      host: 'localhost',
      database: 'content',
      user:     'admin',
      password: 'root',
      charset: 'utf8',
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

};
