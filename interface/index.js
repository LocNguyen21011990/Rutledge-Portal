var path = require('path');
var os = require('os');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var defaultConfig = require('./config').default;

var address = {}, interfaces = os.networkInterfaces();
var netcard = interfaces[defaultConfig.interface[os.hostname()]];
for (var inf in netcard) { address[netcard[inf].family] = netcard[inf].address; }
var HOST_IP = process.env.OPENSHIFT_NODEJS_IP || address["IPv4"];
var PORT = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || defaultConfig.port;

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'html')));
app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', function(req,res) {
  res.sendFile(path.join(__dirname, 'html/client/index.html'));
});

app.get('/admin', function(req,res) {
  res.sendFile(path.join(__dirname, 'html/admin/index.html'));
});

// for media uploading
app.use('/uploads', require('./media'));

app.listen(PORT, function(err) {
  if (err) { console.log(err); process.exit(1); }
  var this_server = `${os.hostname()}.${HOST_IP}:${PORT}`;
  console.log(`Server alive at ${this_server}`);
});
