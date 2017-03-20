/**
 * Plugin serving only to hide our microservice actions from the
 * outside world.
 */
module.exports = function api( options ) {

  var valid_ops = { // map for use in sanitizing input - not in use yet..
    // calculate: 'sum'
  };

  this.add( 'role:api,path:tags', function( msg, respond ) {
    var operation = msg.args.params.thing,
      filter = msg.args.query.filterBy;
    this.act( 'role:crud', {
      cmd:   'fetchTags',
      filterBy:  filter ? filter.toLowerCase(): ''
    }, respond )
  })


  this.add( 'init:api', function( msg, respond ) {
    this.act('role:web', { routes: {
      prefix: '/api',
      pin:    'role:api,path:*',
      map: {
        tags: { GET:true },
        catch: { GET: true, suffix: '/:id' },
        catches: { GET: true }
      }
    }}, respond )
  })

}
