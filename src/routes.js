const { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, getServer, deleteNoteByIdHandler } = require("./handler");

const routes = [
    {
        method: 'GET',
        path: '/',
        handler: getServer,
    }
   
    ,{
        method: 'POST',
        path: '/notes',
        handler: addNoteHandler,
        options: {
            cors: {
                origin: ['*'],
            },
        }, 
    },

    {
        method: 'GET',
        path: '/notes',
        handler: getAllNotesHandler,
    },

    {
        method: 'GET',
        path: '/notes/{id}',
        handler: getNoteByIdHandler,
    },

    {
        method: 'PUT',
        path: '/notes/{id}',
        handler: editNoteByIdHandler,
    },

    {
        method: 'DELETE',
        path: '/notes/{id}',
        handler: deleteNoteByIdHandler,
    }
];

module.exports = routes;