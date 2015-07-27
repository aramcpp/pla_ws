// loading dependencies
var mysql = require("../libs/mysql");
var uuid = require("node-uuid");


var addUser = function(userInfoJson, callback) {
    // connect to db
  mysql.getConnection(function(err, connection){
    if (err) {
      connection.release();
      console.log('error');
      return 0;
    }

    console.log('connected as id ' + connection.threadId);
        
    // make a request
    connection.query('select * from users where username="' + userInfoJson.username + '"',function(err,result){
      if(!err) {
        if (result.length>0) {
          connection.release();
          return 0;
        }
        else {
          // insert into mysql
          var queryJson = userInfoJson;
          
          queryJson.userid = uuid.v4();
          
          connection.query('insert into users values("' + queryJson.userid + '", "' + queryJson.username + '", "' + queryJson.password + '", "' + queryJson.parentEMail + '", "' + queryJson.birthday + '", "' + queryJson.avatar + '", "' + queryJson.myLanguage + '", "' + queryJson.secondLanguage + '")', function(err, result){
            if (!err) {
              // insert user into actions table
              connection.query('insert into actions values("' + queryJson.userid + '", "0", NULL, NULL)', function(err, result){
                if (!err) {
                  connection.release();
                  return 1;
                }
              });
            }
          });
        }
      }
      else {
        connection.release();
        return 0;
      }
    });

    connection.on('error', function(err) {
      console.log(err.stack);
      return 0;
    });
  });
};


module.exports.addUser = addUser;