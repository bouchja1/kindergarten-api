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

    static async getAllPointsInRadius(ctx, next) {
        const result = validator.run(ctx, validator.QUERY, {
            kindergartenId: validator.number().optional(),
            latitude: validator.number().required(),
            longitude: validator.number().required(),
            radius: validator.number().required(),
            year: validator.number().default(2017),
        });
        const allCoordinatesByYear = await kindergartenService.getAllGpsCoordinates({
            year: result.year,
            kindergartenIds: result.kindergartenId ? [result.kindergartenId] : [],
        });
        const allSchoolsInRadius = await kindergartenService.getAllSchoolsInRadius(allCoordinatesByYear, result.latitude, result.longitude, result.radius);
        ctx.body = {
            schools: allSchoolsInRadius,
        };
        await next();
    }

    static async getAllGpsCoordinates(ctx, next) {
        const result = validator.run(ctx, validator.QUERY, {
            year: validator.number().default(2017),
            vusc: validator.string().required(),
            nvusc: validator.string().valid(['Hl. m. Praha','Středočeský kraj','Jihočeský kraj','Plzeňský kraj','Karlovarský kraj','Ústecký kraj','Liberecký kraj','Královéhradecký kraj','Pardubický kraj','Kraj Vysočina','Jihomoravský kraj','Olomoucký kraj','Zlínský kraj','Moravskoslezský kraj']).required(),
        });
        const allGpsCoordinates = await kindergartenService.getAllGpsCoordinatesByYearAndRegion(result);
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

    static async getKindergartenCounts(ctx, next) {
        const result = validator.run(ctx, validator.PATH, {
            kindergartenId: validator.number().required(),
            radius: validator.number().default(1),
        });
        const kindergartenCounts = await kindergartenService.getKindergartenAnnualCounts(result.kindergartenId, result.radius);
        ctx.body = {
            dataKindergarten: kindergartenCounts.dataKindergarten,
            dataRadius: kindergartenCounts.dataRadius,
        };
        await next();
    }

}

module.exports = Kindergartens;
