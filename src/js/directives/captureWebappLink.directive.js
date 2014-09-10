angular.module('app')
.directive('captureWebappLink', function ($location) {
    return {
        link: function (scope, elem, attrs, ctrl) {
            elem.on('click', function (e) {
                if (('standalone' in navigator) && navigator['standalone']) {
                    window.location = e.target.href;
                    e.preventDefault();
                    return false;
                }
            });
        }
    };
});
