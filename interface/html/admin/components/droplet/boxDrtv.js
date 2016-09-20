angular
  .module('portal.admin.uploads')
  .directive('progressbar', ProgressbarDirective);

function ProgressbarDirective() {

    return {

        restrict: 'A', /** @property restrict @type {String} */
        scope: { /** @property scope @type {Object} */
            model: '=ngModel'
        },
        require: 'ngModel', /** @property ngModel @type {String} */

        /**
         * @method link
         * @param scope {Object}
         * @param element {Object}
         * @return {void}
         */
        link: function link(scope, element) {

            var progressBar = new ProgressBar.Path(
              element[0],
              { strokeWidth: 2 }
            );

            scope.$watch('model', function() {
                progressBar.animate(scope.model / 100, {
                    duration: 1000
                });
            });

            scope.$on('$dropletSuccess', function onSuccess() {
                progressBar.animate(0);
            });

            scope.$on('$dropletError', function onSuccess() {
                progressBar.animate(0);
            });

        }

    }

}
