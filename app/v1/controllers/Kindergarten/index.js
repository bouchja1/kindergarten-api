'use strict';

const simpleInjector = require('../../libs/simple-injector').instance();
const kindergartenService = simpleInjector.services.kindergartenService;

const validator = require('../../libs/validator');

class Kindergartens {

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
