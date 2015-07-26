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
      res.json({"status" : "Error: cant connect to db"});
      return;
    }

    console.log('connected as id ' + connection.threadId);
        
    // make a request
    connection.query('select * from users where username="' + req.body.username + '"',function(err,result){
      if(!err) {
        if (result.length>0) {
          connection.release();
          res.json({ "YouCanJoin": "0" });
        }
        else {
          // insert into mysql
          var queryJson = req.body;
          
          queryJson.userid = uuid.v4();
          
          console.log(JSON.stringify(queryJson));
          
          connection.query('insert into users set ? ', queryJson, function(err, result){
            if (!err) {
              connection.release();
              res.json(result);
              
              // insert user into actions table
              connection.query('insert into actions values("' + queryJson.userid + '", "0", NULL, NULL)', function(err, result){
                if (!err) {
                  connection.release();
                  res.json(result);
                }
              });
            }
          });
        }
      }
      else {
        connection.release();
        res.json({"status" : err.stack});
      }
    });

    connection.on('error', function(err) {      
      res.json({"status" : err.stack});
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
  // connect to db
  mysql.getConnection(function(err, connection){
    if (err) {
      connection.release();
      console.log('error');
      res.json({"status" : "Error: cant connect to db"});
      return;
    }

    console.log('connected as id ' + connection.threadId);
        
    // make a request
    connection.query('select * from users where username="' + req.body.username + '"',function(err,result){
      if(!err) {
        if (result.length>0) {
          connection.release();
          res.json({ "YouCanPlay": "1" });
        }
        else {
          connection.release();
          res.json({ "YouCanPlay": "0" });
        }
      }
      else {
        connection.release();
        res.json({"status" : err.stack});
      }
    });

    connection.on('error', function(err) {      
      res.json({"status" : err.stack});
      return;     
    });
  });
});

/*
 * @service:  IWantToVisit
 * @desc:     changes the cat area
 * @type:     POST
 * @params:   JSON formatted user info and areaid
 * @response: returns the cat states for all the cats in current area
 */
service.post('/IWantToVisit', function(req, res, next) {
  // connect to db
  mysql.getConnection(function(err, connection){
    if (err) {
      connection.release();
      console.log('error');
      res.json({"status" : "Error: cant connect to db"});
      return;
    }

    console.log('connected as id ' + connection.threadId);
    
    // make a request
    connection.query('update actions set areaid = "' + req.body.areaid + '" where userid = "' + req.body.userid + '"',function(err,result){
      if (!err) {
        /*
         * TODO
         * add WhatIsGoingOn service, and add its output after this services response
         */
        res.json({ "YouCanVisit": "1" });
      }
      else {
        res.json({ "YouCanVisit": "0" });
      }
    });

    connection.on('error', function(err) {      
      res.json({"status" : err.stack});
      return;     
    });
  });
});

// just to avoid 404, will implement other services later
service.post('/*', function(req, res, next) {
  res.json({ "status": "under development" });
});

module.exports = service;