angular
  .module('portal.admin.users')
  .controller('AdminFormCtrl', ctrlAdminForm);

ctrlAdminForm.$inject = [
  'BackAPIs', 'EasyHttpSrvc', '$state'
];
function ctrlAdminForm( api, easyhttp, $state ) {
  var form = this;
  form.title = "Administrator Information";
  form.admin = true;
  form.back = back;
  form.save = save;
  form.remove = remove;

  // initialize data used in form
  form.data = {};
  form.inputs = { company: 0, usr_active: false };
  form.user = $state.params.id;
  form.url = !form.user ? api.admin.new : api.admin.user.replace(':id', form.user);

  if (form.user) {
    // load sysuser infos if this form is for editting
    easyhttp.get(form.url,
      function (resp) {
        form.data = normalize(resp);
        form.inputs = angular.copy(form.data);
      }
    );
  }

  // controller's functions
  function back() { $state.go('admin.sysuser'); }
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
      var result = failed ? 'CANNOT SAVE' : 'Success';
      alert(resp.error || `${result}!`);
      if (!failed) $state.go('admin.sysuser');
    }
  }
  function remove() {
    // when the 'DELETE' button is hit
    if (!form.user) return;
    easyhttp.delete(
      api.admin.user.replace(':id', form.user),
      function(resp) {
        var failed = resp.token == 0;
        var msg = failed ? 'CANNOT delete this user right now!'
          : 'This user has been removed!';
        alert(resp.error || msg);
        if (!failed) $state.go('admin.sysuser');
      }
    );
  }

  // controller's helpers
  function normalize(obj) {
    form.repwd = obj.password;
    // map back to client's form object
    return {
      usr_acc: obj.login_id,
      usr_pwd: obj.password,
      usr_name: obj.display_name,
      usr_email: obj.email_address,
      usr_active: obj.active == 1 ? true : false,
      created: new Date(obj.datecreated).toLocaleString(),
    };
  }
  function changed() {
    // get what has been changed since the initialization
    var changed = {};
    for (var k in form.inputs) {
      if (form.data[k] !== form.inputs[k])
      changed[k] = form.inputs[k];
    }

    return changed;
  }

}
