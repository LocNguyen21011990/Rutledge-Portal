var ops = require('./sc-ops');
var table = 'pricing';

exports.mapModel = function(form) {
  return {
    name: form.pp_name,
    price: form.pp_price,
    content: form.pp_content
  }
}

exports.create = function(mappedForm, done) {
  ops.insert(table, mappedForm, function(err, result) {
    if (err || result.affectedRows < 1)
      err = new Error('CANNOT CREATE this pricing!');
    done(err, result);
  });
}

exports.list = function(done, no_cnt) {
  var cols = ['name', 'price', 'content'];
  if (!!no_cnt) cols.pop();
  ops.select(table, cols, done);
}

exports.delete = function(prc_id, done) { ops.delete(table, prc_id, done) }

// This part is for service - pricing relations
var srv_prc_reltn = 'service_pricing';

exports.getRelation = function(prc_id, done) {
  ops.check(usr_tnt_reltn,
    { pricing: prc_id },
    function(err, rows) {
      if (err || rows.length < 1)
        err = new Error("This pricing plan is NOT EXISTED!")
      done(err, rows)
    }
  );
}

exports.removeRelation = function(rel_id, done) {
  ops.delete(srv_prc_reltn, rel_id, done)
}
