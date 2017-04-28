/**
 * Save, retrieve, delete Filters module.
 *
 * @module filters/filters-logic
 */

module.exports = function filters (options) {
  var seneca = this;

  seneca.use('../store/store');

  seneca.add('filters:fetchAll', function(msg, done) {
    var seneca = this;

    this.act('store:list,kind:tags', function(err, jsonResponse) {
      if(err) return done(err);

      done(null, jsonResponse); // no error? return the response to the client
    });

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
