/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex
    .schema
    .createTable( 'content', function( contentTable ) {

        // Primary Key
        contentTable.increments();

        // Data
        contentTable.string( 'content_id', 3 ).notNullable();
        contentTable.string( 'title', 50 ).notNullable().unique();
        contentTable.string( 'tags', 50 ).notNullable().unique();
        contentTable.string( 'body', 250 ).notNullable();

        contentTable.timestamp( 'created_at' ).defaultTo(knex.fn.now());
        contentTable.timestamp( 'update_at' ).references('created_at');
        
    } )
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex
    .schema
        .dropSchemaIfExists('content');
};
