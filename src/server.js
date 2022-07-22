const Hapi = require('@hapi/hapi');
const routes = require('./routes');
// const auth = require('hapi-auth-jwt');
const init = async () => {
    const server = Hapi.server({
         port: 5000,
         host: 'localhost',
         routes: {
          cors: {
              origin: ['*'],
          },
      },
    });
    
    server.route(routes);
    await server.start();

    //===Authentication ngerjain nya pending dulu===

    // server.register( require( 'hapi-auth-jwt' ), ( _err ) => {
    //     server.auth.strategy( 'token', 'jwt', {
    
    //         key: 'ikSk9ksd0SSD3d0jdwDq20jdn8dmXdf1',
    //         verifyOptions: {
    //             algorithms: ['HS256'],
    //         }
    
    //     });
    
    // });
    // await server.register( 
    //     plugin: require("hapi-auth-jwt")
    // );

    // server.auth.strategy('token', 'jwt', {
    //     key: 'ikSk9ksd0SSD3d0jdwDq20jdn8dmXdf1',
    //     verifyOptions: {
    //         algorithm: 'HS256'
    //     }
    // })

    console.log('Server sudah dijalankan pada %s', server.info.uri);
};

init();
