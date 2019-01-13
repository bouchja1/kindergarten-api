'use strict';

require('../config');

const co = require('bluebird-co').co;
const webServer = require('./webServer');
const services = require('./services');
const servicesBootstrap = require('./servicesBootstrap');

global.Promise = require('bluebird');

async function kindergarten() {
    await co(servicesBootstrap.init(services));
    require('./app');
    await webServer.run();
}

kindergarten()
    .then((res) => {
        console.log("kindergarten REST API loaded")
    })
    .catch((err) => {
        console.error(err);
        process.exit()
    });

