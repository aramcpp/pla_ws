// Here goes the REST API for the PlayLand Armenia

// loading dependencies
var express = require('express');
var service = express.Router();

/*
 * @service:    IWantToJoin
 * @desc:       registers the cat
 * @type:       POST
 * @params:     JSON formatted user info
 * @return:     { "YouCanJoin": "[1,0]" }
 */
service.post('/IWantToJoin', function(req, res, next) {
  res.send({ "YouCanJoin": "1" });
});

module.exports = service;
