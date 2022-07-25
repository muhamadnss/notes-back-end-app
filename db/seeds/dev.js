/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  // await knex('content').del()
  await knex('content').insert([
    {
      id: 4,
      content_id: 'lo5',
      title: 'Judul Keempat',
      tags: 'tag4',
      body: 'Halo Kota Solo, ini adalah catatan pertama saya'
    }
  ]);
};
