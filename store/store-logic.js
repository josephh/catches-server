var AWS = require('aws-sdk');
var fs = require('fs');
var s3;

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

  /**
   * Pending figuring out how to get s3 store written and working (!), do aws s3 stuff in this plugin
   */
   seneca.add( {init:'store'}, function( args, done ) {
     require('dotenv').config();
     var s3Config = new AWS.Config({
       accessKeyId: process.env.aws_access_key_id,
       secretAccessKey: process.env.aws_secret_access_key,
       region: 'eu-west-1'
       // TODO further s3 config?
     });
     AWS.config.s3 = {params: {Bucket: process.env.bucket_name}};
     s3 = new AWS.S3(s3Config); // the s3 service object
     done();
   });

  seneca.add('store:save,kind:catches', function(msg, done) {
    var newCatch = this.make('json','catches', {
        species: msg.species || "unknown",
        date: msg.date,
        user_id: msg.userId ,
        coordinates: msg.coordinates,
        image: msg.image,
        tags: msg.tags
      });
    /* if the request includes an image file:
     * 1. load it to s3
     * 2. fetch a signed url for that image
     * 3. store the image signed url as the value for the catch image
     * 4. save the mongo record
     */
    if(msg.tmpImage) {
      fs.readFile(`/Users/joe/fyb_uploads/${msg.tmpImage}`, function (err, data) {
        if(err) throw err; // TODO eraro libray error handling etc

        // node js api docs safe to be careful with Buffer - be sure to properly validate arguments to its constructors
        var base64Data = Buffer.from(data, 'base64'),
        key = `uploads/${msg.tmpImage}`,
          params = {
            Key: key,
            Body: base64Data,
            ACL: "public-read"
          };
        s3.putObject(params, function (err, resp) {
          if (err) throw err; // TODO add specific error message for this error callbacks e.g. "S3 putObject failed, exiting action handler"
          var url = 'https://s3-eu-west-1.amazonaws.com/jobbings.fyb/' +  key;
          console.log("url for new image? " + url);
          newCatch.image = url;
          newCatch.save$(function(err, entry) {
            if(err) return done(err);
            newCatch.id = entry.id;
            done(null, {data: {newCatch}});
          });
        });
      });
    }
  });

  seneca.add('store:list,kind:catches', function(msg, done) {
    this.make('json','catches') // here the base is used (json) to tie in with entity-to-datastore (mongodb) mapping
      .list$(function(err, list) {
        if(err) return done(err);

        var jsonResponse = { data: list};

        done(null, jsonResponse);
      });
  });

  seneca.add('store:get,kind:catches', function(msg, done) {
    this.make('json','catches')
      .load$({id: msg.id}, function(err, got) {
        if(err) return done(err); // exit and give error details to callback...

// ...otherwise carry on
        var jsonResponse = {data: {
            catchId: got.catch_id,
            species: got.species,
            date: got.date,
            userId: got.user_id,
            coordinates: got.coordinates || "not set",
            image: got.image,
            tags: got.tags,
            id: got.id
          }
        };
        done(null, jsonResponse);
      });
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
  }

  return 'store';

};
