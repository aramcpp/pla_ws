// Here goes the REST API for the PlayLand Armenia

// loading dependencies
var express = require('express');
var service = express.Router();

/*
 * @service:  IWantToJoin
 * @desc:     registers the cat
 * @type:     POST
 * @params:   JSON formatted user info
 * @response: { "YouCanJoin": "1|0" }
 */
service.post('/IWantToJoin', function(req, res, next) {
  // just for test
  // TODO
  //    add code
  res.send({"YouCanJoin": "1"});
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
  res.send({"YouCanPlay": "1"});
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
  res.send(/* here goes the response */);
});

module.exports = service;
