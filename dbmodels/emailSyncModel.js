/*
 * NOT READY YET
 */

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
 * @function: updateEmailEntry
 * @desc:     updates a single email entry if it exists, or creates it otherwise
 * @params:   JSON formatted entry info
 * @callback: error and result
 * @author:   Aram (aramcpp@gmail.com)
 */
var updateEmailEntry = function(emailEntryJson, callback) {
  // check whether entry exists
  makeRequest('select emailID from email where emailID = "' + emailEntryJson.emailID + '"', function(err, result) {
    if (!err) {
      if (result.length > 0) {
        // entry exists, we need to update it
        
        makeRequest('update email set status = "' + emailEntryJson.status + '" where emailID = "' + emailEntryJson.emailID + '"', function(err, result) {
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
 * @function: updateEmailData
 * @desc:     updates all the given emails
 * @params:   JSON formatted email data
 * @callback: error and result
 * @author:   Aram (aramcpp@gmail.com)
 */
var updateEmailData = function(emailDataJson, callback) {
  // process all the entries
  for (var i = 0; i < emailDataJson.length; i++) {
    // call updateEmailEntry for each
    updateEmailEntry(emailDataJson[i], function(err, result) {
      if (err) {
        callback(err, null);
      }
    });
  }
  
  callback(null, 1);
};

module.exports.updateEmailData = updateEmailData;