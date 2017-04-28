module.exports = function entry_store (options) {
  var seneca = this;
  seneca.use('mongo-store',
    {
      uri: 'mongodb://127.0.0.1/fyb',
      options: {},
      map:{'-/json/-':'*'}
    }
  )
  .use('entity');

  /**
  TODO add an aws s3 store here too... see use of entity zone /base /name
  convention for auto mapping to different types of store when creating entities
  http://senecajs.org/docs/tutorials/understanding-data-entities.html

    seneca.use('aws-store',{
      options:'???', map:{'-/images/-':'*'}
    });

    seneca
      .make$('images','bar',{propA:'val3',propB:'val4'})
      .save$(function(err,image_bar){
        console.log(''+ image_bar)
      })

  **/

  seneca.add('store:save,kind:catches', function(msg, done) {
    this
      .make('json','catches', {
        when: msg.when,
        user: msg.user,
        text: msg.text
      })
      .save$(function(err, entry) {
        if(err) return done(err)

        this.act(
          {
            timeline: 'insert',
            users: [msg.user],
          },
          entry,
          function(err) {
            return done(err, entry)
          })
      })
  })

  seneca.add('store:list, kind:catches', function(msg, done) {
    this.make('json','catches') // here the base is used (json) to tie in with entity-to-datastore (mongodb) mapping
      .list$(function(err, list) {
        if(err) return done(err)

        var jsonResponse = { data: [list]};

        done(null, jsonResponse);
      })
  });

  seneca.add('store:get,kind:catches', function(msg, done) {
    this.make('json','catches')
      .load$({id: msg.id}, function(err, got) {
        if(err) return done(err); // exit and give error details to callback...

        var jsonResponse = { data: {got}}; // ...otherwise carry on
        done(null, jsonResponse);
      })
  });

  seneca.add('store:list,kind:tags', function(msg, done) {

    var aggregateLocationQuery = buildDistinctAggregateTagQuery('location'),
      aggregateAnglerQuery =  buildDistinctAggregateTagQuery('angler'),
      mergedLists = {};


    this.make('json', 'catches')
      .native$(function (err, db) {
        var anglers, collection = db.collection('json_catches'); // with the entity library we 'make()  catches but actually the mongo collection is named json_catches
        collection.aggregate(aggregateLocationQuery, function (err, list) {
          if (err) return done(err);
          locations = list[0].distinctValues;
          console.log("Found distinct locations:", locations);
          mergedLists.locations = locations;

          collection.aggregate(aggregateAnglerQuery, function (err, list) {
            if (err) return done(err);
            anglers = list[0].distinctValues;
            console.log("Found distinct anglers:", anglers);
            mergedLists.anglers = anglers;

/** TODO not sure this is the nicest way to tie up callbacks once all have completed
perhaps use futures or find a different way to code up logic?? **/
            done(null, {data: mergedLists});

          });

        });
      });

  });

  function buildDistinctAggregateTagQuery(value) {

    let arrayName =  "$tags",
      queryField = "tags.type",
      queryValue = value,
      groupBy = "$tags.value";

    return [
      {$unwind : arrayName},
      {$match : {[queryField] : queryValue}}, // this odd property key syntax ('[]') is necessary because of ecmascript rules on using variables in object literals
      {$group: {
          _id : groupBy
      }},
      {$group: {
          _id : "count",
          total : {"$sum" : 1},
          distinctValues : {$addToSet : "$_id"}
      }}
    ];
  };

}
