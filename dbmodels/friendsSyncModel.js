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

/*
 * @function: updateFriendEntry
 * @desc:     updates a single friend entry if it exists, or creates it otherwise
 * @params:   JSON formatted entry info
 * @callback: error and result
 * @author:   Aram (aramcpp@gmail.com)
 */
var updateFriendEntry = function(friendEntryJson, callback) {
  // check whether entry exists
  makeRequest('select friendshipID from friends where friendshipID = "' + friendEntryJson.friendshipID + '"', function(err, result) {
    if (!err) {
      if (result.length > 0) {
        // entry exists, we need to update it
        
        makeRequest('update friends set status = "' + friendEntryJson.status + '" where friendshipID = "' + friendEntryJson.friendshipID + '"', function(err, result) {
            if (!err) {
              // no error, we got it!
              callback(null, 1);
            }
            else {
              // some error occured, logging and sending
              console.log(err.stack);
              
              callback(null, 1);
            }
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

/*
 * @function: updateFriendsData
 * @desc:     updates all the given friend pairs
 * @params:   JSON formatted friends data
 * @callback: error and result
 * @author:   Aram (aramcpp@gmail.com)
 */
var updateFriendsData = function(friendDataJson, callback) {
  // process all the entries
  for (var i = 0; i < friendDataJson.length; i++) {
    // call updateFriendEntry for each
    updateFriendEntry(friendDataJson[i], function(err, result) {
      if (err) {
        callback(err, null);
      }
    });
  }
  
  callback(null, 1);
};

module.exports.updateFriendsData = updateFriendsData;