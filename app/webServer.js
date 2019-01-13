'use strict';

const http = require('http');
const config = require('../config');

let server;

/**
 * @param  {*} val input
 * @return {number|string}
 */
function normalizePort (val) {
    const parsedPort = parseInt(val, 10);

    if (isNaN(parsedPort)) {
        // named pipe
        return val;
    }

    if (parsedPort >= 0) {
        // port number
        return parsedPort;
    }

    return false;
}


/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(server, defer) {
    return function onListen () {
        const addr = server.address();
        const bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        console.log('Listening on ' + bind);
        defer.resolve(server);
    };
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    console.log('Web server error.', error);
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof config.PORT === 'string'
        ? 'Pipe ' + config.PORT
        : 'Port ' + config.PORT;

    switch (error.code) {
        case 'EACCES':
            console.log(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.log(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function defer() {
    let resolve, reject;
    const promise = new Promise(function() {
        resolve = arguments[0];
        reject = arguments[1];
    });
    return {
        resolve: resolve,
        reject: reject,
        promise: promise
    };
}

module.exports.init = function (app) {
    server = http.createServer(app);
    return server;
};


module.exports.run = function () {
    const serverStartedDeffer = defer();
    const port = normalizePort(config.PORT);

    server.listen(port);

    server.keepAliveTimeout = 2000;

    server.on('error', onError);
    server.on('listening', onListening(server, serverStartedDeffer));


    server.on('close', () => {
        console.log('############## EVENT: CLOSE SERVER');
    });

    // because of graceful termination in cluster
    process.once('SIGTERM', () => {

        server.close(function () {
            console.log('********* Server has been stopped by SIGTERM');

        });
        console.log('*********** SIGTERM ... no action ...');

        let time = 0;
        setInterval(() => {
            time ++;
            console.log(time);
        }, 1000);
    });

    return serverStartedDeffer.promise;
};
