/**
 * 'Front controller' module.
 * @module front/front
 */
var PORT = process.env.PORT || process.argv[2] || 0,
  HOST = process.env.HOST || process.argv[3] || '127.0.0.1',
  BASES = (process.env.BASES || process.argv[4] || '').split(','),
  SILENT = process.env.SILENT || process.argv[5] || 'true';

var Hapi = require('hapi'),
  Chairo = require('chairo'),
  Seneca = require('seneca'),
  Rif = require('rif');

var tag = 'api',
  server = new Hapi.Server(),
  rif = Rif(),
  host = rif(HOST) || HOST;

server.connection({
  // this is the magic - SWIM will inform front.js about this port
    port: PORT,
    host: host
});

server.register({
  register: Chairo, /** seneca microservices plugin for seneca
                      *
                      * The plugin integrates the Seneca functionality into hapi
                      * and provide tools to map its actions to server methods
                      * and views for easy access.
                      */
  options:{
    seneca: Seneca({
      tag: tag,
      internal: {logger: require('seneca-demo-logger')},
      debug: {short_logs:true}
    })
    //.use('zipkin-tracer', {sampling:1})
  }
});

server.register({  // wire up the web server and its routes
  register: require('wo'), // join SWIM network...
  //... advertising the routes defined here...
  options:{
    bases: BASES,
    route: [
        {path: '/api/ping'}, // default method is GET
        {path: '/api/filters'},
        // {path: '/api/catches'},
        {path: '/api/catches/{id}', method: ['post', 'get']},
        // {path: '/api/catches/{id}'}
    ],
    sneeze: {
      host: host,
      silent: JSON.parse(SILENT),
      swim: {interval: 1111}
    }
  }
});

server.route({  // seneca action handler here - not complicated enough for a plugin
  method: 'GET', path: '/api/ping',
  handler: function( req, reply ){
    server.seneca.act(
      'role:api,cmd:ping',
      function(err,out) {
        reply(err||out);
      }
    );
  }
});

/**
 * GET Filters route
 */
server.route({
  method: 'GET', path: '/api/filters',
  handler: function( req, reply ){
    console.log('api/filters handler');
    server.seneca.act(
      'filters:fetch',
      // no sub message,
      function(err,out) {
        if(err) return reply.redirect('/error');
        reply(out);
      }
    );
  }
});

server.route({
  method: 'POST', path: '/api/catches/{id}',
  handler: function( req, reply ) {
    console.log('/api/catches/id POST >>>> ');
    console.log('Request Params >>>> ', req.params);
    console.log('Request Payload >>>> ', req.payload);
    server.seneca.act(
      'catches:create',
      // { // sub-message with create object
      //   catches:req.payload.data
      // },
      function(err, out) {
        console.log('/api/catches POST', err, out);
        if(err) return reply.redirect('/error');
        reply(out);
      }
    );
  }
});

/**
 * Ping doesn't need its own plugin (handler defined here)
 */
server.seneca
  .add('role:api,cmd:ping', function(msg,done){
      done( null, {pong:true,api:true,time:Date.now()});
    })
  .use('mesh',{
    host: host,
    bases: BASES,
    sneeze: {
      silent: JSON.parse(SILENT),
      swim: {interval: 1111}
    }
  });

server.start(function(){
  console.log(tag, server.info.host, server.info.port);
});
