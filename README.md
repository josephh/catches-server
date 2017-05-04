# Catches microservices
## Get dependencies
The server code is expecting the following to be available
* mongo (install mongod and mongo (if you require a client CLI)). See apiary for example test data.

The code runs in
* node js (https://nodejs.org/en/)

For _development_, server code can be run with
* nodemon.  

Nodemon watches a file directory for code changes, meaning changes to code while it is running will be automatically swapped in.   Install nodemon on the system with `npm install -g nodemon`.

## Build
* run `npm install` inside the code directory, to fetch dependencies.

## Run
Make the start.sh script executable and run it - it will launch nodemon (which wraps node) for each microservice.
