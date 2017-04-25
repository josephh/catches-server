/*jshint esversion: 6 */
/**
 * Save, retrieve, delete Catches module.
 *
 * @module catches/catches-logic
 */

module.exports = function catches (options) {
  var seneca = this;

  seneca.use('../store/store');

  seneca.add('catches:create', function(msg, done) {
    var seneca = this;

    console.log(`Catches create action handler for new catch with id ${msg.id}`);
    console.log('Message payload properties: ');
    for (var prop in msg.data) {
      console.log('next prop : ' + prop + ', val : ' + msg.data[prop]);
    }

    // store in backing store...eventually

    done(null, {msg: 'done'});

  });

  seneca.add('catches:fetch', function(msg, done) {
    console.log('Inside the get catch by id handler...');
    console.log(`fetch catch with id ${msg.params.id}`);

    this.act('store:get,kind:catches', {id: msg.params.id}, function(err, jsonResponse) {
      if(err) return done(err);

      done(null, jsonResponse); // no error? return the response to the client
    });


  });

  seneca.add('catches:fetchAll', function(msg, done) {
    var seneca = this;

    const fishFilter = msg.params.fishFilter,
     anglerFilter = msg.params.anglerFilter,
     locationFilter = msg.params.locationFilter,
     from = msg.params.startFrom,
     count = msg.params.howMany;

    console.log(`Inside the get all catches handler...`);
    console.log('Request parameters?');
    console.log('Fish Filter? ' +  fishFilter || "none");
    console.log('Angler Filter? ' + anglerFilter || "none");
    console.log('Location Filter? ' + locationFilter || "none");
    console.log('Start from? ' + from || "none");
    console.log('howMany? ' + count || "none");

    this.act('store:list,kind:catches', {id: msg.params.id}, function(err, jsonResponse) {
      if(err) return done(err);

      done(null, jsonResponse); // no error? return the response to the client
    });

  });


};
