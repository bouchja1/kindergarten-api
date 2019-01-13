'use strict';

let instance;

class SimpleInjector {


    /**
     *
     * @param {{
     *  onInit: [function]
     *  onServiceInit: [function]
     *  afterInit: [function]
     * }} config
     *
     * @returns {SimpleInjector}
     */
    static instance(config) {
        if (!instance) {
            instance = new SimpleInjector(SimpleInjector.CONSTANTS.SINGLETON, config);
        }
        return instance;
    }


    constructor(singleton, config = {}) {

        if (singleton !== SimpleInjector.CONSTANTS.SINGLETON) {
            throw new Error('Constructor cannot be called on Singleton!');
        }
        /**
         *
         * @type {null|function}
         */
        this.onInit = config.onInit || null;

        /**
         *
         * @type {null|function}
         */
        this.onServiceInit = config.onServiceInit || null;

        /**
         *
         * @type {null|function}
         */
        this.afterInit = config.afterInit || null;

        this._initialized = 0;

        this._services = null;

        this._servicesMap = {};

        this._dependencies = {};

    }

    /**
     *
     * @return {siServices}
     */
    get services() {
        return this._services;
    }


    * init(services) {

        this._services = services;

        const start = Date.now();

        if(this.onInit) {
            this.onInit();
        } else {
            console.log('Initializing services ...');
        }

        for (let serviceName in this._services) {
            const service = this._services[serviceName];

            this._servicesMap[serviceName] = {
                service: service,
                initialized: false
            };
            if (!!service[SimpleInjector.METHODS.DEPENDENCIES]) {
                this._dependencies[serviceName] = service[SimpleInjector.METHODS.DEPENDENCIES]();
            } else {
                this._dependencies[serviceName] = [];
            }
        }


        while (this._initialized < Object.keys(this._services).length) {

            for (let serviceName in this._servicesMap) {
                let service = this._servicesMap[serviceName];

                if (service.initialized === false) {
                    if (this._dependencies[serviceName].length === 0) {
                        yield this._initService(serviceName);
                    } else {

                        let allInitialized = true;
                        for (let dependency of this._dependencies[serviceName]) {
                            if (this._servicesMap[dependency].initialized === false) {
                                allInitialized = false;
                                break;
                            }
                        }

                        if (allInitialized) {
                            for (let dependency of this._dependencies[serviceName]) {
                                service.service[dependency] = this._servicesMap[dependency].service;
                            }
                            yield this._initService(serviceName);
                        }
                    }
                }
            }
        }


        let timeElapsed = Date.now() - start;
        if(this.afterInit) {
            this.afterInit(timeElapsed);
        } else {
            console.log('Services are initialized!!!');
            console.log('------------------------------------------------');
            console.log(`Preinit finished in ${timeElapsed} finish ms`);
        }

    }


    * _initService(serviceName) {

        let result = this._services[serviceName][SimpleInjector.METHODS.INIT](serviceName);

        if (typeof(result) === 'object') {
            yield result;
        }

        if(this.onServiceInit) {
            this.onServiceInit(serviceName);
        }

        this._servicesMap[serviceName].initialized = true;
        this._initialized++;
    }

}

SimpleInjector.METHODS = {
    DEPENDENCIES: Symbol(),
    INIT: Symbol()
};

SimpleInjector.CONSTANTS = {
    SINGLETON: Symbol()
};

module.exports = SimpleInjector;