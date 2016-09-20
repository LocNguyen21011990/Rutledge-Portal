angular
  .module('portal.admin.asset')
  .controller('UploadCtrl', ctrlUpload);

ctrlUpload.$inject = ['Upload', '$timeout']
function ctrlUpload (Upload, $timeout) {
  var asset = this;
  console.log(Upload);
  asset.uploadPic = function(file) {
    console.log(file);
    file.upload = Upload.upload({
      url: '/uploads',
      data: { username: asset.title, file: file },
    });

    file.upload.then(function (response) {
      $timeout(function () {
        file.result = response.data;
        console.log(response);
        console.log(file);
      });
    }, function (response) {
      if (response.status > 0)
        asset.errorMsg = response.status + ': ' + response.data;
    }, function (evt) {
      // Math.min is to fix IE which reports 200% sometimes
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    });
  }
}
