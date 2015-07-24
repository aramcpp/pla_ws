// Here goes the REST API for the PlayLand Armenia

// loading dependencies
var express = require('express');
var service = express.Router();
var mysql   = require("../libs/mysql");
var uuid = require("node-uuid");


/*
 * @service:  IWantToJoin
 * @desc:     registers the cat
 * @type:     POST
 * @params:   JSON formatted user info
 * @response: { "YouCanJoin": "1|0" }
 */
service.post('/IWantToJoin', function(req, res, next) {
  // connect to db
  mysql.getConnection(function(err, connection){
    if (err) {
      connection.release();
      console.log('error');
      res.json({"code" : 100, "status" : "Error in connection database"});
      return;
    }

    console.log('connected as id ' + connection.threadId);
        
    // make a request
    connection.query("select * from users where username='" + req.body.username + "'",function(err,result){
      if(!err) {
        if (result.length>0)
        {
          connection.release();
          res.json({ "YouCanJoin": "0" });
        }
        else
        {
          // insert into mysql
          var queryJson = req.body;
          
          queryJson.userid = uuid.v4();
          
          console.log(JSON.stringify(queryJson));
          
          var query = connection.query('insert into users set ? ', queryJson, function(err, result){
            if (!err)
            {
              res.json(result);
            }
          });
        }
      }
      else
      {
        connection.release();
      }
    });

    connection.on('error', function(err) {      
      res.json({"code" : 100, "status" : err.stack});
      return;     
    });
  });
});

/*
 * @service:  IWantToPlay
 * @desc:     logins the cat
 * @type:     POST
 * @params:   JSON formatted user info
 * @response: { "YouCanPlay": "1|0" }
 */
service.post('/IWantToPlay', function(req, res, next) {
  // just for test
  // TODO
  //    add code
  res.json({"YouCanPlay": "1"});
});

/*
 * @service:  IWantToVisit
 * @desc:     changes the cat area
 * @type:     POST
 * @params:   JSON formatted user info and areaid
 * @response: returns the cat states for all the cats in current area
 */
service.post('/IWantToVisit', function(req, res, next) {
  // just for test
  // TODO
  //    add code
  res.json(/* here goes the response */);
});

module.exports = service;