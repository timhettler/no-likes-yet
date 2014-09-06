var app = angular.module('app');

var AuthCtrl = app.controller('AuthCtrl', function ($scope, $location, $routeParams, ipCookie, instagramService) {

    ipCookie('access_token', $routeParams.access_token, { expires: 30 });
    instagramService.setAccessToken($routeParams.access_token);

    instagramService.getSelfData()
            .then(function (user) {
                var type = ipCookie('attemptedRoute') ? ipCookie('attemptedRoute') : 'world';

                ipCookie('self', user , { expires: 30 });
                ipCookie.remove('attemptedRoute');
                $scope.hasAccessToken = true;

                $location.replace().url('/media/?type='+type);
            },
            function (meta) {
                ipCookie.remove('access_token');
                $scope.hasAccessToken = false;
            });

});
