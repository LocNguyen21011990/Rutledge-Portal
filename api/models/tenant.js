var ops = require('./sc-ops');
var table = 'tenant';

exports.mapModel = function(form) {
  return {
    company_name: form.cpn_name,
    title: form.cpn_title,
    job_title: form.cpn_job,
    first_name: form.cpn_firstnm || '',
    last_name: form.cpn_lastnm || '',
    email_address: form.cpn_email,
    telephone: form.cpn_phone,
    address_1: form.cpn_addr1,
    address_2: form.cpn_addr2 || form.cpn_addr1,
    country: form.cpn_country,
    county: form.cpn_county,
    town: form.cpn_town,
    zip_code: form.cpn_zipcode
  }
}

exports.list = function(done, reduce) {
  var cols = !reduce ? []
    : ['id', 'company_name'];
  ops.select(table, cols, done);
}

exports.create = function(mappedForm, done) {
  ops.insert(table, mappedForm, function(err, result) {
    if (err || result.affectedRows < 1)
      err = new Error('CANNOT CREATE this new company!');
    done(err, result);
  });
};

exports.ifExisted = function(mappedKeys, done) {
  var key_vals = {
    email_address: mappedKeys.email_address,
    telephone: mappedKeys.telephone
  }

  ops.check(table, key_vals, function(err, rows){
    if (err || rows.length > 0)
      err = new Error("Email or Phone has been USED!");
    done(err, rows);
  });
}
