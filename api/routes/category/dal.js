var db = require(process.env.DB_CONN);
var table = 'category';

exports.mapModel = function (formData) {
	return {
		name: formData.categoryName
	}
}


exports.create = function(form, done) {
  var stmt = `INSERT INTO ${table} SET ?`;
  db.stampID(form, true);
  db.on().query(stmt, form, done);
}