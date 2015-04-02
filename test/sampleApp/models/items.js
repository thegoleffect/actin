var Items = function (options, client) {
    return this;
};

Items.prototype.query = function (query, callback) {
    return callback(null, null);
};


module.exports = Items;