var ops = require('./sc-ops');
var table = 'services';
var async = require('async');

exports.mapModel = function(formData) {
    return {
        service: {
            title: formData.title,
            main_image: formData.main_image,
            teaser: formData.teaser,
            main_content: formData.main_content,
            active: formData.active
        },
        service_category: {
            category: formData.categoryId
        },
        service_pricing: {
        	pricing: formData.pricing
        }
    }
}

exports.getServiceById = function (id, done, err) {
	var query = "SELECT s.*, sc.category as categoryId, p.pricing as priceId from ?? as s \
				inner join service_category as sc on s.id = sc.service \
				inner join service_pricing as p on s.id = p.service \
				where s.id = ?";
	var table = ["services", id];
    query = ops.format(query, table); //hàm format là alias đã được export bên db.js
    ops.on().query(query, done);
}
exports.getAllServices = function (done, err) {
	var query = "SELECT c.id as categoryId, c.name as categoryName,\
					   s.id as serviceId, s.title as serviceName, s.main_image, s.teaser, s.main_content, s.active \
				from category as c inner join service_category sc on c.id = sc.category\
				inner join ?? s on s.id = sc.service group by c.name, s.id order by c.name";
    var table = ["services"];
    query = ops.format(query, table); //hàm format là alias đã được export bên db.js
    ops.on().query(query, done);
}

exports.getAllCategories = function (done, err) {
	var query = "SELECT id as categoryId, name as categoryName from ??";
    var table = ["category"];
    query = ops.format(query, table); //hàm format là alias đã được export bên db.js
    ops.on().query(query, done);
}

exports.getPrices = function (done, err) {
	var query = "SELECT id as priceId, name as priceName from ??";
    var table = ["pricing"];
    query = ops.format(query, table); //hàm format là alias đã được export bên db.js
    ops.on().query(query, done);
}


exports.createService = function (formData, done) {
    ops.insert(table, formData, done);
}

exports.addSerCate = function (formData, done) {
    var mid_table = "service_category";
    var query = `INSERT INTO ${mid_table} SET ?`;
    formData = ops.stampID(formData, true);
    ops.on().query(query, formData, done);
}


exports.editSerCate = function (formData, done) {
    var mid_table = "service_category";
    var query = `UPDATE ${mid_table} SET ?? = ? WHERE ?? = ?`;
    var params = ["category", formData.category, "service", formData.service]
    query = ops.format(query, params);
    ops.on().query(query, done);
}


exports.addSerPricing = function (priceId, serviceId, done) {
    var mid_table = "service_pricing";
    var formData = {
        service: serviceId,
        pricing: priceId
    }
    var query = `INSERT INTO ${mid_table} SET ?`;
    formData = ops.stampID(formData, true);
    ops.on().query(query, formData, done);
}


exports.editSerPricing = function (formData, done) {
    var mid_table = "service_pricing";
    var query = `UPDATE ${mid_table} SET ?? = ? WHERE ?? = ?`;
    var params = ["pricing", formData.pricing, "service", formData.service]
    query = ops.format(query, params);
    ops.on().query(query, done);
}


exports.editService = function (formData, done) {
    var query = `UPDATE ${table} SET ? WHERE ?? = ?`;
    var params = [formData, "id", formData.id]
    query = ops.format(query, params);
    ops.on().query(query, done);
}

exports.deleteService = function(id, done) {
    var query = `DELETE FROM ${table} WHERE ?? = ?`;
    var params = ["id", id];
    ops.on().query(query, params, done);
}

exports.deleteSerCate = function(id, done) {
    var mid_table = "service_category";
    var query = `DELETE FROM ${mid_table} WHERE ?? = ?`;
    var params = ["id", id];
    ops.on().query(query, params, done);
}

// exports.deleteSerPricing = function(formData, done) {
//     var mid_table = "service_pricing";
//     console.log(formData);
//     var query = `DELETE FROM ${mid_table} WHERE ?? = ?`;
//     var params = ["service", formData.service.id];
//     query = ops.format(query, params);
//     ops.on().query(query, done);
// }

exports.deleteSerPricingWithServiceId = function(id, done) {
    var mid_table = "service_pricing";
    var query = `DELETE FROM ${mid_table} WHERE ?? = ?`;
    var params = ["service", id];
    ops.on().query(query, params, done);
}



exports.processDeleteService = function (id, done) {
    async.waterfall([async.apply(delService, id), delSerCate, delSerPricing], done)

    function delService(id, cb) {
        exports.deleteService(id, function(err,res) { cb(err, id, res) });
    }
    function delSerCate(id, result, cb) {
        exports.deleteSerCate(id, function(err,res) { cb(err, id, res) })
    }
    function delSerPricing(id, result, cb) {
        exports.deleteSerPricingWithServiceId(id, function(err,res) { cb(err, res) })
    }
}


exports.processEditService = function (formData, done) {
    async.waterfall([async.apply(updateService, formData), updateSerCate, delSerPricing, addSerPricing], done)

    function updateService(data, cb) {
        exports.editService(data.service, function(err,res) { cb(err, data, res) });
    }
    function updateSerCate(data, result, cb) {
        data.service_category.service = data.service.id;
        exports.editSerCate(data.service_category, function(err,res) { cb(err, data, res) })
    }
    function delSerPricing(data, result, cb) {
        exports.deleteSerPricingWithServiceId(data.service.id, function(err,res) { cb(err, data, res) })
    }
    function addSerPricing(data, result, cb) {
        var prices = data.service_pricing.pricing;
        var service = data.service.id;
        async.eachSeries(prices, function iteratee(item, callback) {
            exports.addSerPricing(item, service, function(err,res) { callback(err, res) })
        }, function(err,res) { cb(err, data, res) });
    }
}


exports.processCreateService = function (formData, done) {

    async.waterfall([async.apply(insertService, formData), addSerCate, addSerPricing], done)

    function insertService(data, cb) {
        exports.createService(data.service, function(err,res) { cb(err, data, res) });
    }
    function addSerCate(data, result, cb) {
        data.service_category.service = data.service.id;
        exports.addSerCate(data.service_category, function(err,res) { cb(err, data, res) })
    }
    function addSerPricing(data, result, cb) {
        var prices = data.service_pricing.pricing;
        var service = data.service.id;
        async.eachSeries(prices, function iteratee(item, callback) {
            exports.addSerPricing(item, service, function(err,res) { callback(err, res) })
        }, function(err,res) { cb(err, data, res) });
    }
}

