var tags = require('./plugins/tags'); /* for really terse code, this could be
                                       * required by seneca in its use() method.
                                       */

// require('seneca')()
//   /* seneca.use method takes a plugin name parameter and an optional options
//    * parameter to be passed into the plugin
//    */
//   .use(tags, {logfile: './tags.log'})
//   /* seneca.act sends a message to act on. It has 2 parameters
//    * 1. the message object
//    * 2. response_callback: function that receives the response message
//    * (if any comes back from the act action)
//    */
//   .act('role:crud,cmd:fetchTags,filterBy:angler', console.log) // 'role:retrieve' is just a namespacing convention

  require('seneca')()
    .use(tags, { logfile: './tags.log' })
    .listen({ type: 'tcp', pin: 'role:crud' }); /* the additional pin is recommended - encourage all
                           * action handlers to only deal with known patterns.
                           */
