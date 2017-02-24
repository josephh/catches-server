var tags = require('./plugins/tags');


require('seneca')()
  // seneca.use method takes a plugin name parameter and an optional options parameter to be passed into the plugin
  .use(tags)
  // seneca.act sends a message to act on. It has 2 parameters
  // 1. the message object
  // 2. response_callback: function that receives the response message (if any comes back from the act action)
  .act('role:retrieve,cmd:tags,filterBy:angler', console.log)
