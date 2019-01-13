const qs = require('qs');

const config = require('../../../../config');

class Permissions {

    static async isAuthenticated(ctx, next) {
        if (ctx.method === 'OPTIONS') {
            await next();
        }
        let params = {};
        Object.assign(params, qs.parse(ctx.querystring));

        if (!params.hasOwnProperty('apiKey') || params.apiKey !== config.API_KEY) {
            ctx.status = 403;
            return;
        }

        await next();
    }

}

module.exports = Permissions;
