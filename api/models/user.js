var ops = require('./sc-ops');
var table = 'user';

exports.mapModel = function(form) {
  return {
    login_id: form.usr_acc,
    password: form.usr_pwd,
    display_name: form.usr_name || `${form.usr_firstnm || ''} ${form.usr_lastnm || ''}`,
    email_address: form.usr_email,
    active: form.usr_active
  }
}

exports.create = function(mappedForm, done) {
  mappedForm.active = mappedForm.active || 0;
  ops.insert(table, mappedForm,
    function (err, result) {
      if (err || result.affectedRows < 1)
        err = new Error('CANNOT CREATE this user!');
      done(err, result);
    }
  );
}

exports.update = function(usr_id, newVals, done) {
  ops.update(table, usr_id, newVals,
    function (err, result) {
      if (err || result.affectedRows < 1)
        err = new Error('CANNOT UPDATE this user!');
      done(err, result);
    }
  );
}

exports.delete = function(usr_id, done) {
  ops.delete(table, usr_id,
    function (err, result) {
      if (err || result.affectedRows < 1)
        err = new Error('CANNOT DELETE this user!');
      done(err, result);
    }
  );
}

exports.ifExisted = function(mappedKeys, done) {
  // `mappedKeys` means key values of actual columns
  var key_vals = {
    email_address: mappedKeys.email_address,
    login_id: mappedKeys.login_id
  }

  ops.check(table, key_vals,
    function (err, rows) {
      if (err || rows.length > 0)
        err = new Error("Account or Email is EXISTED!");
      done(err, rows);
    }
  );
}

exports.checkEmail = function(email, done) {
  ops.check(table, { email_address: email },
    function(err, rows) {
      if (err || rows.length < 1)
        err = new Error("This email DOESN'T EXISTED!")
      done(err, rows);
    }
  );
}

// This part is for user - tenant relations
var usr_tnt_reltn = 'user_tenant';

exports.getRelation = function(usr_id, done) {
  ops.check(usr_tnt_reltn, { user: usr_id },
    function (err, rows) {
      if (err || rows.length < 1)
        err = new Error("This user is NOT EXISTED!")
      done(err, rows);
    }
  )
}

exports.removeRelation = function(rel_id, done) {
  ops.delete(usr_tnt_reltn, rel_id,
    function (err, result){
      if (err || result.affectedRows < 1)
        err = new Error('This user is NOT BELONGED to any company');
      done(err, result);
    }
  )
}

exports.connectTenant = function(usr_tnt_ids, done) {
  usr_tnt_ids = ops.stampID(usr_tnt_ids);
  console.log(usr_tnt_ids);
  ops.insert(usr_tnt_reltn, usr_tnt_ids,
    function (err, result) {
      if (err || result.affectedRows < 1)
        err = new Error('CANNOT ADD this user to the company!');
      done(err, result);
    }
  );
}
