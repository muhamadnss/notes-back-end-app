const {nanoid} = require('nanoid');
const notes = require('./notes');

const getServer = (request, h) => {
        return 'Hello, server is working';
}
const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload;

    const contentId = nanoid(3);
    const createdAt = new Date().toISOString;
    const updatedAt = createdAt;
    
    const newNote = { 
        contentId, title, tags, body, createdAt, updatedAt,
    };
    
    notes.push(newNote);
    const isSuccess = notes.filter((note) => note.contentId === contentId).length > 0;

    if(isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'catatan berhasil ditambahkan',
            data: {
                noteId: contentId,
            },
        });
        response.code(201);
        return response; 
    }
    
    const response = h.response({
        status: 'fail',
        message: 'catatan gagal ditambahkan',
     });
    response.code(500);
    return response; 
};

const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    },
});

const getNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const note = notes.filter((n) => n.contentId === contentId)[0];

    if(note !== undefined) {
        return {
            status: 'success',
            data: {
                note,
            },
        };
    }
    
    const response = h.response({
        status: 'fail',
        message: 'catatan tidak ditemukan',
     });
    response.code(404);
    return response;
};

const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const { title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString;

    const index = notes.findIndex((note) => note.contentId === contentId);

    if (index !== -1) {
        notes[index] = {
        ...notes[index],
        title,
        tags,
        body,
        updatedAt,
    };

        const response = h.response ({
            status: 'success',
            message: 'catatan berhasil di-edit'
        });
        response.code(201);
        return response;
    }

    const response = h.response ({
        status: 'fail',
        message: 'catatan tidak berhasil diperbaharui. ID tidak ditemukan'
    });
    response.code(404);
    return response;
};

const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params;
    const index = notes.findIndex((note) => note.contentId === contentId);

    if (index !== -1) {
        notes.splice(index, 1);
        const response = h.response({
          status: 'success',
          message: 'Catatan berhasil dihapus',
        });
        response.code(200);
        return response;
      }
    const response = h.response ({
        status: 'fail',
        message: 'catatan tidak berhasil dihapus',
    });
    response.code(404);
    return response;
};
module.exports = {getServer, addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler};