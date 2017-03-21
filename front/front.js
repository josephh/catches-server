/**
 * 'Front controller' module.
 * @module front/front
 */
 var HOST = process.env.HOST || process.argv[2] || '127.0.0.1',
  BASES = (process.env.BASES || process.argv[3] || '').split(','),
  SILENT = process.env.SILENT || process.argv[4] || 'true';

var Hapi = require('hapi'),
  Rif = require('rif'),
  rif = Rif(),
  server = new Hapi.Server(),
  host = rif(HOST) || HOST;

server.connection({
  port: 8000 // test with http://localhost:8000/api/ping
});

server.register(require('inert'));

server.register({
  register: require('wo'),
  options: {
    bases: BASES,
    sneeze: {
      host: host,
      silent: JSON.parse(SILENT),
      swim: {interval: 1111}
    }
  }
});

server.route({
  method: 'GET', path: '/api/ping',
  handler: {
    wo: {}
  }
});
//
// server.route({
//   method: 'GET', path: '/api/filters',
//   handler: {
//     wo: {} // no config
//   }
// });
//
// server.route({
//   method: 'GET', path: '/api/catches',
//   handler: {
//     wo: {}
//   }
// });
//
// server.route({
//   method: ['GET', 'POST'], path: '/api/catches/{id}',
//   handler: {
//     wo: {
//       passThrough: true // prompt for user login
//     }
//   }
// });

server.start(function(){
  console.log('front',server.info.uri)
});
