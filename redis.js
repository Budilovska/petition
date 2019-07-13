var redis = require('redis');
var client = redis.createClient({
    host: 'localhost',
    port: 6379
});

const {promisify} = require('util');

client.on('error', function(err) {
    console.log(err);
});

const get = exports.get = promisify(client.get.bind(client));

const set = exports.set = promisify(client.get.bind(client));

const setex = exports.setex = promisify(client.get.bind(client));

const del = exports.del = promisify(client.get.bind(client));

setex('disco', 15)
