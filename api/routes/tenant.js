var tenant = require('../models/tenant');
var serv = require('../models/services/tenantService');
var router = require('express').Router();

router.post('/new', function(req, res) {
  var apires = { error: null, token: 0 };
  serv.registerTenant(req.body, function(err, result) {
    if (err) {
      console.log("Error:",err.message);
      apires.error = "Cannot register a new tenant!";
    }
    if (!err) {
      console.log("Result:", result);
      apires.token += 1;
    }
    res.send(apires);
  })
});

router.get('/list', function(req, res) {
  tenant.list(function(err, rows) {
    var list = [];
    if (err) console.log("Error:", err.message);
    if (!err) {
      console.log("Result:", rows);
      list = rows;
    }
    res.json(list);
  }, (req.query.short == 'true'))
});

module.exports = router;
