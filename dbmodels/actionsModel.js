/*
 *
 * TODO
 * * create actions model 
 * * replace code for services, start using actions model
 */
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
 * @function: getRoomActions
 * @desc:     gets the list of actions in the given area 
 * @params:   areaid
 * @callback: error and result
 */
var getAreaActions = function(areaid, callback) {
    // make a request
  makeRequest('select * from actions where areaid="' + areaid + '"',function(err,result){
    callback(err, result);
  });
};

/*
 * @function: setUserActions
 * @desc:     updates the user actions
 * @params:   json formatted action info
 * @callback: error and result
 */
var setUserActions = function(actionInfoJson, callback) {
    // make a request
  makeRequest('update users set areaid = "' + actionInfoJson.areaid + '", action = "' + actionInfoJson.action + '", actionValue = "' + actionInfoJson.actionValue + '" where userid = "' + actionInfoJson.userid + '"',function(err,result){
    callback(err,result);
  });
};

// model function exports
module.exports.getAreaActions = getAreaActions;

module.exports.setUserActions = setUserActions;