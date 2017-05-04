/**
 * 'Front controller' module.
 * @module front/front
 */
 var HOST = process.env.HOST || process.argv[2] || '127.0.0.1',
  BASES = (process.env.BASES || process.argv[3] || '').split(','),
  SILENT = process.env.SILENT || process.argv[4] || 'true';

var Hapi = require('hapi'),  // we server that proxies
  Rif = require('rif'),
  rif = Rif(),
  server = new Hapi.Server(),
  host = rif(HOST) || HOST;

server.connection({
  port: 8000 // test with http://localhost:8000/api/ping
});

server.register(require('inert'));  // Static file and directory handlers plugin for hapi.js.
/**
 * README
 * inert provides new handler methods for serving static files and directories,
 * as well as decorating the reply interface with a file method for serving file based resources.
 */

server.register({
  register: require('wo', console.log),
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
    wo: {} // wo proxies the hapi server requests from here to wherever...
  }
});

server.route({
  method: 'GET', path: '/api/filters',
  handler: {
    wo: {
      passThrough: true
    }
  }
});

server.route({
  method: 'GET', path: '/api/catches',
  handler: {
    wo: {
      passThrough: true
    }
  }
});

server.route({
  method: 'GET', path: '/api/catches/{id}',
  handler: {
    wo: {
      passThrough: true
    }
  }
});

server.route({
  method: 'POST', path: '/api/catches',
  handler: {
    wo: {
      passThrough: true // pass through sends on default config for HAPI (i think! - without it response headers like content-type are note set) 
    }
  }
});

server.start(function(){
  console.log('front', server.info.uri)
});
