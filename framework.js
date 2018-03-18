'use strict';

module.exports = {};

module.exports.request = (event) =>
{
    const sanitizer = require('sanitizer');

    return {
        path: sanitizer.escape(event.path),
        method: sanitizer.escape(event.httpMethod).toUpperCase(),
        body: event.body,
        params: event.pathParameters || {},
        query: event.queryStringParameters || {},
        headers: event.headers,
        escape : sanitizer.escape
    };
};

module.exports.response = (callback) =>
{
    const ok = (content, status, headers) =>
    {
        status = status || 200;
        callback(null, _buildResponse(status, headers, content));
    };

    const fail = (error, status, headers) =>
    {
        console.log('Error thrown: ', error);
        let response;
        if (error === null) {
            response = null;
            status = status || 400;
            callback(null, _buildResponse(status, headers, response));
        } else {
            if (!(error instanceof Exception)) {
                error = new Exception(error);
            }
            response = error.toArray();

            status = status || (error.code % 1 === 0 ? parseInt(error.code) : 400);
            callback(null, _buildResponse(status, headers, response));
        }
    };

    const _buildResponse = function(status, headers, content)
    {
        headers = headers || {};

        if (!('ContentType' in headers)) {
            headers.ContentType = 'application/json';
        }
        if (status === 200 && content.length === 0) {
            status = 204;
        }

        return {
            statusCode: status,
            headers: headers,
            body: content ? JSON.stringify(content) : ''
        }
    };

    return {
        ok: ok,
        fail: fail
    };
};

module.exports.router = (request, response, routes) =>
{
    let middleware = [];

    const route = routes.find((item) => {
        if (item.path instanceof RegExp) {
            const matches = request.path.match(item.path);
            return matches && matches.length && item.method === request.method
        } else {
            return item.path === request.path && item.method === request.method
        }
    });

    if (!route.middleware) {
        route.middleware = [];
    }

    const handle = () => {
        if (!route) {
            const message = 'No route matches for ' + request.method + ' ' + request.path;
            return response.fail(message, 404);
        }

        if (!middleware.length && !route.middleware.length) {
            return route.action(request, response);
        }

        [ ...middleware, ...route.middleware ]
            .reduce((prev, current) => {
                return prev.then(() => {
                    return current(request, response);
                });
            }, Promise.resolve())
            .then(() => {
                return route.action(request, response);
            })
            .catch((error) => {
                response.fail(error);
            });
    };

    return {
        handle: handle,
        middleware : middleware
    };
};

class Exception extends Error
{
    constructor (error, code, previous)
    {
        if (typeof error === 'string') {
            super (error);
        } else if (typeof error === 'object') {
            if (error.message) {
                super (error.message);
            } else {
                super ('Internal error');
            }
        }
        Error.captureStackTrace(this, Exception);
        if (typeof code !== 'undefined') {
            this.code = code
        }
        if (typeof previous !== 'undefined') {
            this.previous = previous;
        }
    }

    toArray (error)
    {
        if (typeof error === 'undefined') {
            error = this;
        }
        let exported = {
            code : error.code || 400,
            type : error.type || error.constructor.name || 'Exception',
            message : error.message || 'Internal error'
        };
        if (error.previous) {
            exported.previous = this.toArray(error.previous);
        }
        return exported;
    }
}

module.exports.Exception = Exception;
