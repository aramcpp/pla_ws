// loading dependencies
var mysql = require("../libs/mysql");
var uuid = require("node-uuid");

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

var addUser = function(userInfoJson, callback) {
    // connect to db
  mysql.getConnection(function(err, connection){
    if (err) {
      connection.release();
      console.log('error');
      callback(null, 0);
    }

    console.log('connected as id ' + connection.threadId);
        
    // make a request
    connection.query('select * from users where username="' + userInfoJson.userName + '"',function(err,result){
      if(!err) {
        if (result.length>0) {
          connection.release();
          callback(null, 0);
        }
        else {
          // insert into mysql
          var queryJson = userInfoJson;
          
          queryJson.userid = uuid.v4();
          
          console.log(queryJson.userid + '", "' + queryJson.userName + '", "' + queryJson.password + '", "' + queryJson.parentEMail + '", "' + queryJson.birthday + '", "' + queryJson.avatar + '", "' + queryJson.myLanguage + '", "' + queryJson.secondLanguage + '")');
          
          connection.query('insert into users values("' + queryJson.userid + '", "' + queryJson.username + '", "' + queryJson.password + '", "' + queryJson.parentEMail + '", "' + queryJson.birthday + '", "' + queryJson.avatar + '", "' + queryJson.myLanguage + '", "' + queryJson.secondLanguage + '")', function(err, result){
            if (!err) {
              // insert user into actions table
              connection.query('insert into actions values("' + queryJson.userid + '", "0", NULL, NULL)', function(err, result){
                if (!err) {
                  connection.release();
                }
              });
              
              console.log('11');
              
              callback(null, 1);
            }
          });
        }
      }
      else {
        connection.release();
        callback(null, 0);
      }
    });

    connection.on('error', function(err) {
      //console.log(err.stack);
      callback(err, 0);
    });
  });
};

var checkUserByName = function(username, callback) {
  // make a request
  makeRequest('select * from users where username="' + username + '"',function(err,result){
    if(!err) {
      console.log(result);
      
      if (result.length>0) {
        callback(null, 1);
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

var checkUserByID = function(userid, callback) {
    // connect to db
  mysql.getConnection(function(err, connection){
    if (err) {
      connection.release();
      console.log('error');
      callback(null, 0);
    }

    console.log('connected as id ' + connection.threadId);
        
    // make a request
    connection.query('select * from users where userid="' + userid + '"',function(err,result){
      if(!err) {
        if (result.length>0) {
          callback(null, 1);
        }
        else {
          callback(null, 0);
        }
      }
      else {
        connection.release();
        callback(err, null);
      }
    });

    connection.on('error', function(err) {
      //console.log(err.stack);
      callback(err, 0);
    });
  });
};

// model function exports
module.exports.addUser = addUser;

module.exports.checkUserByName = checkUserByName;

module.exports.checkUserByID = checkUserByID;