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

    async getAllAnnualKindergartenDetailDataById(kindergartenId) {
        return this._db.query(
            `
        SELECT id, year, red_izo, izo, ruian_code, nvusc, red_nazev, red_pln, red_ulice, red_misto, red_psc, ((children_total_attendance/children_total_capacity) * 100) AS avg_count, children_total_attendance, children_total_capacity, latitude, longitude
        FROM kindergarten
        WHERE red_izo = (SELECT red_izo FROM kindergarten WHERE id = $kindergartenId)
        AND izo = (SELECT izo FROM kindergarten WHERE id = $kindergartenId)
            `, {
                type: sequelize.QueryTypes.SELECT,
                bind: {
                    kindergartenId
                },
            }
        )
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

    async getAllGpsCoordinates(requestData) {
        let bindObject = {};
        let sqlQuery = `
            SELECT id, year, red_izo, izo, ruian_code, nvusc, red_pln, red_nazev, red_ulice, red_misto, red_psc, latitude, longitude, ((children_total_attendance/children_total_capacity) * 100) AS avg_count, children_total_attendance, children_total_capacity
            FROM kindergarten
            WHERE true
            `;
        if (requestData.hasOwnProperty('year')) {
            sqlQuery = sqlQuery + ' AND year = $year';
            bindObject = {
                ...bindObject,
                year: requestData.year,
            };
        }
        if (requestData.hasOwnProperty('kindergartenIds')) {
            sqlQuery = sqlQuery + ` AND id NOT IN (${requestData.kindergartenIds})`;
        }
        const result = await this._db.query(sqlQuery, {
                type: sequelize.QueryTypes.SELECT,
                bind: bindObject,
            },
        )
        //console.log("REES: ", result)
        return result;
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
