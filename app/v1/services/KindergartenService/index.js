'use strict';
const _ = require('lodash');

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

    async getAllSchoolsInRadius(requestData) {
        const allCoordinatesByYear = await this._model.getAllGpsCoordinatesByYear(requestData);
        const distancePromisesArray = [];
        for (let i = 0; i < allCoordinatesByYear.length; i++) {
            if (allCoordinatesByYear[i].latitude && allCoordinatesByYear[i].longitude) {
                distancePromisesArray.push(this.distance(requestData.latitude, requestData.longitude, Number(allCoordinatesByYear[i].latitude), Number(allCoordinatesByYear[i].longitude), allCoordinatesByYear[i]));
            }
        }
        let allPromiseRes = await Promise.all(distancePromisesArray)
            .then((values) => {
                return values;
            });
        allPromiseRes = allPromiseRes.filter((data) => {
            return Math.ceil(data.distance) <= requestData.radius;
        });
        allPromiseRes = _.orderBy(allPromiseRes, ['distance'], ['asc']);
        return allPromiseRes;
    }

    /**
     * This routine calculates the distance between two points (given the latitude/longitude of those points)
     * South latitudes are negative, east longitudes are positive.
     * Passed to function:
     *  lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)
     *  lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)
     * Result is in kilometers
     *
     * @param lat1
     * @param lon1
     * @param lat2
     * @param lon2
     * @param unit
     * @returns {Promise<object>}
     */
    async distance(lat1, lon1, lat2, lon2, originalData) {
        let distance;
        if ((lat1 == lat2) && (lon1 == lon2)) {
            distance = 0;
        }
        else {
            const radlat1 = Math.PI * lat1 / 180;
            const radlat2 = Math.PI * lat2 / 180;
            const theta = lon1 - lon2;
            const radtheta = Math.PI * theta / 180;
            let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;
            dist = dist * 1.609344; // convert to kilometers
            distance = dist;
        }
        originalData = {
            ...originalData,
            distance,
        };
        return originalData;
    }

    async getAllGpsCoordinates(requestData) {
        return this._model.getAllGpsCoordinatesByYearAndRegion(requestData.year, requestData.vusc, requestData.nvusc);
    }

    async getAllKindergartens() {
        return this._model.getAllKindergartens();
    }

    async getKindergartenDetail(id) {
        return this._model.getKindergartenById(id);
    }

}

module.exports = KindergartenService;
