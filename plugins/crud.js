/**
 * Plugin to retrieve, persist, delete catches
 */
 module.exports = function crud (options) {

  // the actions to add to the seneca instance (this)
  this.add('role:crud, cmd:fetchById', fetchById); // these callbacks get handed (msg, respond)
  this.add('role:crud, cmd:save', save);
  this.add('role:info, cmd:save', info);

  function fetchById(msg, respond) {
    var what = msg.entity, id = msg.id;
    // this.make(what).load$(id, respond);
    this.make(what).load$( id, respond);
  }

  function save(msg, respond) {
    var fish = this.make(msg.entity)
      .data$(msg.data)
      .save$( function( err, fishEntry ) {
        if( err ) return respond( err );

        this.act('role:info, cmd:save', { entity: 'fish', data:fishEntry });
        respond(null, fishEntry);
      });
  }

  function info(msg, respond) {
    this.log.info('LOG INFO (crud) >>>', msg.cmd, msg.entity, msg.data);
    respond(null, { answer: 'crud crud' } );
  }

};
