var router = require('express').Router();
var multer = require('multer')
var uploads = multer({ dest: __dirname + '/assets/admin/uploads' });

router.post('/', uploads.any(),
  function(request, response) {
    console.log(request.body);
    // hendling files uploading
    var count = request.files.length;
    var result = { success: true, fileCount: count };
    response.status(200).send(result);
  }
);

module.exports = router;
