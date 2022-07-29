/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex
    .schema
    .createTable('content', function(contentTable) {

        // Primary Key
        contentTable.increments();

        // Data
        contentTable.string( 'content_id', 3 ).notNullable();
        contentTable.string( 'title', 50 ).notNullable().unique();
        contentTable.string( 'tags', 50 ).notNullable().unique();
        contentTable.string( 'body', 250 ).notNullable();

        contentTable.timestamp( 'created_at' ).defaultTo(knex.fn.now())
        
    })
    .createTable('users', function(usersTable) {
        usersTable.increments();
        usersTable.string('username', 10).notNullable().unique();
        usersTable.string('password', 8).notNullable();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
