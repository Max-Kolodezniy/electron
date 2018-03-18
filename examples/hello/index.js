'use strict';

exports.handler = (event, context, callback) =>
{
    const app = require('lambda-mvc');
    const request = app.request(event);
    const response = app.response(callback);
    const middleware = require('./vendor/middlewares');
    const controller = require('./controllers/index_controller');

    const routes = [
        {
            path : new RegExp('/all'),
            method : 'GET',
            action : controller.all,
            middleware : [ middleware.checkPermissions ]
        },
        {
            path : new RegExp('/one'),
            method : 'GET',
            action : controller.get,
        }
    ];

    const router = app.router(request, response, routes);
    router.middleware.push(middleware.verifySystemConfiguration);
    // You can add as many Middleware methods as you wish
    // Tip of the day: you can change request and response objects by adding your own attributes
    router.handle();
};
