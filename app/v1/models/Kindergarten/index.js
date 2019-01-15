'use strict';

const sequelize = require('sequelize');

class KindergartenModel {

    /**
     *
     * @param {DBService} db
     */
    constructor(db) {
        this._db = db.client;
        this._kindergartenSchema = db.client.models['kindergarten'];
    }

    async getKindergartenById(id) {
        return this._kindergartenSchema.findById(id);
    }

    async getAllKindergartens() {
        return await this._kindergartenSchema.findAll();
    }

    async getAllRegions() {
        return this._db.query(
            `
            SELECT DISTINCT nvusc
            FROM kindergarten
            `, {
                type: sequelize.QueryTypes.SELECT,
            }
        )
    }

    async getAllGpsCoordinates(year, regionName) {
        return this._db.query(
            `
            SELECT id, latitude, longitude
            FROM kindergarten
            WHERE year = $year AND nvusc = $regionName
            `, {
                type: sequelize.QueryTypes.SELECT,
                bind: {
                    year,
                    regionName,
                },
            }
        )
    }
}

module.exports = KindergartenModel;
