angular
  .module('portal.client')
  .controller('RegisterCtrl', ctrlRegister)

ctrlRegister.$inject = ['RegisterSrvc', 'CountryListSrvc']

function ctrlRegister(srvcReg, cntryList) {
  var vm = this;
  var nofields = 18;

  vm.countries = cntryList;
  vm.go = register;
  vm.form = init();

  /* actual functions */

  function init() {
    return {
      cpn_title: "Mr",
      cpn_job: "Chief Executive Officer",
      cpn_country: 1
    };
  }

  function register() {
    if (validated()) srvcReg(vm.form, success, failed);
  }

  function validated() {
    if (Object.keys(vm.form).length != nofields) {
      alert('Not enough information!');
      return false;
    }
    if (vm.form.usr_pwd !== vm.form.usr_repwd) {
      alert('Passwords do not match!');
      return false
    }
    return true;
  }

  function success(resp) {
    console.log(resp);
    var result = resp.token < 1 ? 'Failed'
      : (function() {
        vm.form = init();
        return 'Success';
      })();
    alert(`Registration ${result}!`);
  }

  function failed(resp) {
    console.log(resp);
    alert('Sorry! Your registration can\'t be done right now!');
  }
}
