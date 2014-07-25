var app = angular.module('app');

var MainCtrl = app.controller('MainCtrl', function ($scope, $location, $routeParams, ipCookie, instagramApiData, instagramService) {
    $scope.clientId = instagramApiData.clientId;
    $scope.redirectUri = instagramApiData.redirectUri;

    if(ipCookie('access_token') || instagramApiData.hasAccessToken) {
        console.log('cookie found', ipCookie('access_token'));
        instagramService.setAccessToken(ipCookie('access_token'));

        instagramService.getSelfData()
            .then(function (user) {
                debugger;
                ipCookie('self', user , { expires: 30 });
                $scope.hasAccessToken = true;
                $location.replace().url('/media/self');
            },
            function (meta) {
                ipCookie.remove('access_token');
                $scope.hasAccessToken = false;
            });
    }

});
