angular.module('app')
.directive('logOut', function ($location, $log, $timeout, instagramService, ipCookie) {
    return {
        link: function (scope, elem, attrs, ctrl) {
            elem.on('click', function () {
                instagramService.setAccessToken(null);
                ipCookie.remove('access_token');
                $timeout(function () {
                    $location.url('/');
                });
                return;
            });
        }
    };
});
