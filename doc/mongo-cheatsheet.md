db
## what collections (in mongo collections can have arbitrary data object structures) in db?
show dbs
## switch collection?
use ...
## read records?
**individual fields**
```javascript
> db.json_catches.find({}, {_id: 1, createdDate: 1}).limit(2);
{ "_id" : ObjectId("59a9cc48f30a3234d5b7adf5") }
{ "_id" : ObjectId("59a9cc49f30a3234d5b7adf6") }
```
## random sample
```javascript
db.json_catches.aggregate(
   [ { $sample: { size: 3 } } ]
)
```
## read with cursor
...has degrading performance with large datasets, since the cursor must step over all documents.
## read/ pagination using a range
use an indexed field instead and use the last index for the first or last position when paging backwards and forwards.
```javascript
//Page 1
db.json_catches.find().limit(10);
//Find the id of the last document in this page
last_id = ...

//Page 2
users = db.users.find({'_id'> last_id}). limit(10);
//Update the last id with the id of the last document in this page
last_id = ...
```
**backwards**? `next_id = Math.min(...users.map(user => {return user._id}))`)
## distinct? (Aggregation framework)
The following example is specifically for the scenario where we wish to execute a DISTINCT query on an array of objects, getting unique values from one field while filtering on another.
```javascript
db.json_catches.aggregate(
    {$unwind : "$tags"},
    {$match : {
                "tags.type" : "angler"
    }},
    {$group: {
        _id : "$tags.value"
    }},
    {$group: {
        _id : "count",
        total : {"$sum" : 1},
        distinctValues : {$addToSet : "$_id"}
    }}
);
```
## write records?
```javascript
db.json_catches.insert({...}) // _id field is auto-generated if it's not included in input data
```
```javascript
db.json_catches.insert({...}) // _id field is auto-generated if it's not included in input data
```
## query?
```javascript
db.test.find() // query for all records (queries in mongo have the scope of a single collection)
```
```javascript
db.test.find(<field1>: <value1>, <field2>: <value2>...) // quotes are optional around top level fields, dot notation used for nested fields (dot notation requires quotes)
```
```javascript
db.test.find( { <field1>: <operator1: n> } ) // query with operators uses nested objects in the find parameters
```
```javascript
db.restaurants.find( { "grades.score": { $gt: 30 } } )
```
```javascript
db.restaurants.find( { "cuisine": "Italian", "address.zipcode": "10075" } ) // logical AND uses comma
```
```javascript
db.restaurants.find().sort( { "borough": 1, "address.zipcode": 1 } ) // append sort()
```
```javascript
db.restaurants.find().sort( { "borough": 1, "address.zipcode": 1 } ).pretty() // append pretty() for output formatting with spaces
```
## update?
update() can take 3 parameters // **you cannot update _id**
1. filter doc
1. update doc specifying the modification
1. options
 * mongo updates one document at a time, use the **multi** option for batch updates
 * special update operators are used by mongo prefixed with **$**
 * note the {multi: true} property must be specified in the 3rd parameter or otherwise only a single document will be updated.

For example,
```javascript
db.restaurants.update(
  { "address.zipcode": "10016", cuisine: "Other" }, // filter
  {
    $set: { cuisine: "Category To Be Determined" }, // update operator 1
    $currentDate: { "lastModified": true } // update operator 2
  },
  { multi: true, upsert: true} // options (multi = batch. upsert adds a row if it can't find an existing one to update)
)
```

## delete Collection documents?
```javascript
db.restaurants.remove( { "borough": "Queens" }, { justOne: true } )
```
```javascript
db.restaurants.remove( { } ) // an empty doc removes all documents (but not the Collection or any indexes)
```
## delete an entire Collection?
```javascript
db.restaurants.drop() // drop a collection plus indexes
```
## delete a database?
```javascript
use test
db.dropDatabase() // drop a database
```
## Profiling and logging
Change profiling (e.g. of slow queries) with start commands like the following - which will log all queries (slow or not)
> `mongod --profile=1 --slowms=1`

Turn on logging in the mongo cli with commands like,
>`db.setLogLevel(1)`

1. sort as well as limit

1. how to add indexes?
