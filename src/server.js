'use strict'

const Hapi = require('@hapi/hapi');
const path = require('path');
const routes = require('./routes');
const validate = require('./validate');
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env'
const envPath = path.resolve(`${__dirname}/../${envFile}`); 

require('dotenv').config({ path: envPath});

const { SERVER_HOST, SERVER_PORT, JWT_SECRET_KEY} = process.env
const internals = {};

internals.init = async () => {
    const server = Hapi.server({
        host: SERVER_HOST,
        port: SERVER_PORT,
         routes: {
          cors: {
              origin: ['*'],
          },
      },
    });

    await server.register(require('hapi-auth-jwt2'));
    server.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET_KEY, 
        validate,
        verifyOptions: {
            algorithms: ['HS256'],
        }
    });

    server.auth.default('jwt');
    server.route(routes);
    await server.start();
    console.log(`Server sudah dijalankan pada ${server.info.uri}`);
};

internals.init();
