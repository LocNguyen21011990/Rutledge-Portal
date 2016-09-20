angular
    .module('portal.client.reset')
    .controller('ResetCtrl', ctrlReset)

ctrlReset.$inject = ["$http", "$state", "BackendSrvc"]

function ctrlReset(http, state, backAPI) {
  var vm = this;
  var usr_id = state.params.id;

  vm.go = reset;
  vm.pwd = vm.repwd = '';

  function reset() {
    if (vm.pwd === '' || vm.pwd === '') return;
    if (vm.pwd !== vm.repwd) return alert('Passwords do not match!');

    http.put(backAPI.user + `/${usr_id}`, { usr_pwd: vm.pwd })

      .success(function(resp) {
        console.log(resp);
        var result = resp.token > 0 ? "New password is now in use" : null;
        alert(result || "Can't update this new password!");
        if (result) state.go('home');
      })

      .error(function(resp) {
        console.log(resp);
        alert('Sorry! Can\'t be done right now!')
      });
  }
}
