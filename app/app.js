const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('kcors');
const koaLogger = require('koa-logger');

const config = require('../config');

// load moment and set default javascript timezone
const moment = require('moment-timezone');
const TIMEZONE = config.SERVER_TIMEZONE || 'Europe/Prague';
moment.tz.setDefault(TIMEZONE);

const webServer = require('./webServer');

const router = require('./v1/router');

let app = new Koa();
webServer.init(app.callback());

app.use(bodyParser({jsonLimit: '50mb'}));

app.use(koaLogger({
    transporter: (str, args) => {
        console.log(str);
    }
}));


app.use(cors({
    credentials: true,
    allowMethods: ['GET']
}));

app.proxy = true;

app.on('error', (err, ctx) => {
    console.log(`Global error occured for context ${JSON.stringify(ctx, null, 2)}.`, err);
});


// response
app
    .use(router.routes())
    .use(router.allowedMethods());

module.exports = app;
