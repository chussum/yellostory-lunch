process.env.NODE_ENV = 'development'

var cmd = 'yarn apidoc'
var exec = require('child_process').exec
var nodemon = require('nodemon')

nodemon('--exec ./node_modules/.bin/babel-node ./app/server.js --watch ./app')
nodemon.on('start', function () {
    console.log('\nApp has started')
}).on('quit', function () {
    console.log('\nApp has quit')
    process.exit(0)
}).on('restart', function (files) {
    console.log('\nApp restarted due to:', files)
    exec(cmd)
})