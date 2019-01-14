'use strict';

const SimpleInjector = require('../../libs/simple-injector');

const KindergartenModel = require('../../models/Kindergarten');

let instance = null;

class KindergartenService {

    /**
     *
     * @return {KindergartenService}
     */
    static instance() {
        if (!instance) {
            instance = new KindergartenService(SimpleInjector.CONSTANTS.SINGLETON)
        }
        return instance;
    }


    [SimpleInjector.METHODS.DEPENDENCIES]() {
        return [
            SimpleInjector.inject.SERVICES.db,
        ];
    }

    async [SimpleInjector.METHODS.INIT](serviceName) {
        this._model = new KindergartenModel(instance.db);
    }

    constructor(singleton) {
        if (singleton !== SimpleInjector.CONSTANTS.SINGLETON) {
            throw new Error('Constructor cannot be called on Singleton!');
        }

        /**
         *
         * @type {KindergartenModel}
         * @private
         */
        this._model = null;
    }

    getAllGpsCoordinates(requestData) {
        return this._model.getAllGpsCoordinates(requestData.year);
    }

    getAllKindergartens() {
        return this._model.getAllKindergartens();
    }

    getKindergartenDetail(id) {
        return this._model.getKindergartenById(id);
    }

}

module.exports = KindergartenService;
