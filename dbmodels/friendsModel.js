// loading dependencies
var mysql = require("../libs/mysql");
var uuid = require("node-uuid");

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
 * @function: setFriendStatus
 * @desc:     sets the status of the given friends, or adds friends with given status
 * @params:   JSON formatted userids and friend status
 * @callback: error and result
 * @author: Aram (aramcpp@gmail.com)
 */
var setFriendStatus = function(friendInfoJson, callback) {
  // make a request
  makeRequest('select friendshipID from friends where (fromFriendID="' + friendInfoJson.fromFriendID + '" and toFriendID="' + friendInfoJson.toFriendID + '") or (fromFriendID="' + friendInfoJson.toFriendID + '" and toFriendID="' + friendInfoJson.fromFriendID + '")',function(err,result){
    if (!err) {
      if (result.length > 0) {
        console.log(result);
        
        makeRequest('update friends set status = "' + friendInfoJson.status + '" where friendshipID = "' + result[0].friendshipID + '"',function(err,result){
          if (!err) {
            callback(null, 1);
          }
          else {
            callback(err, null);
          }
        });
      }
      else {
        makeRequest('insert into friends values("' + uuid.v4() + '", "' + friendInfoJson.fromFriendID + '", "' + friendInfoJson.toFriendID + '", "' + friendInfoJson.status + '")',function(err,result){
          if (!err) {
            callback(null, 1);
          }
          else {
            callback(err, null);
          }
        });
      }
    }
    else {
      callback(err,null);
    }
  });
};

/*
 * @function: deleteFriend
 * @desc:     deletes the friends
 * @params:   JSON formatted userids
 * @callback: error and result
 * @author: Aram (aramcpp@gmail.com)
 */
var deleteFriend = function(friendInfoJson, callback) {
  // make a request
  makeRequest('select friendshipID from friends where (fromFriendID="' + friendInfoJson.fromFriendID + '" and toFriendID="' + friendInfoJson.toFriendID + '") or (fromFriendID="' + friendInfoJson.toFriendID + '" and toFriendID="' + friendInfoJson.fromFriendID + '")',function(err,result){
    if (!err) {
      if (result.length > 0) {
        console.log(result);
        
        makeRequest('delete from friends where friendshipID = "' + result[0].friendshipID + '"',function(err,result){
          if (!err) {
            callback(null, 1);
          }
          else {
            callback(err, null);
          }
        });
      }
    }
    else {
      callback(err,null);
    }
  });
};

/*
 * @function: getFriendsWithStatus
 * @desc:     gets the list of friends with the given status
 * @params:   JSON formatted userid and friend status
 * @callback: error and result
 * @author: Aram (aramcpp@gmail.com)
 */
var getFriendsWithStatus = function(friendInfoJson, callback) {
  makeRequest('select * from friends where (fromFriendID="' + friendInfoJson.fromFriendID + '" or toFriendID="' + friendInfoJson.fromFriendID + '") and status = "' + friendInfoJson.status + '"',function(err,result){
    if (!err) {
      console.log(result);
      
      callback(null, result);
    }
    else {
      callback(err, null);
    }
  });
};

/*
 * @function: getAllFriends
 * @desc:     gets the list of friends no matter what status
 * @params:   JSON formatted userid
 * @callback: error and result
 * @author: Aram (aramcpp@gmail.com)
 */
var getAllFriends = function(friendInfoJson, callback) {
  makeRequest('select * from friends where (fromFriendID="' + friendInfoJson.fromFriendID + '" or toFriendID="' + friendInfoJson.fromFriendID + '")',function(err,result){
    if (!err) {
      console.log(result);
      
      callback(null, result);
    }
    else {
      callback(err, null);
    }
  });
};

/*
 * @function: getFriendsStatus
 * @desc:     gets the status of friendship
 * @params:   JSON formatted userid and friend status
 * @callback: error and result
 * @author: Aram (aramcpp@gmail.com)
 */
var getFriendsStatus = function(friendInfoJson, callback) {
  makeRequest('select status from friends where (fromFriendID="' + friendInfoJson.fromFriendID + '" and toFriendID="' + friendInfoJson.toFriendID + '") or (fromFriendID="' + friendInfoJson.toFriendID + '" and toFriendID="' + friendInfoJson.fromFriendID + '")',function(err,result){
    if (!err) {
      console.log(result);
      
      callback(null, result[0].status);
    }
    else {
      callback(err, null);
    }
  });
};

// model function exports
module.exports.setFriendStatus = setFriendStatus;

module.exports.getFriendsWithStatus = getFriendsWithStatus;

module.exports.getAllFriends = getAllFriends;

module.exports.getFriendsStatus = getFriendsStatus;

module.exports.deleteFriend = deleteFriend;