// This file can be used by all models!!!
// Or, SQLs for just one table!!
// just write this statement on top of the model file:
// var ops = require('./sc-ops')

// It describes some simple, common operations, like:
// - `insert`, `select`, `update` & `delete` - simple CRUD
// - check if some key values are existed
// ...

var db = require('../db');

exports.db = db; // for using the same file `db.js` as required in this file
exports.on = db.on; // a shortcut to get a db connection for running manual sqls
exports.format = db.format; // for manual sql formatting
exports.stampID = db.stampID; // for `insert` sqls
exports.stampUpdate = db.stampUpdate; // for `update` sqls
exports.colMockup = colMockup;
exports.transformObj = transformObj;

exports.mapModel = function(form_data) {
  // models should have some kind of this function
  // for mapping request body data to correct table's columns
  // excluding: `id`, `datecreated` & `datemodified`
  // It should be like:
  // return {
  //   col_one: form_data.fld_one,
  //   col_two: form_data.fld_two,
  //   ...
  // }
}

exports.insert = function(table, data, done) {
  // data is an object with:
  // - keys equivalent to table's columns
  // - values as new ones for the record
  var stmt = "INSERT INTO ?? SET ?";
  data = db.stampID(data); // this adds `id`, `datecreated` & `datemodified`
  db.on().query(stmt, [table, data], done);
}

exports.select = function(table, cols, done) {
  // simple `select` sql from one table with available columns
  var id_cols = exports.colMockup(cols);
  var stmt = `SELECT ${id_cols} FROM ??`;
  var values = cols.concat([table]);
  db.on().query(stmt, values, done);
}

exports.selectById = function(table, rec_id, cols, done) {
  // select a single record with `id` matched `rec_id`
  var id_cols = exports.colMockup(cols);
  var stmt = `SELECT ${id_cols} FROM ?? WHERE \`id\` = ?`;
  var values = cols.concat([table, rec_id]);
  db.on().query(stmt, values, done);
}

exports.update = function(table, rec_id, newVals, done) {
  // use only `id` as the condition to set new values (aka `newVals`)
  // `newVals` is an object with:
  // - keys equivalent to table's columns
  // - values as new ones for the record

  var avaiVals = db.stampUpdate({});
  // just get "actual" values
  // (not undefined, or an empty string...)
  for (var k in newVals) {
    if (typeof newVals[k] !== 'undefined') {
      if (String(newVals[k]).trim() !== '')
        avaiVals[k] = newVals[k];
    }
  }

  var stmt = "UPDATE ?? SET ? WHERE `id` = ?";
  db.on().query(stmt, [table, avaiVals, rec_id], done);
}

exports.delete = function(table, rec_id, done) {
  // delete the record that has `id` matched `rec_id`
  var stmt = "DELETE FROM ?? WHERE `id` = ?";
  db.on().query(stmt, [table, rec_id], done);
}

exports.deleteBy = function(table, conditions, done) {
  // delete when all conditions are met
  // `conditions` is an object with keys of actual columns
  if (Object.keys(conditions).length < 1)
    // don't do if there's no condition
    return done(new Error('NO CONDITION available!'));

  var where = transformObj(conditions);

  var stmt = "DELETE FROM ?? WHERE " + where.equals.join(' AND ');
  var values = [table].concat(where.values);
  db.on().query(stmt, values, done);
}

exports.check = function(table, keyVals, done) {
  // can be seen as get an id list of records matched `keyVals`

  if (Object.keys(keyVals).length < 1)
    return done(new Error('NO KEY VALUE presented!'));

  // `keyVals` is an object with:
  // - keys equivalent to table's key columns
  // - values for filtering

  var stmt = "SELECT `id` FROM ??";
  var where = transformObj(keyVals);
  var values = [table].concat(where.values);

  stmt = `${stmt} WHERE ${where.equals.join(' OR ')}`;
  db.on().query(stmt, values, done);
}

// some helper functions for sqls

function colString(prefix) {
  if ( typeof prefix !== 'undefined' )
  // prefix used for one table in `select` sql with joins
    if ( prefix.lastIndexOf('.') !== (prefix.length-1) )
      prefix += '.';

  return (prefix || '') + '??';
}

function colMockup(cols, prefix) {
  // for constructing arbitrary number of selected columns

  // just for getting the number of columns
  var cols_length = Array.isArray(cols) ? cols.length : cols;
  // maybe `cols` is s/th else than an array / a number, right?!
  cols_length = parseInt(cols_length) || 0;

  var colstr = colString(prefix) + ',';
  // zero length means all available columns of table
  var id_cols = cols_length < 1 ? '*'
    : colstr.repeat(cols_length).slice(0, -1);
  return id_cols;
}

function transformObj(valObj, prefix) {
  // transform object to proper data to be used in `where` clause
  // the 'proper data' here is 2 arrays
  // - one 4 mockups of <col> = <value> or '?? = ?'; and
  // - one 4 actual used values: key-value pairs in `valObj`
  var eqlstr = colString(prefix) + ' = ?';
  var transformed = { values: [], equals: [] };

  // simple loop
  for (var k in valObj) {
    // can this be more efficient?
    transformed.equals.push(eqlstr);
    transformed.values.push(k, valObj[k]);
  }

  return transformed;
}
