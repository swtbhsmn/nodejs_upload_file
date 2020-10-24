var express = require('express');
const fs = require('fs');
const path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.end(JSON.stringify(["Swetabh","Suman"]));
});

module.exports = router;
