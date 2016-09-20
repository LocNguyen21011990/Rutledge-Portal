angular
    .module('portal.client')
    .controller('ForgotCtrl', ctrlForgot)

ctrlForgot.$inject = ["$http", "$state", "BackendSrvc"]

function ctrlForgot(http, state, backAPI) {
  var vm = this;

  vm.go = reset;
  vm.email = '';

  function reset() {
    if (vm.email === '') return;

    http.post(backAPI.user + `/reset`, { usr_email: vm.email })

      .success(function(resp) {
        console.log(resp);
        if (resp.token < 1) return alert("This email does NOT exist!")
        alert("Please check your inbox!");
        state.go('reset', { id: resp.id });
      })

      .error(function(resp) {
        console.log(resp);
        alert("Sorry! Please do it later!");
        state.go('home');
      });
  }

}
