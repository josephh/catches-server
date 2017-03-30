/**
 * Save, retrieve, delete Filters module.
 *
 * @module filters/filters-logic
 */

module.exports = function filters (options) {
  var seneca = this;

  seneca.add('fetch:filters', function(msg, done) {
    var seneca = this;

    // fetch from backing store...eventually

    var tags = {
      fish: ['carp','bream','pike','chubb'],
      angler: ['jon','bob','gabor','arvind'],
      location: ['avon','thames','shepperton lock','lord\'s walk']
    };

    done(null, tags);

  });


  // seneca.add('follow:list', function(msg,done){
  //   this
  //     .make('follow')
  //     .load$(msg.user, function(err,follow){
  //       var list = (follow && follow[msg.kind]) || []
  //       done(err, list)
  //     })
  // })


};
