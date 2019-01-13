'use strict';

class Permissions {

    static async isAuthenticated(ctx, next) {
        if (ctx.method === 'OPTIONS') {
            await next();
        }

        // TODO check apikey

        await next();
    }

}

module.exports = Permissions;
