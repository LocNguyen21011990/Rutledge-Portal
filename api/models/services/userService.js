var async = require('async');
var ops = require('../sc-ops');
var model = {
  User: require('../user')
};

exports.mapInfos = function(form) {
  return {
    user: model.User.mapModel(form),
    tenant_id: form.company
  }
}

exports.login = function(acc, pwd, done) {
  // simple login for now
  // check if this account is existed and connected to some tenant

  var failed = new Error('Account or Password is not correct!');
  if (!(acc && pwd)) return done(failed);

  var stmt = "SELECT ut.?? FROM ?? AS ut JOIN ?? AS usr";
  stmt = `${stmt} WHERE ut.?? = usr.?? AND usr.?? = ? AND usr.?? = ?`
  var values = ["id", "user_tenant", "user", "user", "id", "login_id", acc, "password", pwd];
  ops.on().query(stmt, values, function(err, rows) {
    if (rows.length < 1) err = err || failed;
    done(err, rows)
  });
}

exports.fullInfos = function(user_id, done) {
  if (user_id instanceof Function) {
    // the `user_id` mays be provided or not
    done = user_id;
    user_id = null;
  }

  // all info needed from users along with companies they belonged to
  var user_infos = [
    'display_name',
    'login_id',
    'password',
    'email_address',
    'active',
    'datecreated',
    'datemodified'
  ];

  var id_cols = ops.colMockup(user_infos, 'u');
  // want just one record or more ?!
  var just_one = !user_id ? ''
    : (function(){
      user_infos.push(user_id);
      return " AND mid.`user` = ?";
    })();
  // using sub-selection for joining with the `user` table
  var stmt = "SELECT "+ id_cols +", ut.* FROM `user` u JOIN \
  (SELECT mid.`user`, mid.`tenant` FROM `user_tenant` mid \
    JOIN `tenant` t ON mid.`tenant` = t.`id` "+ just_one +" ) \
  AS ut ON ut.`user` = u.`id`";
  ops.on().query(stmt, user_infos, done);
}

exports.newUser = function(newData, done) {

  async.waterfall([
    async.apply(checkUser, newData),
    createUser, addUser
  ], done)

  function checkUser(data, callback) {
    model.User.ifExisted(data.user,
      function(err, rows) { callback(err, data); });
  }

  function createUser(data, callback) {
    model.User.create(data.user,
      function(err, rows) { callback(err, data); });
  }

  function addUser(data, callback) {
    var ids = { user: data.user.id, tenant: data.tenant_id };
    model.User.connectTenant(ids,
      function(err, rows) { callback(err, rows); });
  }

}

exports.editUser = function(user_id, newData, done) {

  async.waterfall([
    async.apply(checkData, user_id, newData),
    updateUser, updateRelation
  ], done);

  function checkData(user_id, data, callback) {
    model.User.ifExisted(data.user,
      function(err, rows) { callback(err, user_id, data); });
  }

  function updateUser (user_id, data, callback) {
    model.User.update(
      user_id, data.user,
      function(err, result) {
        callback(err, user_id, data.tenant_id, result);
      }
    )
  }

  function updateRelation(user_id, tenant_id, result, callback) {
    // if no company transferring
    if (!tenant_id) callback(null, result);
    else {
      var stmt = "UPDATE ?? SET `tenant` = ? WHERE `user` = ?";
      var vals = ['user_tenant', tenant_id, user_id];
      ops.on().query(stmt, vals,
        function (err, result) {
          if (err || result.affectedRows < 1)
          err = new Error('CANNOT CHANGE to this company!');
          callback(err, result);
        }
      );
    }
  }

}

exports.removeUser = function(user_id, done) {

  async.waterfall([
    async.apply(checkRelation, user_id),
    deleteUser, deleteRelation
  ], done);

  function checkRelation(user_id, callback) {
    model.User.getRelation(user_id,
      function(err, rows) {
        var rel_id = rows.length == 1 ? rows[0].id : undefined;
        callback(err, user_id, rel_id);
      }
    );
  }

  function deleteUser(user_id, rel_id, callback) {
    if (!rel_id)
    callback(new Error('There is some incorrect information!'));

    model.User.delete(user_id,
      function(err, result) { callback(err, user_id, rel_id); })
    }

    function deleteRelation(user_id, rel_id, callback) {
      model.User.removeRelation(rel_id,
        function(err, result) { callback(err, user_id); });
      }
    }
