/*jshint esversion: 6 */
/**
 * Save, retrieve, delete Catches module.
 *
 * @module catches/catches-logic
 */

module.exports = function catches (options) {
  var seneca = this;

  seneca.add('catches:create', function(msg, done) {
    var seneca = this;

    console.log(`Inside the create action handler... the msg payload has been
    delivered...`);
    for (var prop in msg.data) {
      console.log('next prop : ' + prop + ', val : ' + msg.data[prop]);
    }

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

  seneca.add('catches:fetch', function(msg, done) {
    var seneca = this;

    console.log(`Inside the get catches handler...`);
    // fetch from backing store...eventually

    var jsonResponse =
    {
      "data": [
        {
          "id": "824234",
          "species": "carp",
          "date": "2016-04-26T08:46:27Z",
          "user-id": "8743jkh34",
          "location-id": "ash87123ss",
          "images": [
            "https://s3-eu-west-1.amazonaws.com/jobbings.fyb/uploads/Main-1024x748.jpg",
            "https://s3-eu-west-1.amazonaws.com/jobbings.fyb/uploads/home-made-baits-04.jpg"
          ],
          "tags": [
            {
              "type": "location",
              "value": "jon_the_poacher"
            }
          ]
        },
        {
          "id": "824234",
          "species": "carp",
          "date": "2016-04-26T08:46:27Z",
          "user-id": "8743jkh34",
          "location-id": "ash87123ss",
          "images": [
            "https://s3-eu-west-1.amazonaws.com/jobbings.fyb/uploads/Main-1024x748.jpg",
            "https://s3-eu-west-1.amazonaws.com/jobbings.fyb/uploads/home-made-baits-04.jpg"
          ],
          "tags": [
            {
              "type": "location",
              "value": "jon_the_poacher"
            }
          ]
        },
        {
          "id": "824234",
          "species": "carp",
          "date": "2016-04-26T08:46:27Z",
          "user-id": "8743jkh34",
          "location-id": "ash87123ss",
          "images": [
            "https://s3-eu-west-1.amazonaws.com/jobbings.fyb/uploads/Main-1024x748.jpg",
            "https://s3-eu-west-1.amazonaws.com/jobbings.fyb/uploads/home-made-baits-04.jpg"
          ],
          "tags": [
            {
              "type": "location",
              "value": "jon_the_poacher"
            }
          ]
        }
      ]
    };

    done(null, jsonResponse);

  });


};
