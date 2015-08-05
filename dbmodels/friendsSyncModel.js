// loading dependencies
var mysql = require("../libs/mysql");

/*
 * @function: makeRequest
 * @desc:     sends requst to mysql server
 * @params:   sql request and callback function
 * @callback: error and result
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

/*
 * @function: updateFriendEntry
 * @desc:     updates a single friend entry if it exists, or creates it otherwise
 * @params:   sql request and callback function
 * @callback: error and result
 * @author: Aram (aramcpp@gmail.com)
 */
var updateFriendEntry = function(friendEntryJson, callback) {
  // check whether entry exists
  makeRequest('select friendshipID from friends where friendshipID = "' + friendEntryJson.friendshipID + '"', function(err, result) {
    if (!err) {
      if (result.length > 0) {
        // entry exists, we need to update it
        
        makeRequest('select friendshipID from friends where friendshipID = "' + friendEntryJson.friendshipID + '"', function(err, result) {
        });
      }
      else {
        // entry doesn't exists, so we need to add it
      }
    }
    else {
      // some error occured need to sned it back
      // add some log, just for myself :)
      console.log(err.stack);
      
      callback(err, null);
    }
  });
};