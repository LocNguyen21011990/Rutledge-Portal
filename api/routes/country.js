var router = require('express').Router();
var country = require('../models/country');

router.get('/list', function(req, res) {
  country.all(function(err, rows) {
    var list = [];
    if (err) console.log(err.message);
    if (!err) {
      console.log("Result:", rows);
      list = rows;
    }
    res.json(list);
  })
});

module.exports = router;
