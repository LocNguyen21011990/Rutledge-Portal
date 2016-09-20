var ops = require('./sc-ops');
var table = 'country';

exports.all = function(done) {
  var cols = ['id', 'name', 'country_code'];
  ops.select(table, cols, done);
}
