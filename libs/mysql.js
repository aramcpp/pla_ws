// loading dependencies
var mysql = require("mysql");

// create connection pool
var pool = mysql.createPool({
    connectionLimit : 1000,
    host     : 'localhost',
    user     : 'root',
    password : 'dp2015',
    database : 'playland',
    debug    :  false
});

/*
 * @function: getConnection
 * @desc:     gets connection from pool
 * @params:   none
 * @callback: error and result
 * @author:   Aram (aramcpp@gmail.com)
 */
var getConnection = function(callback) {
    pool.getConnection(function(err, connection) {
        callback(err, connection);
    });
};

module.exports.getConnection = getConnection;