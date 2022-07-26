module.exports = require ('knex')({
client: 'pg',
connection: {

    host: 'localhost',
    port: 5432,
    database: 'notes',
    user:     'admin',
    password: 'root',
    charset: 'utf8',
  }
});