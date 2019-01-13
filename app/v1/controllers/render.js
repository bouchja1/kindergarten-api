'use strict';

const moment = require('moment-timezone');

module.exports = async function(ctx) {
    ctx.body = {
        data: ctx.body,
        status: ctx.status,
        datetime: moment().utc().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
    };
};
