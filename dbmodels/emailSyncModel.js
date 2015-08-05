// loading dependencies
var mysql = require("../libs/mysql");

/*
 * @function: makeRequest
 * @desc:     sends requst to mysql server
 * @params:   sql request and callback function
 * @callback: error and result
 * @author:   Aram (aramcpp@gmail.com)
 */
var makeRequest = function(request, callback) {
  // connect to db
  mysql.getConnection(function(err, connection){
    if (err) {
      connection.release();
      console.log('error');
      callback(err, null);
    }
    
    // make a request
    connection.query(request,function(err,result){
      connection.release();
      callback(err, result);
    });

    connection.on('error', function(err) {
      //console.log(err.stack);
      callback(err, null);
    });
  });
};

