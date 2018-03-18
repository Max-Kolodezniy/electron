"use strict";

const get = (key) =>
{
    return new Promise((resolve) =>
    {
        resolve({
            key : key,
            value : (new Date()).toLocaleString()
        })
    })
};

const find = (query) =>
{
    return new Promise((resolve) =>
    {
        resolve([
            {
                key : 1,
                value : (new Date()).toLocaleString()
            }, {
                key : 2,
                value : (new Date()).toLocaleDateString()
            }, {
                key : 3,
                value : (new Date()).toLocaleTimeString()
            }
        ]);
    })
};

module.exports = {
    get : get,
    find : find
};
