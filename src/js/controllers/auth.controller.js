var app = angular.module('app');

var AuthCtrl = app.controller('AuthCtrl', function ($scope, $location, $routeParams, ipCookie, instagramService) {

    ipCookie('access_token', $routeParams.access_token, { expires: 30 });
    instagramService.setAccessToken($routeParams.access_token);

    instagramService.getSelfData()
            .then(function (user) {
                ipCookie('self', user , { expires: 30 });
                $scope.hasAccessToken = true;
                $location.replace().url('/user/'+user.username);
            },
            function (meta) {
                ipCookie.remove('access_token');
                $scope.hasAccessToken = false;
            });

});
