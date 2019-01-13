'use strict';

const SimpleInjector = require('../../libs/simple-injector');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const sha1 = require('sha1');

let instance = null;

class DBService {


    /**
     *
     * @return {DBService}
     */
    static instance() {
        if (!instance) {
            instance = new DBService(SimpleInjector.CONSTANTS.SINGLETON)
        }
        return instance;
    }

    [SimpleInjector.METHODS.INIT](serviceName) {
        let mysqlClient = instance.mysqlConnection.client;
        this.client = mysqlClient;
        this._initDbSchema();
    }

    [SimpleInjector.METHODS.DEPENDENCIES]() {
        return [
            SimpleInjector.inject.SERVICES.mysqlConnection,
        ]
    }

    constructor(singleton) {
        if (singleton !== SimpleInjector.CONSTANTS.SINGLETON) {
            throw new Error('Constructor cannot be called on Singleton!');
        }

        /**
         *
         * @type {MysqlConnection}
         */
        this.client = null;

    }

    /**
     * path to schemas directory relative to process.cwd()
     *
     * @param {string} schemaPath
     * @returns {*}
     */
    schemaProvider(schemaPath) {

        let schemaProvider = {

            _schemasDirPath: path.join(process.cwd(), schemaPath),

            client: null,

            /**
             *
             * @returns {object}
             */
            init() {
                instance.schemaList = this._getFiles();
                return this;
            },

            import() {

                instance.schemaList.forEach((schema) => {
                    let model = instance.client.import(path.join(this._schemasDirPath, schema));
                    console.log(`Sequelize has imported ${model.name}.`);
                });

                for (let model of Object.keys(instance.client.models)) {
                    if (!!instance.client.models[model].associate) {
                        instance.client.models[model].associate(instance.client.models);
                        console.log(`Associations for ${model} has been created.`);
                    }
                }

                return this;
            },


            /**
             *
             * @param {string} [files_]
             * @returns {*|Array}
             */
            _getFiles(files_) {
                files_ = files_ || [];
                const files = fs.readdirSync(this._schemasDirPath);
                for (let i in files) {
                    const filePath = path.join(this._schemasDirPath, files[i]);
                    if (!fs.statSync(filePath).isDirectory()) {
                        files_.push(instance._removeExtFromFileName(files[i]));
                    }
                }
                return files_;
            }

        };

        schemaProvider.init();

        return schemaProvider;
    }

    _initDbSchema() {
        this.schemaProvider('app/v1/schemas/db')
            .import();
    }

    /**
     *
     * @param {string} fileName
     * @returns {string}
     * @private
     */
    _removeExtFromFileName(fileName) {
        return fileName.replace(/\.js/, '');
    }


    _hashPasswords(data) {
        return data.map((user) => {
            if (user.password !== '') {
                user.password = sha1(user.password);
            }
            return user
        });
    }

}


module.exports = DBService;
