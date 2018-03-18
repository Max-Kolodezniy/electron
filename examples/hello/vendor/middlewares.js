'use strict';

const Exception = require('lambda-mvc').Exception;

module.exports = {};

module.exports.checkPermissions = (request) =>
{
    return new Promise((resolve, reject) =>
    {
        if (!request.headers.hasOwnProperty('Authorization')) {
            reject(new Exception ('verifyUser failed', 403));
            return;
        }
        resolve();
    });
};

module.exports.verifySystemConfiguration = () =>
{
    return new Promise((resolve, reject) =>
    {
        if (Math.random() > 0.75) {
            reject(new Exception ('startSession failed', 500));
            return;
        }
        resolve();
    });
};
