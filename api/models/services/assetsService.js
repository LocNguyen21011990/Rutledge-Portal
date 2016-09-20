var model = require('../assets');
var fs = require('fs'),
    path = require('path');
var filetree = {};

exports.getDirectories = function() {
  	// return fs.readdirSync('../interface/assets/admin/uploads/');
  	var path = '../interface/assets/admin/uploads/';
  	return fs.readdirSync(path).filter(function (file) {
	    return fs.statSync(path+'/'+file).isDirectory();
	  });
}

exports.getAllAssets = function (done, err) {
	model.getAllAssets(done, err);
}