'use strict';

module.exports = function(items)
{
    let itemModel = require('./item');

    let result = {
        type : 'Collection',
        Collection : []
    };

    items.forEach(function (item) {
        result.Collection.push(itemModel(item));
    });

    return result;
};
