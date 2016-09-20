var os = require('os');
var express = require('express');
var bodyParser = require('body-parser');
var serverDefault = require('./config').serverDefault;
var app = express();
var db = require('./db');

var address = {}, interfaces = os.networkInterfaces();
var netcard = interfaces[serverDefault.interface[os.hostname()]];
for (var inf in netcard) { address[netcard[inf].family] = netcard[inf].address; }

var HOST_IP = process.env.OPENSHIFT_NODEJS_IP || address["IPv4"];
var PORT = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || serverDefault.port;
var STATE = process.env.NODE_ENV || db[serverDefault.state];

db.connect(STATE, function(err) {
  if (err) { console.log(err.stack); }
  else {
    console.log('Database connections are ready to use!')
    start();
  }
})

function addAPIFile(filename, apinode) {
  var url = `/api/${apinode}`;
  var apijs = `./routes/${filename}`;
  app.use(url, require(apijs));
}

function configureRoutes() {
  addAPIFile('assetsRouter', 'asset');
  addAPIFile('serviceRouter', 'service');
  addAPIFile('category/api', 'category');
  addAPIFile('pricing', 'pricing');
  addAPIFile('country', 'country');
  addAPIFile('tenant', 'tenant');
  addAPIFile('user', 'user');
  addAPIFile('sysadmin', 'sysadmin');
}

function start() {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Cache-Control");
    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      return res.end();
    } else {
      return next();
    }
  });

  configureRoutes();

  app.listen(PORT,function(){
    var server =  `${os.hostname()}.${HOST_IP}:${PORT}`;
    var state = `${STATE.toUpperCase()} mode`;
    console.log(`APIs @ ${server} started up!`);
    console.log("~~ Running in " + state);
  });
}
