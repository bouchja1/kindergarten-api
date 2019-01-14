const Router = require('koa-router');

const Auth = require('./controllers/Permissions');
const Kindergarten = require('./controllers/Kindergarten');
const render = require('./controllers/render');

const basicRouter = new Router();
basicRouter.use(Auth.isAuthenticated); // tested

basicRouter
    .get('/', (ctx, next) => {
        ctx.body = { latest_version: 'v1' };
        next();
    })
    .get('/coordinates', Kindergarten.getAllGpsCoordinates, render)
    .get('/kindergartens', Kindergarten.getAllKindergartens, render)
    .get('/kindergartens/:kindergartenId', Kindergarten.getKindergartenDetail, render);

module.exports = basicRouter;
