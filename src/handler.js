const {genSalt, hash, compare}= require('bcrypt')
const JWT = require('jsonwebtoken')
const {nanoid} = require('nanoid');
const knex = require('./../knexfile');
const path = require('path');
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env'
const envPath = path.resolve(`${__dirname}/../${envFile}`); 
require('dotenv').config({ path: envPath});

const { JWT_SECRET_KEY, JWT_REFRESH_SECRET_KEY } = process.env

const getServer = (request, h) => {
        return 'Hello, server is working';
}

const addNoteHandler = async (request, h) => {
    const tableName = 'content'; //Inisialisasi nama table database
    const { title, tags, body } = request.payload;

    const contentId = nanoid(3);
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
    return getNote;
};

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
                    message: `Catatan tidak ditemukan`,
                })
                .code(404);
                return response;    
            }
        const response = h.response({
            status: 'success',
            message: `Catatan berhasil ditemukan`,
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
        .del("id_content")
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
                status: 'fail',
                message: 'Catatan tidak berhasil dihapus',
            });
            response.code(404);
            return response; 
        });  
    return deleteNote;
};
const createUsers = async (request, h) => {
    const tableName = 'users';
    const { username, password, role } = request.payload;
    //Inisialisasi jumlah prefiks/sufiks karakter yang akan ditambahkan ke password
    const salt = await genSalt(10);
    const hashPassword = await hash(password, salt)
    const getUser = await knex(tableName).insert(
        {
        username,
        password: hashPassword,
        role
        }
    )
    .into(tableName)
    .returning("*")
    .then((users) => {
        const findUsers = users.find(({username,}) => username === username);
        const token = JWT.sign({ id: findUsers.id, role }, JWT_SECRET_KEY);
        const response = h.response({
            status: 'success',
            message: 'User berhasil ditambahkan',
            data: {
                users,
                //Ada rekomendasi untuk tidak menampilkan token di data response ke user
                token, //just for development usage
            },
        })
        .code(201);
        return response;
        })
    .catch((err) => {
            const response = h.response ({
                status: 'fail',
                message: 'Username sudah ada',
            })
            .code(404);
            return response;
        });
        return getUser
}
const retrieveUser = async (request, h) => {
    const getUser = await knex("users").then((results) => {
      const response = h
        .response({
          status: "success",
          message: "Berhasil Mendapatkan Data",
          totalUsers: results.length,
          data: {
            results,
          },
        })
        .code(200);
      return response;
    });
    return getUser;
};
const loginUser = async (request, h) => {
    const { username, password } = request.payload;
    const tableName = 'users';
    const getUser = await knex(tableName)
    .where({username})
    .then( async (users) => {
        const findUsers = users.find(({username}) => username === username);
        const token = JWT.sign({ id: findUsers.id }, JWT_SECRET_KEY, { expiresIn: '30s',});
        const refreshToken = JWT.sign({ id: findUsers.id }, JWT_REFRESH_SECRET_KEY, { expiresIn: '2h'})
        const comparePassword = await compare(password, findUsers.password);
        if (!comparePassword) {
            const response = h.response({
                status: 'fail',
                message: 'Password tidak sesuai',
            })
            .code(400);
            return response;
        }
        const response = h.response ({
            status: 'success',
            message: 'User berhasil login',
            data: {
                findUsers, token, refreshToken
            },
        })
        .code(200)
        .header("Authorization", `Bearer ${token}`);
        return response;
    })
    .catch(() => {
        const response = h.response ({
            status: 'fail',
            message: `Username ${username} tidak ada`,
        })
        .code(404);
        return response
    });
    return getUser;
};

const deleteUserByID = async (request, h) => {
    const { userId } = request.params;
    const tableName = 'users';
    const deleteUser = await knex(tableName)
        .where({id_user: Number(userId)})
        .del()
        .then((results) => {
            const response = h.response({
                status: 'success',
                message: 'User berhasil dihapus',
            })
                response.code(200);
                return response;
        })
        .catch(() => {
            const response = h.response({
                status: 'fail',
                message: 'User tidak berhasil dihapus',
            });
            response.code(404);
            return response; 
        });  
    return deleteUser;
};

const getUserById = async (request, h) => {
    const { userId } = await request.params;
    const getNote = await knex('users')
    .where({ id_user: Number(userId) })
    .then((result) => {
        const findId = result.find(({id_user}) => id_user === Number(userId));
            if(!findId) {
                const response = h.response({
                    status: 'fail',
                    message: 'User tidak ditemukan',
                })
                .code(404);
                return response;    
            } 
            const response = h.response({
                status: 'success',
                message: 'User berhasil ditemukan',
                data: result,
            })
            .code(200);
            return response;
        });
    return getNote;
};
module.exports = {getServer, addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler, createUsers, retrieveUser, loginUser, deleteUserByID, getUserById};