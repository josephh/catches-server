/**
 * Save, retrieve, delete Catches module.
 *
 * @module catches/catches-logic
 */

module.exports = function catches (options) {
  var seneca = this;

  seneca.add('catches:create', function(msg, done) {
    var seneca = this;

    // fetch from backing store...eventually


    done(null, {msg: 'done'});

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
