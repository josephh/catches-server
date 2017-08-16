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
  Rif = require('rif'),
  Uuid = require('uuid'),
  fs = require('fs'),
  Path = require('path');

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
        {path: '/api/catches', method: ['POST', 'GET']},
        {path: '/api/catches/{id}'}
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
    server.seneca.act(
      'filters:fetchAll',
      // no sub message,
      function(err,out) {
        if(err) return reply.redirect('/error');
        reply(out);
      }
    );
  },
});

/**
 * GET All Catches route
 */
server.route({
  method: 'GET', path: '/api/catches',
  handler: function( req, reply ){
    server.seneca.act(
      'catches:fetchAll',
      { // sub-message
        params: req.query
      },
      function(err,out) {
        if(err) return reply.redirect('/error');
        reply(out);
      }
    );
  }
});

/**
 * GET Catches by id route
 */
server.route({
  method: 'GET', path: '/api/catches/{id}',
  handler: function( req, reply ){
    server.seneca.act(
      'catches:fetch',
      { // sub-message
        params: req.params
      },
      function(err,out) {
        if(err) return reply.redirect('/error');
        reply(out);
      }
    );
  }
});

server.route({
  method: 'POST', path: '/api/catches',
  config: {
    payload: {
      output: 'stream',
      parse: true,
      allow: 'multipart/form-data'
    }
  },
  handler: function( request, reply ) {
    const payload = request.payload,
      jsonData = JSON.parse(payload.data),
      image = payload.image;
    var newName, name;
    if (image) {
      name = image.hapi.filename;
      newName = `${Uuid.v1()}${Path.extname(name)}`;
      var uploadPath =  `/Users/joe/fyb_uploads/${newName}`,
        fileStream = fs.createWriteStream(uploadPath);
      fileStream.on('error', function (err) {
        console.error(err);
      });
      image.pipe(fileStream);
      image.on('end', function (err) {
        var ret = {
          filename: image.hapi.filename,
          headers: image.hapi.headers
        };
        console.log(`Wrote file to disk (incoming name ${ret.filename}, temp storage name ${newName})`);
      });
    } else {
      /**
       * TODO - missing image file! - explicit error raising...
       */
    }
    jsonData.newCatch.tmpImage = newName || '';
    server.seneca.act(
      'catches:create',
      { // sub-message
        data: jsonData.newCatch
      },
      function(err, out) {
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
