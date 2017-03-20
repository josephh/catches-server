var tweets = {};
require('seneca')()
  // executed remotely
  .listen({type:'tcp', pin:'role:info'})
  .add( 'role:info,cmd:save', function sum( msg, respond ) {
    console.log('XXX');
    respond( null, { answer: 'cheap cheap' } )
  })

//
//   .add('role:math', function( msg, respond ) {
//     console.log('xxx');
// //     var entity = msg.entity;
// //     tweets[entity] = tweets[entity] || 0;
// //     tweets[entity]++;
//     // this.log.info('how many tweets? 10 ');
//
//     respond(null, 'from tweet catch');
//   })
