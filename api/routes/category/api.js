var router = require('express').Router();
var dal = require('./dal');

router.route('/list')
  .get(function(req, res) {
    dal.pricings(function(err, rows) {
      var list = [];
      if (err) { console.log(err.stack); }
      else {
        console.log("Result:", rows);
        list = rows;
      }
      res.json(list);
    })
  });

router.route('/new')
  .post(function(req, res) {
    var apires = { error: null, token: 0 };
    var objCate = dal.mapModel({categoryName: 'CRM'});
    dal.create(objCate, function(err, rows) {
      if (err) {
        console.log(err.stack);
        apires.error = err.message;
      } else {
        console.log("Result:", rows);
        apires.token = rows.affectedRows;
      }
      res.send(apires);
    })
  })

module.exports = router;
