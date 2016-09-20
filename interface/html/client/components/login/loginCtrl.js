angular
    .module('portal.client')
    .controller('LoginCtrl', ctrlLogin)

ctrlLogin.$inject = ["$http", "$state", "BackendSrvc"]

function ctrlLogin(http, state, backAPI) {
  var vm = this;

  vm.go = login;
  vm.info = { usr_acc: '', usr_pwd: '' }

  function login(isValid) {
    if (!isValid) return;

    http.post(backAPI.user + '/login', vm.info)

      .success(function(resp) {
        console.log(resp);
        var mesg = resp.error || "Have yourself a good time!";
        alert(mesg);
        if (resp.session) state.go('services');
      })

      .error(function(resp) {
        console.log(resp);
        alert("Sorry, you can't sign in right now!\nPlease come back later!");
      });
  }
}
