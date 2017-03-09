var SenecaWeb = require('seneca-web');
var Express = require('express');
var Router = Express.Router;
var context = new Router();

console.log("express!!!");

var senecaWebConfig = {
  context: context, // the express context
  adapter: require('seneca-web-adapter-express'),
  options: { parseBody: false } // to use body parser
}

var app = Express ()
  .use( require('body-parser').json() )
  .use( context )
  .listen(3000);

var seneca = require('seneca')()
  .use(SenecaWeb, senecaWebConfig) // SenecaWeb will attach any of the routes
                                   // defined through
                                   // seneca.act('role:web', {routes: routes}) to context.
  .use('./plugins/api')
  .client({ type: 'tcp', pin: 'role:crud' })
