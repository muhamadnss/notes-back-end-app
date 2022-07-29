// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const { knexSnakeCaseMappers } = require('objection');
module.exports = require ('knex') ({
  client: 'pg',
  connection: {

    host: 'localhost',
    database: 'notes',
    user:     'admin',
    password: 'root',
    port: '5432',
    charset: 'utf8',                                                                      
  },
  developments: {
    migrations: {
      tableName: 'knex_migrations'
    },
      seeds: {
        tableName: './db/seeds'
    },
    ...knexSnakeCaseMappers,
  }
});
