const { response } = require('@hapi/hapi/lib/validation');
const {nanoid} = require('nanoid');
const knex = require('./knex');
// const notes = require('./notes');
// const knex = require('./knex.js');
// const queries = require(./queries);

const getServer = (request, h) => {
        return 'Hello, server is working';
}

const addNoteHandler = async (request, h) => {
    const tableName = 'content'; //Inisialisasi nama table database
    const { title, tags, body } = request.payload;

    const contentId = nanoid(3);
    // const createdAt = new Date().toISOString;
    // const updatedAt = createdAt;
    const postNote = await knex(tableName).insert(
            {
                id_content: contentId, 
                title_content: title, 
                tag_content: tags, 
                body_content: body,
            }
        )
        .returning("*")
        .then((content) => {
            const response = h.response({
                status: 'success',
                message: 'catatan berhasil ditambahkan',
                data: {
                    content
                    // result : content
                },     
            })
                response.code(201);
                return response;
        })
        .catch(() => {
            const response = h.response({
                status: 'fail',
                message: 'catatan gagal ditambahkan',
            });
            response.code(500);
            return response; 
        });  
    // const newNote = { 
    //     contentId, title, tags, body, createdAt, updatedAt,
    // };
    
    // //ini adalah untuk masukin data lewat array
    // notes.push(newNote);
    //ini adalah untuk input data lewat API

        return postNote;
};

const getAllNotesHandler = async (request, h) => {
    const tableName = 'content';
    const getNote = await knex(tableName).then((results) => {
        const response = h.response({
            status: 'success',
            message: 'Selamat, data berhasil didapatkan',
            totalNotes: results.length,
            data: {
                results,
            },
        })
        response.code(200);
        return response;
    });
    // status: 'success',
    // data: {
    //     notes,
    // },
    return getNote;
};

// const getNoteByIdHandler = async (request, h) => {
//     const { contentId } = await request.params;
//     const tableName = 'content';
//     const getNote = await knex(tableName)
//         .where({ id_content: contentId })
//         .then((result) => {
//             const findNote = result.find(({ id_content }) => id_content === contentId);

//             if(!findNote) {
//                 const response = h.response({
//                     status: 'success',
//                     message: `Catatan dengan ID ${id_content} berhasil ditemukan`,
//                     data: result,
//                 })
//                 .code(200);
//                 return response;    
//             }
//         const response = h.response({
//             status: 'fail',
//             message: `Catatan dengan ${contentId} tidak ditemukan`
//         })
//         response.code(404);
//         return response;
//         });

// };

const getNoteByIdHandler = async (request, h) => {
    const { contentId } = await request.params;
    // const tableName = 'content';
    const getNote = await knex('content')
    .where({ id_content: contentId })
    .then((result) => {
        const findId = result.find(({id_content}) => id_content === contentId);
        
            if(!findId) {
                const response = h.response({
                    status: 'fail',
                    message: `Catatan dengan ID ${id_content} tidak ditemukan`,
                    data: result,
                })
                .code(404);
                return response;    
            }
        const response = h.response({
            status: 'success',
            message: `Catatan dengan ${contentId} berhasil ditemukan`,
            data: result,
        })
        .code(200);
        return response;
        });
    return getNote;
};


//edit note by ID belum termasuk fitur penanda waktu update_at
const editNoteByIdHandler = async (request, h) => {
    const { contentId } = request.params;
    const { title, tags, body, } = request.payload;
    const tableName = 'content';
    // const updateAt = new Date().toISOString;
    const getNote = await knex(tableName)
        .where({id_content: contentId})
        .update({ 
            title_content: title, 
            tag_content: tags, 
            body_content: body,
        })
        .returning('*')
        .then((results) => {
            const findNote = results.find(({id_content}) => id_content === contentId);

            if(!findNote) {
                const response = h.response({
                    status: 'fail',
                    message: `Catatan dengan ID ${id_content} tidak ditemukan`,
                    data: results,
                })
                .code(404);
                return response;    
            }
    const response = h.response({
        status: 'success',
        message: `Catatan dengan ${contentId} berhasil diperbarui`,
        data: results,
    })
        .code(200);
        return response;
    });
    return getNote;
};

const deleteNoteByIdHandler = async (request, h) => {
    const { contentId } = request.params;
    const tableName = 'content';
    const deleteNote = await knex(tableName)
        .where({id_content: contentId})
        .del("id_content") //fungsi delete masih ada bugs/tidak berfungsi
        .then((results) => {
            const response = h.response({
                status: 'success',
                message: `Catatan dengan ID ${contentId} berhasil dihapus`,
            })
                response.code(200);
                return response;
        })
        .catch(() => {
            const response = h.response({
                status: 'success',
                message: `Catatan dengan tidak berhasil dihapus`,
            });
            response.code(404);
            return response; 
        });  
    return deleteNote;
};
module.exports = {getServer, addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler};