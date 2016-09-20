var model = require('../models/assets');
var serv = require('../models/services/assetsService');
var router = require('express').Router();

router.get('/all', function (req, res) {
	serv.getAllAssets(function(err, rows, fields) {
		if(err) {
            res.json({"Error" : true, "Message" : "Error executing MySQL query"});
        } else {
            res.json({"Error" : false, "Message" : "Success", "data" : rows});
        }
	})
})


router.get('/listDir', function (req, res) {
	res.json({"Error" : false, "Message" : "Success", "data" : serv.getDirectories()});
})
// router.post('/new', function (req, res) {
//     var objService = model.mapModel(req.body);
//     serv.processCreateService(objService, function (err, result) {
//         if(err) {
//             console.log(err.stack);
//             res.json({"Error" : true, "Message" : "Error executing MySQL query"});
//         } else {
//             res.json({"Error" : false, "Message" : "Success", "data" : result});
//         }
//     });
// })


// router.route('/:id')
// .put(function (req, res) {
// 	var objService = model.mapModel(req.body);
//     objService.service.id = req.params.id;
//     serv.processEditService(objService, function (err, result) {
//         if(err) {
//             console.log(err.stack);
//             res.json({"Error" : true, "Message" : "Error executing MySQL query"});
//         } else {
//             res.json({"Error" : false, "Message" : "Success", "data" : result});
//         }
//     });
// })
// .delete(function (req, res) {
// 	serv.processDeleteService(req.params.id, function (err, result) {
//         if(err) {
//             console.log(err.stack);
//             res.json({"Error" : true, "Message" : "Error executing MySQL query"});
//         } else {
//             res.json({"Error" : false, "Message" : "Success", "data" : result});
//         }
//     });
// })

module.exports = router;
