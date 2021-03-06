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
      console.log('error: ' + err.stack);
      connection.release();
      callback(err, null);
    }
    
    // make a request
    connection.query(request,function(err,result){
      connection.release();
      callback(err, result);
    });

    connection.on('error', function(err) {
      console.log(err.stack);
      
      callback(err, null);
    });
  });
};

/*
 * @function: addUser
 * @desc:     adds user to db
 * @params:   JSON formatted userinfo and callback function
 * @callback: error and result
 * @author:   Aram (aramcpp@gmail.com)
 */
var addUser = function(userInfoJson, callback) {
  // check whether user exists or not
  checkUserByName(userInfoJson.username, function(err, result){
    if (!err) {
      if (result == 1) {
        callback(null, 0);
      }
      else {
        var queryJson = userInfoJson;
        
        // send requst to add user
        makeRequest('insert into users values("' + queryJson.userid + '", "' + queryJson.username + '", "' + queryJson.password + '", "' + queryJson.parentEMail + '", "' + queryJson.birthday + '", "' + queryJson.avatar + '", "' + queryJson.myLanguage + '", "' + queryJson.secondLanguage + '")', function(err, result){
            if (!err) {
              // insert user into actions table
              makeRequest('insert into actions values("' + queryJson.userid + '", "0", NULL, NULL)', function(err, result){
                // add some error handling here
                if (err) {
                  console.log(err.stack);
                  callback(null, 0);
                }
              });
              
              callback(null, 1);
            }
            else {
              callback(null, 0);
            }
          });
      }
    }
    else {
      callback(err, null);
    }
  });
};

/*
 * @function: checkUserPassword
 * @desc:     check if the login and password match
 * @params:   JSON formatted username and password, callback function
 * @callback: error and result
 * @author:   Aram (aramcpp@gmail.com)
 */
var checkUserPassword = function(userInfoJson, callback) {
  // make a request
  makeRequest('select userid from users where username="' + userInfoJson.username + '" and password="' + userInfoJson.password + '"',function(err,result){
    if(!err) {
      if (result.length>0) {
        callback(null, result[0].userid);
      }
      else {
        callback(null, 0);
      }
    }
    else {
      callback(err, null);
    }
  });
};

/*
 * @function: checkUserByName
 * @desc:     checks whether user with the given name exists or not
 * @params:   username and callback function
 * @callback: error and result
 * @author:   Aram (aramcpp@gmail.com)
 */
var checkUserByName = function(username, callback) {
  // make a request
  makeRequest('select * from users where username="' + username + '"',function(err,result){
    if(!err) {
      if (result.length>0) {
        callback(null, result[0].userid);
      }
      else {
        callback(null, 0);
      }
    }
    else {
      callback(err, null);
    }
  });
};

/*
 * @function: checkUserByName
 * @desc:     checks whether user with the given id exists or not
 * @params:   userid and callback function
 * @callback: error and result
 * @author:   Aram (aramcpp@gmail.com)
 */
var checkUserByID = function(userid, callback) {
  // make a request
  makeRequest('select * from users where userid="' + userid + '"',function(err,result){
    if(!err) {
      if (result.length>0) {
        callback(null, result[0].userid);
      }
      else {
        callback(null, 0);
      }
    }
    else {
      callback(err, null);
    }
  });
};

/*
 * @function: getUserInfo
 * @desc:     gets the user info, if the field is specified only info about that field
 * @params:   userid, field and callback function (if the field is * returns all)
 * @callback: error and result
 * @author:   Aram (aramcpp@gmail.com)
 */
var getUserInfo = function(userid, field, callback) {
  // make a request
  makeRequest('select ' + field + ' from users where userid="' + userid + '"',function(err,result){
    if(!err) {
      if (result.length>0) {
        callback(null, result[0]);
      }
      else {
        callback(null, 0);
      }
    }
    else {
      callback(err, null);
    }
  });
};

// model function exports
module.exports.addUser = addUser;

module.exports.checkUserByName = checkUserByName;

module.exports.checkUserByID = checkUserByID;

module.exports.checkUserPassword = checkUserPassword;

module.exports.getUserInfo = getUserInfo;