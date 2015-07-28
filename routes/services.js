// Here goes the REST API for the PlayLand Armenia

// loading dependencies
var express = require('express');
var service = express.Router();

// loading db models
var usersModel = require("../dbmodels/usersModel");
var actionsModel = require("../dbmodels/actionsModel");
var friendsModel = require("../dbmodels/friendsModel");

// Main Services

/*
 * @service:  IWantToJoin
 * @desc:     registers the cat
 * @type:     POST
 * @params:   JSON formatted user info
 * @response: { "YouCanJoin": "1|0" }
 */
service.post('/IWantToJoin', function(req, res, next) {
  // call model function
  usersModel.addUser(req.body, function(err, result){
    if (err) {
      console.log(err.stack);
    }
    else {
      // send corresponding response
      if (result == 1)
        res.send({ "YouCanJoin": "1" });
      else
        res.send({ "YouCanJoin": "0" });
    }
  });
});

/*
 * @service:  CanITakeThisName
 * @desc:     checks whether the cat is in use or not
 * @type:     POST
 * @params:   JSON formatted username
 * @response: { "YouCanTakeThisName": "1|0" }
 */
service.post('/CanITakeThisName', function(req, res, next) {
  // call model function
  usersModel.checkUserByName(req.body.username, function(err, result){
    if (err) {
      console.log(err.stack);
    }
    else {
      console.log(result);
      // send corresponding response
      if (result == 1)
        res.send({ "YouCanTakeThisName": "0" });
      else
        res.send({ "YouCanTakeThisName": "1" });
    }
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
  // call model function
  usersModel.checkUserPassword(req.body, function(err, result){
    if (err) {
      console.log(err.stack);
    }
    else {
      console.log(result);
      // send corresponding response
      if (result == 1)
        res.send({ "YouCanPlay": "0" });
      else
        res.send({ "YouCanPlay": "1" });
    }
  });
});

/*
 * @service:  IWantToVisit
 * @desc:     changes the cat area
 * @type:     POST
 * @params:   JSON formatted userid and areaid
 * @response: returns the cat states for all the cats in current area
 */
service.post('/IWantToVisit', function(req, res, next) {
  // creating a query JSON
  var queryJson = req.body;
  
  queryJson.action = '';
  
  queryJson.actionValue = '';
  
  // call model function
  actionsModel.setUserActions(queryJson, function(err, result){
    if (!err) {
      // call model function
      actionsModel.getAreaActions(req.body.areaid, function(err, result){
        if (!err) {
          var resJson = result;
          
          resJson.YouCanVisit = "1";
          
          res.send(resJson);
        }
        else {
          console.log(err.stack);
          
          res.send({"YouCanVisit": "0"});
        }
      });
    }
    else {
      console.log(err.stack);
      
      res.send({});
    }
  });
});

/*
 * @service:  WhatIsGoingOn
 * @desc:     show all the cat statuses in the given area
 * @type:     GET
 * @params:   JSON formatted areaid
 * @response: returns the cat states for all the cats in current area
 */
service.get('/WhatIsGoingOn', function(req, res, next) {
  // call model function
  actionsModel.getAreaActions(req.body.areaid, function(err, result){
    if (!err) {
      res.send(result);
    }
    else {
      console.log(err.stack);
      
      res.send({});
    }
  });
});

/*
 * @service:  WhatIAmDoing
 * @desc:     processes the current status of user
 * @type:     POST
 * @params:   JSON formatted action info
 * @response: returns the cat states for all the cats in current area
 */
service.post('/WhatIAmDoing', function(req, res, next) {
  // call model function
  actionsModel.setUserActions(req.body, function(err, result){
    if (!err) {
      // call model function
      actionsModel.getAreaActions(req.body.areaid, function(err, result){
        if (!err) {
          res.send(result);
        }
        else {
          console.log(err.stack);
          
          res.send({});
        }
      });
    }
    else {
      console.log(err.stack);
      
      res.send({});
    }
  });
});

// end - Main Services

// Friend Services

/*
 * @service:  IWantToBeFriend
 * @desc:     sends friend request
 * @type:     POST
 * @params:   JSON formatted userids
 * @response: returns {"YourWishSent": "1|0"}
 */
service.post('/IWantToBeFriend', function(req, res, next) {
  // create query
  var queryJson = req.body;
  
  queryJson.status = "pending";
  
  // call model function
  friendsModel.setFriendStatus(queryJson, function(err, result){
    if (!err) {
      res.send({"YourWishSent": "1"});
    }
    else {
      console.log(err.stack);
      
      res.send({"YourWishSent": "0"});
    }
  });
});

// end - Friend Services

// just to avoid 404, will implement other services later
service.post('/*', function(req, res, next) {
  res.json({ "status": "under development" });
});

module.exports = service;