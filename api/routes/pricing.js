var router = require('express').Router();
var serv = require('../models/services/pricingService');
var pricing = require('../models/pricing');

router.get('/service/:id', function(req, res) {
  serv.availablePrices(req.params.id,
    function(err, result) {
      var list = {};
      if (err) console.log(err.message);
      if (!err) {
        console.log("Result:", result);
        list = result;
      }
      res.json(list);
    }
  );
});

router.get('/list', function(req, res) {
  pricing.list(function(err, rows) {
    var list = [];
    if (err) console.log(err.message);
    if (!err) {
      console.log("Result:", rows);
      list = rows;
    }
    res.json(list);
  }, (req.query.content == 'false'))
})

router.post('/new', function(req, res) {
  var apires = { error: null, token: 0 };
  var newInfo = pricing.mapModel(req.body);
  pricing.create(newInfo, function(err, result) {
    if (err) {
      console.log("Error:", err.message);
      apires.error = err.message;
    }
    if (!err) {
      console.log("Result:", result);
      apires.token = result.affectedRows;
    }
    res.send(apires);
  })
})

router.route('/:id')
  .delete(function(req, res) {
    var apires = { error: null, token: 0 };
    serv.removePricing(req.params.id, function(err, result) {
      if (err) {
        console.log("Error:", err.message);
        apires.message = err.message;
      }
      if (!err) {
        console.log("Result:", result);
        apires.token = result.affectedRows;
      }
      res.json(apires);
    })
  });

module.exports = router;
