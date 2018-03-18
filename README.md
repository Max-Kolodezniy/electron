
# Lambda-MVC Node.js MVC framework

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

Check the example app! For easy run - check out my https://www.npmjs.com/package/aws-lambda-local package. Feel free to `npm i -g aws-lambda-local`

# Examples

Simple integration:
```
➜  hello git:(master) ✗ lambda-local -f index.js -e EventSamples/TestGetItem_APIGateway_Proxy.json -t 10
OUTPUT
--------------------------------
{
    "statusCode": 200,
    "headers": {
        "ContentType": "application/json"
    },
    "body": "{\"type\":\"Item\",\"Item\":{\"key\":1,\"value\":\"2018-3-18 23:59:13\"}}"
}

```

Or list output (shows controller and routing). Sometimes (if Math.random() > 0.75) one of the middleware methods will fail for demonstration.
```
➜  hello git:(master) ✗ lambda-local -f index.js -e EventSamples/TestGetAll_APIGateway_Proxy.json -t 10
OUTPUT
--------------------------------
{
    "statusCode": 200,
    "headers": {
        "ContentType": "application/json"
    },
    "body": "{\"type\":\"Collection\",\"Collection\":[{\"type\":\"Item\",\"Item\":{\"key\":1,\"value\":\"2018-3-19 00:00:33\"}},{\"type\":\"Item\",\"Item\":{\"key\":2,\"value\":\"2018-3-19\"}},{\"type\":\"Item\",\"Item\":{\"key\":3,\"value\":\"00:00:33\"}}]}"
}
```

Fail one of the middleware methods:
```
➜  hello git:(master) ✗ lambda-local -f index.js -e EventSamples/TestNoAuth_APIGateway_Proxy.json -t 10
Error thrown:  { Error: startSession failed
    at Promise (/Users/max/work/home/projects/lambda-mvc/examples/hello/vendor/middlewares.js:25:20)
    at module.exports.verifySystemConfiguration (/Users/max/work/home/projects/lambda-mvc/examples/hello/vendor/middlewares.js:22:12)
    at prev.then (/Users/max/work/home/projects/lambda-mvc/examples/hello/node_modules/lambda-mvc/framework.js:101:28)
    at process._tickCallback (internal/process/next_tick.js:109:7)
    at Module.runMain (module.js:606:11)
    at run (bootstrap_node.js:390:7)
    at startup (bootstrap_node.js:150:9)
    at bootstrap_node.js:505:3 code: 500 }
OUTPUT
--------------------------------
{
    "statusCode": 500,
    "headers": {
        "ContentType": "application/json"
    },
    "body": "{\"code\":500,\"type\":\"Exception\",\"message\":\"startSession failed\"}"
}

```
