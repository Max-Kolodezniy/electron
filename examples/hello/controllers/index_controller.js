'use strict';

const model = require('../models/dataAccessor');

module.exports = {};

module.exports.get = (request, response) =>
{
    model.get(1)
        .then((data) => {
            response.ok(require('../views/item')(data));
        })
        .catch((exception) => {
            response.fail(exception);
        });
};

module.exports.all = (request, response) =>
{
    model.find('query from request here')
        .then((data) => {
            response.ok(require('../views/collection')(data));
        })
        .catch((exception) => {
            response.fail(exception);
        });
};

module.exports.post = (request, response) =>
{
    model.put(item)
        .then(() => {
            response.ok(null, 201);
        })
        .catch((exception) => {
            response.fail(exception);
        });
};

