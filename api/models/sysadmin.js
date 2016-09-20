var async = require('async');
var ops = require('./sc-ops');
var table = 'security_user';

// centerize what will be exported
exports.mapModel = mapModel;
exports.create = create;
exports.retrieve = retrieve;
exports.findById = findById;
exports.update = update;
exports.remove = remove;
exports.ifExisted = ifExisted;


// actual SQL queries

function mapModel (form) {
  var fullnm = (form.usr_firstnm || '')+ ' ' +(form.usr_lastnm || '');
  // map the submitted form to available columns' name
  return {
    login_id: form.usr_acc,
    password: form.usr_pwd,
    display_name: form.usr_name || fullnm.trim(),
    email_address: form.usr_email,
    active: form.usr_active
  }
}
function availableCols(has_id, times) {
  // available fields (columns' name) of this table
  // - `with_id` to include `id`
  // - `times` to include `datecreated` & `datemodified`
  var fields = Object.keys( mapModel({}) );
  // equals:
  // [ 'display_name', 'email_address', 'active',
  //   'login_id', 'password' ]

  // evaluate parameters to boolean values
  // according to boolean rules of javascript
  if (!!has_id) fields.push('id');
  if (!!times) fields.push('datecreated', 'datemodified');

  return fields;
}
function retrieve (done) {
  var cols = availableCols(true, 'stamps');
  ops.select(table, cols, done);
}
function findById (suId, done) {
  var cols = availableCols(null, 'stamps');
  ops.selectById(table, suId, cols, done);
}
function ifExisted (mappedKeys, done) {
  // `mappedKeys` means key values of actual columns

  // the error that could be raised from this process
  var existed = new Error("Account or Email is EXISTED!");

  var key_vals = {
    // just get only 2 keys for now
    email_address: mappedKeys.email_address,
    login_id: mappedKeys.login_id
  }

  ops.check(table, key_vals,
    function (err, rows) {
      console.log(rows);
      if (err || rows.length > 0) err = existed;
      done(err, rows);
    }
  );
}
function create (mappedForm, done) {
  // this type of user affects ONLY ONE table,
  // so there'll be simple processes,
  // and no need of separated services
  async.waterfall([
    async.apply(checkExistence, mappedForm),
    createAccount
  ], done);

  // step 1
  function checkExistence (data, callback) {
    ifExisted(data,
      function(err, rows) { callback(err, data); })
  }
  // step 2
  function createAccount (data, callback) {
    // default status of a new account is inactive
    data.active = data.active || 0;
    // raise this by assuming:
    // - there's some database error; or
    // - cannot insert a new record
    var failed = new Error('CANNOT CREATE this user!');

    ops.insert(
      table, data,
      function (err, result) {
        if (err || result.affectedRows < 1) err = failed;
        callback(err, result);
      }
    );
  }

}
function update (suId, newVals, done) {
  async.waterfall([
    async.apply(checkExistence, suId, newVals),
    updateAccount
  ], done);

  // step 1
  function checkExistence (sysuser_id, data, callback) {
    ifExisted(data,
      function(err, rows) { callback(err, sysuser_id, data); })
  }
  // step 2
  function updateAccount (sysuser_id, data, callback) {
    // some database errors could happens & interrupt the execution
    var failed = new Error('CANNOT UPDATE this user!');
    ops.update(
      table, sysuser_id, data,
      function (err, result) {
        if (err || result.affectedRows < 1) err = failed;
        callback(err, result);
      }
    );
  }
}

function remove (suId, done) {
  // again, ONLY some database error could happen??
  var failed = new Error('CANNOT DELETE this user!');
  ops.delete(table, suId,
    function (err, result) {
      if (err || result.affectedRows < 1) err = failed;
      done(err, result);
    }
  );
}
