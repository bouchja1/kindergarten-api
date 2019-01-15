'use strict';

const simpleInjector = require('../../libs/simple-injector').instance();
const kindergartenService = simpleInjector.services.kindergartenService;

const validator = require('../../libs/validator');

class Kindergartens {

    static async getAllRegions(ctx, next) {
        const allRegions = await kindergartenService.getAllRegions();
        ctx.body = {
            regions: allRegions,
        };
        await next();
    }

    static async getAllGpsCoordinates(ctx, next) {
        const result = validator.run(ctx, validator.QUERY, {
            year: validator.number().default(2017)
        });
        const allGpsCoordinates = await kindergartenService.getAllGpsCoordinates(result);
        ctx.body = {
            coordinates: allGpsCoordinates,
        };
        await next();
    }

    static async getAllKindergartens(ctx, next) {
        const allKindergartens = await kindergartenService.getAllKindergartens();
        ctx.body = {
            schools: allKindergartens,
        };
        await next();
    }

    static async getKindergartenDetail(ctx, next) {
        const result = validator.run(ctx, validator.PATH, {
            kindergartenId: validator.number().required()
        });
        const detail = await kindergartenService.getKindergartenDetail(result.kindergartenId);
        ctx.body = detail;
        await next();
    }

}

module.exports = Kindergartens;
