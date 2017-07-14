/**
 * Retrieve Filters module.
 *
 * @module filters/filters-logic
 */

module.exports = function filters (options) {
  var seneca = this;

  seneca.add('filters:fetchAll', function(msg, done) {
    var seneca = this;

    this.act('store:list,kind:tags', function(err, jsonResponse) {
      if(err) return done(err);

      done(null, jsonResponse); // no error? return the response to the client
    });

  });

};
