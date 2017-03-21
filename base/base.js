/**
 * Base module.
 * Via a start script, 2 x base nodes are created, e.g.
 *  node base.js base0 39000 127.0.0.1 127.0.0.1:39000,127.0.0.1:39001
 *  node base.js base1 39001 127.0.0.1 127.0.0.1:39000,127.0.0.1:39001

 README
 Bases typically listen on a pre-defined port and serve as the means for
 other nodes to join the network.

 For nodes to join they network, with Mesh and Swim, all a new service needs
 to do is be pointed at an existing service.  However, using base nodes is a
 good approach to bootstrapping the microservice application since, then all
 new services need to do is find the base nodes.


 * @module base/base
 */
var TAG = process.env.TAG || process.argv[2] || 'base',
  PORT = process.env.PORT || process.argv[3] || 39999,
  HOST = process.env.HOST || process.argv[4] || '127.0.0.1',
  BASES = (process.env.BASES || process.argv[5] || '').split(','),
  SILENT = process.env.SILENT || process.argv[6] || 'true';

require('seneca')({
  tag: TAG,
  internal: {logger: require('seneca-demo-logger')},
  debug: {short_logs:true}
})
  .test(console.log, 'print') // verbose output
  //.use('zipkin-tracer', {sampling:1})
  .use('mesh',{
    // monitor: true,
    isbase: true,
    port: PORT,
    host: HOST,
    bases: BASES,
    pin:'role:mesh',
    sneeze: {
      silent: JSON.parse(SILENT),
      swim: {interval: 1111}
    }
  })
  .ready(function(){
    console.log(this.id);
  });
