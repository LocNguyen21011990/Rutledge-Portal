var model = require('../service');

exports.getServiceById = function (id, done, err) {
	model.getServiceById(id, done, err);
}
exports.getAllServices = function (done, err) {
	model.getAllServices(done, err);
}

exports.getAllCategories = function (done, err) {
	model.getAllCategories(done, err);
}

exports.getPrices = function (done, err) {
	model.getPrices(done, err);
}

exports.createService = function (formData, done) {
	model.createService(formData, err);
}

exports.addSerCate = function (formData, done) {
    model.addSerCate(formData, done);
}

exports.editSerCate = function (formData, done) {
	model.editSerCate(formData, done);
}

exports.editService = function (formData, done) {
	model.editService(formData, done);
}

exports.deleteService = function(id, done) {
	model.deleteService(id, done);
}

exports.deleteSerCate = function(id, done) {
	model.deleteSerCate(id, done);
}

exports.processDeleteService = function (id, done) {
	model.processDeleteService(id, done);
}


exports.processEditService = function (formData, done) {
	model.processEditService(formData, done);
}


exports.processCreateService = function (formData, done) {
	model.processCreateService(formData, done);
}
