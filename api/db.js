var mysql = require("mysql");
var uuid = require('node-uuid');
var config = require("./config")["db_conn"];
var available_modes = Object.keys(config);
var state = { pool: null, mode: null };
process.env.DB_CONN = __filename;

exports.MODE_LOCAL = "local"
exports.MODE_DEV = "development"
exports.MODE_PROD = "production"

exports.format = mysql.format
exports.escape = mysql.escape

exports.connect = function(mode, done) {
  if (available_modes.indexOf(mode) < 0) {
    done(new Error(`Invalid Run Mode: ${mode}`));
  } else {

    config[mode].queryFormat = function(sql, values, timeZone) {
      sql = mysql.format(sql, values, false, timeZone);
      sql = sql.replace(/'NOW\(\)'/g, 'NOW()');
      console.log(`Executing SQL: ${sql}`);
      return sql;
    };

    state.mode = mode;
    state.pool = mysql.createPool(config[mode]);
    state.pool.getConnection(function(err, conn) {
      done(err);
      if(conn) conn.release();
    })

  }
}

exports.on = function() { return state.pool; }
exports.stampID = function(obj, wid) {
  obj.id = uuid.v4();
  obj.datecreated = "NOW()";
  obj = exports.stampUpdate(obj);
  return obj;
}
exports.stampUpdate = function(obj) {
  obj.datemodified = "NOW()";
  return obj;
}
