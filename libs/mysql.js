// loading dependencies
var mysql = require("mysql")

var pool = mysql.createPool({
    connectionLimit : 1000,
    host     : 'localhost',
    user     : 'root',
    password : 'dp2015',
    database : 'playland',
    debug    :  false
});

// function for connecting to DB
var getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        callback(err, connection);
    });
};

module.exports.getConnection = getConnection;