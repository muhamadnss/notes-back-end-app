const { addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, getServer, deleteNoteByIdHandler, retrieveUser, createUsers, loginUser, getUserById, deleteUserByID } = require("./handler");
const Joi = require('joi');
const routes = [
    {
        method: 'GET',
        path: '/',
        handler: getServer,
        options: {
            cors: true,
            // auth: false,
        }
    },
   
    {
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
        path: '/notes/{contentId}',
        handler: getNoteByIdHandler,
    },

    {
        method: 'PUT',
        path: '/notes/{contentId}',
        handler: editNoteByIdHandler,
    },

    {
        method: 'DELETE',
        path: '/notes/{contentId}',
        handler: deleteNoteByIdHandler,
    },

    {
        method: 'GET',
        path: '/notes/users',
        handler: retrieveUser,
        options: {
            cors: true,
            auth: false
        }
    },

    {
        method: "GET",
        path: '/notes/users/{userId}',
        handler: getUserById,
        options: {
            cors: true,
            auth: false
        }
    },

    {
        method: 'POST',
        path: '/notes/users/register',
        handler: createUsers,
        options: {
            cors: true,
            auth: false,
            validate: {
                payload: Joi.object({
                    username: Joi.string().required().min(8).max(20),
                    password: Joi.string().required().min(8).max(12),
                    role: Joi.string().required().min(4).max(5)
                })
            }
        }
    },

    {
        method: 'POST',
        path: '/notes/users/login',
        handler: loginUser,
        options: {
            cors: true,
            auth: false,
            state: {
                parse: true,
                failAction: 'error',
            },
            validate: {
                payload: Joi.object({
                    username: Joi.string().required().min(8).max(20),
                    password: Joi.string().required().min(8).max(12),
                }),
            },
        },
    },

    {
        method: 'DELETE',
        path: '/notes/users/{userId}',
        handler: deleteUserByID,
        options: {
            auth: false,
            cors: true,
        }
    },
];

module.exports = routes;