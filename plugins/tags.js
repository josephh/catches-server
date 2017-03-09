var fs = require('fs');
 /*
  * A seneca 'plugin' is a set of action patterns (same as a seneca instance).
  *
  * Plugins get names to help with logging and take a single parameter when
  * declared - a set of options to help influence behaviour.
  *
  * The plugin is a function that takes a single parameter 'option' and is
  * registered with seneca via seneca.use(pluginFunction, options).
  *
  * Plugins define the behaviour of microservice.  Other services make use of it.
  * Plugin definition is synchronous be design.
  */
module.exports = function tags(options) {

 /*
  * The `this` context variable of the plugin definition is an instance of
  * seneca, that can't be used to declare action patterns.
  */

  // plugin patterns here altogether for readability
  this.add('role:crud, cmd:fetchTags', fetchTags);
  this.add('init:tags', init); /* special case 'add' for init.
                                * The init function must call its respond
                                * callback without errors.
                                * If init(...) fails, Seneca will exit.
                                */

 /* DON'T do plugin initialisation in the main body of the plugin definition.
  * Do it here, to ensure that anything that must happen so that action
  * functions can execute successfully.
  */
  function init(msg, respond) {
    // log to a custom file
    fs.open(options.logfile, 'a', function (err, fd) {

      // cannot open for writing, so fail
      // this error is fatal to Seneca
      if (err) return respond(err)

      log = make_log(fd)
      respond()
    })
  }

 /* COMMENTED CODE BELOW LEFT TO SUPPORT EXPLANATION OF SENECA.ADD - refactored.
  * seneca.add takes 2 parameters:
  * 1. 'pattern' - the property pattern to match in any json message sent to
  * seneca
  * 2. 'action' - the callback to execute on a match (see the matching rules
  * which help specificity)
  *   2.1 the 'action' callback function takes 2 parameters:
  *     1. 'msg' - the matching inbound message as a pojo
  *     2. 'response' - (another) callback to provide a response to the message
  * (with standard callback(err, data) signature).

        this.add('role:crud, cmd:fetchTags', function(msg, respond) {
        const tags = {
        fish: ['carp','bream','pike','chubb'],
        angler: ['jon','bob','gabor','arvind'],
        location: ['avon','thames','shepperton lock','lord\'s walk']
      };
      respond(null, tags[msg.filterBy])
      });

  */
  function fetchTags(msg, respond) {
    const tags = {
      fish: ['carp','bream','pike','chubb'],
      angler: ['jon','bob','gabor','arvind'],
      location: ['avon','thames','shepperton lock','lord\'s walk']
    };
    log(`logged tags = ${tags[msg.filterBy]}`);
    debugger
    if(msg.filterBy) respond(null, tags[msg.filterBy]);
    else respond(null, tags);
  };

  function make_log(fd) {
    return function (entry) {
      fs.write(fd, new Date().toISOString()+' '+ entry, null, 'utf8', function (err) {
        if (err) return console.log(err)

        // ensure log entry is flushed
        fs.fsync(fd, function (err) {
          if (err) return console.log(err)
          })
        })
    }
  }

}
