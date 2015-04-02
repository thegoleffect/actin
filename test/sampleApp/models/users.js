var Users = function (options, client) {
    return this;
};

Users.prototype.query = function (query, callback) {
    return callback(null, null);
};


module.exports = Users;