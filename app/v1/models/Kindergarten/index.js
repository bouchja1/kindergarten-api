'use strict';

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
}

module.exports = KindergartenModel;
