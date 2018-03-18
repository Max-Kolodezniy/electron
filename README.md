# Electron Node.js MVC framework

This is tiniest MVC framework for Node.js AWS Lambda and APIGateway stateless applications.

It includes:
1. Request wrapper
2. Routing incl Middleware
3. Global and Per-Route Middleware
4. Basic Controller
5. Simple Model
6. Data Transvormation objects as Views
7. Error handling
8. Response is APIGateway-proxy-ready

# See how simple is it

* Route accept RegExp - that gives you absolute freedom
* Middleware methods are Promise-based
* router.middleware.push(...) stores global middleware methods
* Each route may define its own Middleware list
* Request is basically made from AWS APIGateway
* Response is AWS APIGateway-ready
```
'use strict';

exports.handler = (event, context, callback) =>
{
    const app = require('electron');
    const request = app.request(event);
    const response = app.response(callback);
    const middleware = require('./vendor/middlewares');
    const controller = require('./controllers/index_controller');

    const routes = [
        {
            path : new RegExp('/*/'),
            method : 'GET',
            action : controller.get,
            middleware : [ middleware.checkPermissions ]
        },
        {
            path : new RegExp('/*/'),
            method : 'POST',
            action : controller.post,
        }
    ];

    const router = app.router(request, response, routes);
    router.middleware.push(middleware.verifyUser);
    router.middleware.push(middleware.startSession);
    router.handle();
};
```

Check the examples!
