HOST="127.0.0.1"
BASES="127.0.0.1:39000,127.0.0.1:39001"
OPTS=""

# for demos use
OPTS = '--seneca.options.debug.undead=true --seneca.options.plugin.mesh.sneeze.silent=1'


node base/base.js base0 39000 $HOST $BASES $OPTS &
sleep 1
node base/base.js base1 39001 $HOST $BASES $OPTS &
sleep 1
node front/front.js $HOST $BASES $OPTS &
sleep 1
node api/api-service.js 0 $HOST $BASES $OPTS &
sleep 1
