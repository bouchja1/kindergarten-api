'use strict';

const SimpleInjector = require('../../libs/simple-injector');
const Sequelize = require('sequelize');

/**
 * @type MysqlConnection
 */
let instance = null;

class MysqlConnection {

    /**
     *
     * @param {object} config
     * @return {MysqlConnection}
     */
    static instance(config) {
        if (!instance) {
            instance = new MysqlConnection(SimpleInjector.CONSTANTS.SINGLETON, config)
        }
        return instance;
    }


    [SimpleInjector.METHODS.DEPENDENCIES]() {
        return [];
    }

    async [SimpleInjector.METHODS.INIT](serviceName) {
        this.serviceName = serviceName;
        //instance.sqlService ... // SqlService is available right now. You can use "this" or "instance".
        try {
            return await this.init();
        } catch (err) {
            throw new Error(err)
        }

    }

    constructor(singleton, config) {

        if (singleton !== SimpleInjector.CONSTANTS.SINGLETON) {
            throw new Error('Constructor cannot be called on Singleton!');
        }

        /**
         *
         * @type {null|string}
         */
        this.serviceName = null;

        /**
         *
         * @typedef {{
         *   host: *,
         *   dialect: string,
         *   pool: {max: *, min: *, idle: number},
         *   logging: null,
         *   benchmark: boolean
         * }} dbOptions

         * @type {{
         *  host: string,
         *  db: string,
         *  user: string,
         *  pass: string
         *  options: dbOptions
         * }}
         */
        this.config = config;

        /**
         * @type {Sequelize}
         */
        this.client = null;
    }

    /**
     *
     * @returns {MysqlConnection}
     * @private
     */
    async init() {
        this.client = new Sequelize(this.config.db, this.config.user, this.config.pass, this.config.options);
        return await this._connectClientPromise();
    }

    /**
     *
     * @private
     */
    _connectClientPromise() {
        return this.client
            .authenticate()
            .then((client) => {
                console.log(`successfully connected to mysql - ${this.serviceName}, ${JSON.stringify(this.config.options, null, 2)}`);
                return client
            })
            .catch((err) => {
                console.log(`Unable to connect to mysql - ${this.serviceName}`, err);
                throw new Error(err);
            });
    }

}

module.exports = MysqlConnection;
