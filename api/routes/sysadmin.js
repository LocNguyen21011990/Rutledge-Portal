var sysadmin = require('../models/sysadmin');
var router = require('express').Router();

router.get('/list', function(req, res) {
  sysadmin.retrieve(function(err, result) {
    var list = [];
    if (err) console.log("Error:", err.message);
    if (!err) {
      console.log("Result:", result);
      list = result;
    }
    res.json(list);
  })
})

router.post('/new', function(req, res) {
  var apires = { error: null, token: 0 };
  // if an empty form is submitted...
  if (Object.keys(req.body).length < 1) return res.json(apires)
  // else execute the inserting...
  var newInfo = sysadmin.mapModel(req.body);
  sysadmin.create(newInfo, function(err, result) {
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
});

router.route('/:id')
  .put(function(req, res) {
    var apires = { error: null, token: 0 };
    // if an empty form is submitted...
    if (Object.keys(req.body).length < 1) return res.json(apires)
    // else execute the updating...
    var newInfo = sysadmin.mapModel(req.body);
    sysadmin.update(req.params.id, newInfo, function(err, result) {
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

  .get(function(req, res) {
    sysadmin.findById(req.params.id, function(err, rows) {
      var record = {};
      if (err) console.log("Error:", err.message);
      if (!err) {
        console.log("Result:", rows[0]);
        record = rows[0] || {};
      }
      res.json(record);
    })
  })

  .delete(function(req, res) {
    var apires = { error: null, token: 0 };
    sysadmin.remove(req.params.id, function(err, result) {
      if (err) {
        console.log("Error:", err.message);
        apires.error = err.message;
      }
      if (!err) {
        console.log("Result:", result);
        apires.token = result.affectedRows;
      }
      res.json(apires);
    })
  });

module.exports = router;
