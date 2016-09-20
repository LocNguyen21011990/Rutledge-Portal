var model = require('../models/service');
var serv = require('../models/services/serviceService');
var router = require('express').Router();

router.post('/new', function (req, res) {
    var objService = model.mapModel(req.body);
    serv.processCreateService(objService, function (err, result) {
        if(err) {
            console.log(err.stack);
            res.json({"Error" : true, "Message" : "Error executing MySQL query"});
        } else {
            res.json({"Error" : false, "Message" : "Success", "data" : result});
        }
    });
})


router.route('/:id')
.put(function (req, res) {
	var objService = model.mapModel(req.body);
    objService.service.id = req.params.id;
    serv.processEditService(objService, function (err, result) {
        if(err) {
            console.log(err.stack);
            res.json({"Error" : true, "Message" : "Error executing MySQL query"});
        } else {
            res.json({"Error" : false, "Message" : "Success", "data" : result});
        }
    });
})
.delete(function (req, res) {
	serv.processDeleteService(req.params.id, function (err, result) {
        if(err) {
            console.log(err.stack);
            res.json({"Error" : true, "Message" : "Error executing MySQL query"});
        } else {
            res.json({"Error" : false, "Message" : "Success", "data" : result});
        }
    });
})


// router.post('/edit', function (req, res) {
//     var objService = model.mapModel(req.body);
//     objService.service.id = req.body.id;
//     serv.processEditService(objService, function (err, result) {
//         if(err) {
//             console.log(err.stack);
//             res.json({"Error" : true, "Message" : "Error executing MySQL query"});
//         } else {
//             res.json({"Error" : false, "Message" : "Success", "data" : result});
//         }
//     });
// })

// router.post('/delete/:id', function (req, res) {
//     serv.processDeleteService(req.params.id, function (err, result) {
//         if(err) {
//             console.log(err.stack);
//             res.json({"Error" : true, "Message" : "Error executing MySQL query"});
//         } else {
//             res.json({"Error" : false, "Message" : "Success", "data" : result});
//         }
//     });
// })

router.get('/listbyid/:id' , function (req, res) {
	serv.getServiceById(req.params.id, function(err, rows, fields) {
		if(err) {
            res.json({"Error" : true, "Message" : "Error executing MySQL query"});
        } else {
            res.json({"Error" : false, "Message" : "Success", "data" : rows});
        }
	})
})

router.get('/listwithcategory', function (req, res) {
	serv.getAllServices(function(err, rows, fields) {
		if(err) {
            res.json({"Error" : true, "Message" : "Error executing MySQL query"});
        } else {
            res.json({"Error" : false, "Message" : "Success", "data" : rows});
        }
	})
})

router.get('/listcategory', function (req, res) {
	serv.getAllCategories(function(err, rows, fields) {
		if(err) {
            res.json({"Error" : true, "Message" : "Error executing MySQL query"});
        } else {
            res.json({"Error" : false, "Message" : "Success", "data" : rows});
        }
	})
})

router.get('/listpricing', function (req, res) {
	serv.getPrices(function(err, rows, fields) {
		if(err) {
            res.json({"Error" : true, "Message" : "Error executing MySQL query"});
        } else {
            res.json({"Error" : false, "Message" : "Success", "data" : rows});
        }
	})
})

module.exports = router;
