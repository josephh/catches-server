HOST="127.0.0.1"
BASES="127.0.0.1:39000,127.0.0.1:39001"
# OPTS="--seneca.options.debug.undead=true --seneca.options.plugin.mesh.sneeze.silent=1"


nodemon base/base.js base0 39000 $HOST $BASES $OPTS &
sleep 1
nodemon base/base.js base1 39001 $HOST $BASES $OPTS &
sleep 1
nodemon front/front.js $HOST $BASES $OPTS &
sleep 1
nodemon api/api-service.js 0 $HOST $BASES $OPTS &
sleep 1
nodemon filters/filters-service.js $HOST $BASES $OPTS &
sleep 1
nodemon catches/catches-service.js $HOST $BASES $OPTS &
sleep 1
nodemon store/store-service.js $HOST $BASES $OPTS &
sleep 1
