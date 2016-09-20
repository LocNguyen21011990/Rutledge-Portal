var router = require('express').Router();
var user = require('../models/user');
var serv = require('../models/services/userService');

router.post('/login', function(req, res) {
  var apires = { error: null, session: null };
  var acc = user.mapModel(req.body);
  serv.login(acc.login_id, acc.password, function(err, result) {
    if (err) {
      console.log("Error:", err.message);
      apires.error = err.message;
    } else {
      console.log("Result:", result);
      // this should be replaced by a real session id in the future
      // for now, the `id` of user-tenant relation is used instead
      apires.session = result[0].id;
    }
    res.send(apires);
  })
})

router.post('/reset', function(req, res) {
  var apires = { error: null, token: 0 };
  // check if submitted email is existed?
  user.checkEmail(req.body.usr_email, function(err, rows) {
    if (err) {
      // Nope!
      console.log("Error:", err.message);
      apires.error = err.message;
    }
    if (rows.length == 1) {
      console.log("Result:", rows);
      // 1. Generate a link to enter new password
      // 2. Send an email with that link

      apires.token = 1; // this is simple enough for now!
      apires.id = rows[0].id;
    }
    // send back the result
    res.json(apires);
  });
})

router.get('/list', function(req, res) {
  serv.fullInfos(function(err, result) {
    var list = [];
    if (err) console.log("Error:", err.message);
    if (!err) {
      console.log("Result:", result);
      list = result;
    }
    res.json(list);
  })
})

router.post('/new', function(req, res) {
  var apires = { error: null, token: 0 };
  // if an empty form is submitted...
  if (Object.keys(req.body).length < 1) return res.json(apires);
  // else execute the inserting...
  var newInfo = serv.mapInfos(req.body);
  serv.newUser(newInfo, function(err, result) {
    if (err) {
      console.log("Error:", err.message);
      apires.error = err.message;
    }
    if (!err) {
      console.log("Result:", result);
      apires.token = result.affectedRows;
    }
    res.send(apires);
  })
});

router.route('/:id')
  .put(function(req, res) {
    // simple-enough updating process for users
    // resetting password is a request to this route for now

    var apires = { error: null, token: 0 };
    // if an empty form is submitted...
    if (Object.keys(req.body).length < 1) return res.json(apires)
    // else execute the inserting...
    var newInfo = serv.mapInfos(req.body);

    serv.editUser(req.params.id, newInfo, function(err, result) {
      if (err) {
        console.log("Error:", err.message);
        apires.error = err.message;
      }
      if (!err) {
        console.log("Result:", result);
        apires.token = result.affectedRows;
      }
      res.send(apires);
    })
  })

  .get(function(req, res) {
    serv.fullInfos(req.params.id, function(err, rows) {
      var record = {};
      if (err) console.log("Error:", err.message);
      if (!err) {
        console.log("Result:", rows[0]);
        record = rows[0] || {};
      }
      res.json(record);
    })
  })

  .delete(function(req, res) {
    var apires = { error: null, token: 0 };
    serv.removeUser(req.params.id, function(err, result) {
      if (err) {
        console.log("Error:", err.message);
        apires.error = err.message;
      }
      if (!err) {
        console.log("Result:", result);
        apires.token = result.affectedRows;
      }
      res.json(apires);
    })
  });

module.exports = router;
