var assert = require('assert'),
  crud = require('../../plugins/crud');


var seneca = require('seneca')()
  .use('entity')
  .use(crud)
  // uncomment to send messages to any listening service
  .client( { type:'tcp', pin:'role:info' } )
  // .act('role:math,cmd:sum,left:1,right:2',console.log)
  .error( assert.fail )
  .act('role:info, cmd:save', console.log);

function test_add_and_retrieve() {
  seneca.act(
    `role:crud,cmd:save,
    entity:fish,
    data:{
      id: 824234,
      species: carp,
      date: 2016-04-26T08:46:27Z,
      user: 8743jkh34,
      location: ash87123ss,
      images: [
        https://s3-eu-west-1.amazonaws.com/jobbings.fyb/uploads/Main-1024x748.jpg,
        https://s3-eu-west-1.amazonaws.com/jobbings.fyb/uploads/home-made-baits-04.jpg
      ]}`, function( err, save_fish ) {
          if(err) process.exit(1);

          this.act(
            'role:crud,cmd:fetchById', {entity: 'fish', id:save_fish.id},
            function( err, load_fish ) {
              assert.equal( load_fish.species, save_fish.species );
            });
        });
}
