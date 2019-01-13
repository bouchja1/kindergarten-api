const servicesEnum = require('./v1/enums/services');
const config = require('../config');

const MysqlConnection = require('./v1/services/MysqlConnection');
const DBService = require('./v1/services/DbService');
const KindergartenService = require('./v1/services/KindergartenService');

/**
 *
 *
 *  !!!!!!! KEEP THIS TYPEDEF UP TO DATE !!!!!!
 *
 *  keyName = servicesEnum value
 *  value = ServiceClass name
 *
 *
 *
 * @typedef {{
 *
 *   mysqlConnection: MysqlConnection,
 *
 *   db: DBService,
 *
 *   kindergartenService: KindergartenService
 *
 * }} siServices
 *
 * @type {siServices}
 */
const services = {
    /**
     * MysqlConnection
     */
    [servicesEnum.SERVICES.mysqlConnection]: MysqlConnection.instance({
        host: config.db_host,
        db: config.db_name,
        user: config.db_user,
        pass: config.db_password,
        options: getDbOptions(),
    }),

    /**
     *  DBService
     */
    [servicesEnum.SERVICES.db]: DBService.instance(),

    /**
     *  KindergartenService
     */
    [servicesEnum.SERVICES.kindergartenService]: KindergartenService.instance(),
};

function getDbOptions() {
    const dbOptions = {
        host: config.db_host,
        dialect: 'mysql',
        pool: {
            max: 20,
            min: 1,
            idle: 10000
        },
        logging: console.log,
        benchmark: false,
    };
    dbOptions.timezone = 'Europe/Prague';
    return dbOptions;
}

module.exports = services;
