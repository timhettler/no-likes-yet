angular.module('app')
.directive('disableScroll', function ($rootScope, $location, $log, instagramService, ipCookie) {
    return {
        link: function (scope, elem, attrs, ctrl) {
            elem.on('touchmove', function (e) {
                e.preventDefault();
            });
        }
    };
});
