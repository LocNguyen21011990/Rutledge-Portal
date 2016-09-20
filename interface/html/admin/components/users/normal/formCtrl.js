angular
  .module('portal.admin.users')
  .controller('FormCtrl', ctrlForm);

ctrlForm.$inject = [
  'BackAPIs', 'EasyHttpSrvc',
  '$state', '$stateParams'
];
function ctrlForm(api, easyhttp, $state) {
  var form = this;
  form.title = 'User Information';
  form.save = save;
  form.remove = remove;

  // initialize data used in form
  form.data = {};
  form.inputs = {};
  form.user = $state.params.id;
  form.url = !form.user ? api.new : api.user.replace(':id', form.user);

  // load essential data
  form.companies = [];
  form.allowed = false;
  easyhttp.get(api.tenants, // `resp` is explicitly an array
    function (resp) {
      form.companies = resp;
      form.locked = form.companies.length < 1;
    }
  );
  if (form.user) {
    easyhttp.get(form.url,
      function (resp) {
        form.data = normalize(resp);
        form.inputs = angular.copy(form.data);
      }
    );
  }

  // controller functions
  function save(isValid) {
    // when the 'SAVE' button is hit
    if (isValid) {
      // alert('Everything is validated!');
      var inputted = changed();
      console.log(inputted);
      if (Object.keys(inputted).length > 0)
        easyhttp.save(form.url, inputted, savedorNot, !form.user);
    }

    // saving helper
    function savedorNot(resp) {
      console.log(resp);
      var failed = resp.token == 0;
      var result = failed ? 'Failed' : 'Success';
      alert(resp.error || `${result}!`);
      if (!failed) $state.go('admin.users');
    }
  }
  function remove() {
    // when the 'DELETE' button is hit
    if (!form.user) return;
    easyhttp.delete(
      api.user.replace(':id', form.user),
      function(resp) {
        var failed = resp.token == 0;
        var msg = failed ? 'CANNOT delete this user right now!'
          : 'This user has been removed!';
        alert(resp.error || msg);
        if (!failed) $state.go('admin.users');
      }
    );
  }

  // helper funcs
  function normalize(obj) {
    form.repwd = obj.password;
    // convert back to client's form object
    return {
      usr_acc: obj.login_id,
      usr_pwd: obj.password,
      usr_name: obj.display_name,
      usr_email: obj.email_address,
      usr_active: obj.active == 1 ? true : false,
      created: new Date(obj.datecreated).toLocaleString(),
      company: obj.tenant
    };
  }
  function changed() {
    // get what has been changed since the initialization
    var changed = { usr_active: false };
    for (var k in form.inputs) {
      if (form.data[k] !== form.inputs[k])
        changed[k] = form.inputs[k];
    }

    return changed;
  }

}
