require('seneca')()
  .add('say:hello', function (msg, respond){
    respond(null, {text: "Hi!"})
  })
  .client({ type: 'tcp', pin: 'role:crud' })
  .act('role:crud,cmd:fetchTags,filterBy:angler', console.log)
  .act('say:hello',console.log);
