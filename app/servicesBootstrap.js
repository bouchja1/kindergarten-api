'use strict';

const SimpleInjector = require('./v1/libs/simple-injector');

SimpleInjector.inject = require('./v1/enums/services');

let simpleInjector = SimpleInjector.instance({
    onInit: function() {
        console.log(`Services are being initialized!`);
    },
    onServiceInit: function(serviceName) {
        console.log(`Service: ${serviceName} has been initialized!`);
    },
    afterInit: function(time) {
        console.log(`All services successfully initialized after: ${time} ms`);
    }
});


/**
 *
 * @type {SimpleInjector}
 */
module.exports =  simpleInjector;
