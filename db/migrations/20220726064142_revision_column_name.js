/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex, Promise) {
  return knex
  .schema
  .table('content', function(columnTable){
    columnTable.string( 'id_content', 3 ).notNullable();
    columnTable.string( 'title_content', 50 ).notNullable().unique();
    columnTable.string( 'tags_content', 50 ).notNullable().unique();
    columnTable.string( 'body_content', 250 ).notNullable();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex, Promise) {
  return knex
  .schema
  .table('content', function(deleteColumn){
    deleteColumn.dropColumn('content_id');
    deleteColumn.dropColumn('title');
    deleteColumn.dropColumn('tags');
    deleteColumn.dropColumn('body');
  })
};
