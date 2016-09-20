var async = require('async');
var ops = require('../sc-ops');
var model = {
  Pricing: require('../pricing')
};

exports.availablePrices = function(serv_id, done) {
  // all available pricings
  async.parallel({
    service: getService,
    prices: getPrices,
    category: getCategory
  }, done)

  function getService(cb) {
    var infos = ['title', 'main_image', 'teaser', 'main_content', 'active'];
    ops.selectById(
      'services', serv_id, infos,
      function (err, rows) { cb(err, rows[0]); }
    )
  }
  function getPrices(cb) {
    var infos = ['id', 'name', 'price', 'content'];
    var stmt = "SELECT "+ ops.colMockup(infos, 'p') +
      " FROM `pricing` p JOIN `service_pricing` sp \
      ON sp.`pricing` = p.`id` AND sp.`service` = ?";
    infos.push(serv_id);
    ops.on().query(stmt, infos,
      function (err, rows) { cb(err, rows); }
    );
  }
  function getCategory(cb) {
    var infos = ['service_category', serv_id];
    var stmt  = "SELECT `category` AS `id` FROM ?? where `service` = ?";
    ops.on().query(stmt, infos, 
      function (err, rows) { cb(err, rows); }
    )
  }
}

exports.removePricing = function(prc_id, done) {
  async.waterfall([
    async.apply(checkRelation, { pricing: prc_id }),
    deletePricing, deleteRelation
  ], done);

  function checkRelation(data, cb) {
    model.Pricing.getRelation(data.pricing,
      function(err,rows) {
        data.relation = rows.length == 1 ? rows[0].id : null;
        cb(err, data);
      });
  }
  function deleteRelation(data, cb) {
    model.Pricing.removeRelation(data.relation,
      function(err, result) { cb(err, result); });
  }
  function deletePricing(data, db) {
    model.Pricing.delete(data.pricing,
      function(err, result) { cb(err, result); })
  }
}
