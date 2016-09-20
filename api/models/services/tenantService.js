var async = require('async');
var model = {
  Tenant: require('../tenant'),
  User: require('../user')
};

exports.mapModels = function(form) {
  return {
    tenant: model.Tenant.mapModel(form),
    user: model.User.mapModel(form)
  }
}

exports.registerTenant = function(newData, done) {
  if (!( ('tenant' in newData) && ('user' in newData) ))
    newData = exports.mapModels(newData);

  async.waterfall([
    async.apply(checkUser, newData), checkTenant,
    createTenant, createUser, addUser
  ], done)

  function checkUser(data, cb) {
    model.User.ifExisted(data.user,
      function(err, rows) { cb(err, data); });
  }

  function checkTenant(data, cb) {
    model.Tenant.ifExisted(data.tenant,
      function(err, rows) { cb(err, data); });
  }

  function createTenant(data, cb) {
    model.Tenant.create(data.tenant,
      function(err, rows) { cb(err, data, rows); });
  }

  function createUser(data, result, cb) {
    model.User.create(data.user,
      function(err, rows) { cb(err, data, rows); });
  }

  function addUser(data, result, cb) {
    console.log(data);
    var ids = { user: data.user.id, tenant: data.tenant.id };
    model.User.connectTenant(ids,
      function(err, rows) { cb(err, rows); });
  }

}
