var ops = require('./sc-ops');
var table = 'asset';

exports.mapModel = function(formData) {
    return {
        asset: {
            title: formData.title,
            content: formData.content,
            patch: formData.patch,
            file_name: formData.file_name
        }
    }
}

exports.getAllAssets = function (done, err) {
	var query = "SELECT * from ??";
    query = ops.format(query, table); //hàm format là alias đã được export bên db.js
    ops.on().query(query, done);
}