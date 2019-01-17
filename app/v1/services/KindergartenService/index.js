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

    async getAllRegions() {
        const regionsMap = new Map();
        const regionsWithTerritories = await this._model.getAllRegionsWithTerritories();
        for (let i = 0; i < regionsWithTerritories.length; i++) {
            const nvuscRegion = regionsMap.get(regionsWithTerritories[i].nvusc);
            if (nvuscRegion) {
                nvuscRegion.territories.push({
                    name: regionsWithTerritories[i].name,
                    vusc: regionsWithTerritories[i].vusc,
                });
            } else {
                regionsMap.set(regionsWithTerritories[i].nvusc, {
                    nvusc: regionsWithTerritories[i].nvusc,
                    latitude: regionsWithTerritories[i].latitude,
                    longitude: regionsWithTerritories[i].longitude,
                    territories: [
                        {
                            name: regionsWithTerritories[i].name,
                            vusc: regionsWithTerritories[i].vusc,
                        }
                    ]
                })
            }
        }
        // get values
        const regionsTerritoriesArray = [];
        for (let value of regionsMap.values()) {
            regionsTerritoriesArray.push(value);
        }

        return regionsTerritoriesArray;
    }

    async getAllGpsCoordinates(requestData) {
        return this._model.getAllGpsCoordinates(requestData.year, requestData.regionName);
    }
    

    async getAllKindergartens() {
        return this._model.getAllKindergartens();
    }

    async getKindergartenDetail(id) {
        return this._model.getKindergartenById(id);
    }

}

module.exports = KindergartenService;
