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

    async getAllRegionsWithTerritories() {
        return this._db.query(
            `
                SELECT * FROM territorial_unit unit
                INNER JOIN (SELECT kindergarten.nvusc, kindergarten.vusc, region.latitude, region.longitude FROM kindergarten kindergarten
                JOIN region region ON region.name = kindergarten.nvusc 
                GROUP BY nvusc, vusc, latitude, longitude) regions_with_territories
                ON unit.id = regions_with_territories.vusc
            `, {
                type: sequelize.QueryTypes.SELECT,
            }
        )
    }

    async getAllGpsCoordinatesByYear(requestData) {
        let sqlQuery = `
            SELECT id, nvusc, red_nazev,  red_ulice, red_misto, red_psc, latitude, longitude
            FROM kindergarten
            WHERE year = $year 
            `;
        let bindObject = {
            year: requestData.year,
        };
        if (requestData.hasOwnProperty('kindergartenId')) {
            sqlQuery = sqlQuery + ' AND id != $id';
            bindObject = {
                ...bindObject,
                id: requestData.kindergartenId,
            }
        }
        return this._db.query(sqlQuery, {
                type: sequelize.QueryTypes.SELECT,
                bind: bindObject,
            }
        )
    }

    async getAllGpsCoordinatesByYearAndRegion(year, vusc, nvusc) {
        return this._db.query(
            `
            SELECT id, latitude, longitude
            FROM kindergarten
            WHERE year = $year AND nvusc = $nvusc AND vusc = $vusc
            `, {
                type: sequelize.QueryTypes.SELECT,
                bind: {
                    year,
                    nvusc,
                    vusc,
                },
            }
        )
    }
}

module.exports = KindergartenModel;
