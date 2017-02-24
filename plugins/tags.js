/*
* A seneca 'plugin' is a set of action patterns (same as a seneca instance).
*
* Plugins get names to help with logging and take a single parameter when declared - a set of options to help influence behaviour.
*
* The plugin is a function that takes a single parameter 'option' and is registered with seneca via seneca.use(pluginFunction, options)
*
* Plugins define the behaviour of microservice.  Other services make use of it.
*/
module.exports = function tags(options) {

 /*
  * 'this' is the function object to be returned by this module
  */
 /*
  * seneca.add takes 2 parameters:
  * 1. 'pattern' - the property pattern to match in any json message sent to seneca
  * 2. 'action' - the callback to execute on a match
  *   2.1 the 'action' callback function takes 2 parameters:
  *     1. 'msg' - the matching inbound message as a pojo
  *     2. 'response' - (another) callback to provide a response to the message (with standard callback(err, data) signature)
  */
  this.add('role:retrieve, cmd:tags', function(msg, respond) {
    const tags = {
      fish: ['carp','bream','pike','chubb'],
      angler: ['jon','bob','gabor','arvind'],
      location: ['avon','thames','shepperton lock','lord\'s walk']
    };
    respond(null, tags[msg.filterBy])
  });

  // seneca.wrap is a method to override all matching patterns - like mixing-in some additional functionality...

}
