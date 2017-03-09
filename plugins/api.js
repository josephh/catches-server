/**
 * Plugin serving only to hide our microservice actions from the
 * outside world.
 */
module.exports = function api( options ) {

  var valid_ops = {
    tags:'fetchTags'
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
        tags: { GET:true }
      }
    }}, respond )
  })

}
